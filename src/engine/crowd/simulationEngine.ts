import { 
  SimulationAssumptions, 
  SimulationResult, 
  SimulationTick, 
  Venue, 
  VenueElement 
} from '../../types';
import { SeededRandom } from '../../lib/utils';

export function runDeterministicSimulation(
  venue: Venue,
  assumptions: SimulationAssumptions,
  eventId: string
): SimulationResult {
  const rng = new SeededRandom(assumptions.randomSeed || 42);
  const duration = assumptions.simulationDurationMinutes || 180;
  const totalAttendees = assumptions.totalExpectedAttendees || 8000;
  
  // Extract venue elements
  const gates = venue.elements.filter(
    e => e.type === 'gate' && !assumptions.disabledGates.includes(e.id)
  );
  const allGates = venue.elements.filter(e => e.type === 'gate');
  const exits = venue.elements.filter(
    e => e.type === 'exit' && !assumptions.disabledExits.includes(e.id)
  );
  const zones = venue.elements.filter(
    e => e.type === 'zone' || e.type === 'food_court' || e.type === 'medical'
  );
  const stages = venue.elements.filter(e => e.type === 'stage');

  // Gate capacities in people per minute
  const gateCapacityPerMinute: Record<string, number> = {};
  allGates.forEach(g => {
    const hourly = assumptions.gateThroughputs[g.id] ?? g.throughputPerHour ?? 1200;
    // Weather factor reduces throughput slightly if wet/slippery
    gateCapacityPerMinute[g.id] = (hourly / 60) * (assumptions.weatherFactor || 1.0);
  });

  // Exit capacities in people per minute
  const exitCapacityPerMinute: Record<string, number> = {};
  exits.forEach(e => {
    const hourly = e.throughputPerHour || 1600;
    exitCapacityPerMinute[e.id] = (hourly / 60) * (assumptions.weatherFactor || 1.0);
  });

  // Calculate arrival profile across minutes [0..duration]
  const arrivalCurve: number[] = new Array(duration).fill(0);
  let curveSum = 0;

  for (let m = 0; m < duration; m++) {
    let weight = 0;
    const progress = m / duration;

    switch (assumptions.arrivalDistribution) {
      case 'steep_peak': {
        // High surge around minute 45 - 85
        const center = 0.35;
        const width = 0.12;
        weight = Math.exp(-Math.pow((progress - center) / width, 2));
        break;
      }
      case 'dual_surge': {
        // Early rush at 0.25 (opening) and second rush at 0.65 (headliner stage)
        const w1 = Math.exp(-Math.pow((progress - 0.22) / 0.1, 2));
        const w2 = Math.exp(-Math.pow((progress - 0.62) / 0.12, 2)) * 1.3;
        weight = w1 + w2;
        break;
      }
      case 'flat': {
        weight = progress < 0.8 ? 1.0 : 0.2;
        break;
      }
      case 'gradual':
      default: {
        // Normal distribution centered at 40% into the event
        const center = 0.40;
        const width = 0.22;
        weight = Math.exp(-Math.pow((progress - center) / width, 2));
        break;
      }
    }

    arrivalCurve[m] = Math.max(0.01, weight);
    curveSum += arrivalCurve[m];
  }

  // Normalize arrival numbers
  const minuteArrivals = arrivalCurve.map(w => Math.round((w / curveSum) * totalAttendees));

  // State trackers
  let currentInVenue = 0;
  let totalEntered = 0;
  let totalExited = 0;

  const currentGateQueues: Record<string, number> = {};
  allGates.forEach(g => { currentGateQueues[g.id] = 0; });

  const currentZoneOccupancy: Record<string, number> = {};
  zones.forEach(z => { currentZoneOccupancy[z.id] = 0; });

  const zonePeakOccupancies: Record<string, number> = {};
  const zonePeakMinutes: Record<string, number> = {};
  zones.forEach(z => {
    zonePeakOccupancies[z.id] = 0;
    zonePeakMinutes[z.id] = 0;
  });

  const ticks: SimulationTick[] = [];
  let peakTotalInVenue = 0;
  let peakMinute = 0;
  let cumulativeGateWaitTimes = 0;
  let totalQueuedArrivalsCount = 0;
  let maxGateQueueOverall = 0;

  // Track sample visual agents (up to 180 agents with coordinates)
  interface AgentState {
    id: number;
    x: number;
    y: number;
    targetZoneId: string;
    currentZoneId: string;
    status: 'walking' | 'at_zone' | 'queuing' | 'exiting';
  }
  const sampleAgentsCount = 120;
  const sampleAgents: AgentState[] = [];

  for (let i = 0; i < sampleAgentsCount; i++) {
    const assignedGate = gates.length > 0 ? gates[i % gates.length] : allGates[0];
    sampleAgents.push({
      id: i,
      x: assignedGate ? assignedGate.x + assignedGate.width / 2 : 100,
      y: assignedGate ? assignedGate.y + assignedGate.height / 2 : 100,
      targetZoneId: zones[i % zones.length]?.id || '',
      currentZoneId: 'gate',
      status: 'queuing'
    });
  }

  // Iterate minute by minute
  for (let m = 0; m < duration; m++) {
    const arrivingThisMinute = minuteArrivals[m] || 0;

    // Distribute arrivals across open gates
    if (gates.length > 0) {
      const perGate = Math.floor(arrivingThisMinute / gates.length);
      const remainder = arrivingThisMinute % gates.length;
      gates.forEach((g, idx) => {
        currentGateQueues[g.id] += perGate + (idx < remainder ? 1 : 0);
      });
    }

    // Process gate entries
    let enteredThisMinute = 0;
    const bottleneckGates: string[] = [];

    allGates.forEach(g => {
      const q = currentGateQueues[g.id];
      const cap = gateCapacityPerMinute[g.id] || 20;

      if (q > cap * 2) {
        bottleneckGates.push(g.id);
      }
      if (q > maxGateQueueOverall) {
        maxGateQueueOverall = q;
      }

      if (q > 0) {
        totalQueuedArrivalsCount += q;
        cumulativeGateWaitTimes += q / (cap || 1);
      }

      const canPass = Math.min(q, Math.round(cap));
      currentGateQueues[g.id] = Math.max(0, q - canPass);
      enteredThisMinute += canPass;
    });

    totalEntered += enteredThisMinute;
    currentInVenue += enteredThisMinute;

    // Determine zone attraction modifiers based on active stage schedule
    const zoneAttractions: Record<string, number> = {};
    zones.forEach(z => {
      let baseAttr = assumptions.zoneAttraction[z.id] || 5;
      
      // If a stage schedule is active near this zone or within it
      assumptions.stageSchedules.forEach(sched => {
        if (m >= sched.startMinute && m <= sched.endMinute) {
          const associatedStage = stages.find(s => s.id === sched.stageId);
          if (associatedStage && (z.connectedZoneId === associatedStage.id || z.name.toLowerCase().includes('stage') || z.id.includes('lawn_a') || z.id.includes('main'))) {
            baseAttr += sched.attractionWeight * 4.5;
          }
        }
      });

      // Food courts attract more around meal hours (e.g. min 50-90)
      if (z.type === 'food_court' && m >= 45 && m <= 95) {
        baseAttr += 6;
      }

      zoneAttractions[z.id] = Math.max(1, baseAttr);
    });

    // Total attraction sum
    const totalAttr = Object.values(zoneAttractions).reduce((a, b) => a + b, 0);

    // Reallocate current in venue to zones based on attractions
    // Transition smoothly
    zones.forEach(z => {
      const targetCount = Math.round((zoneAttractions[z.id] / totalAttr) * currentInVenue);
      const diff = targetCount - currentZoneOccupancy[z.id];
      // Move 20% toward target each minute
      const shift = Math.round(diff * 0.22);
      currentZoneOccupancy[z.id] = Math.max(0, currentZoneOccupancy[z.id] + shift);

      if (currentZoneOccupancy[z.id] > zonePeakOccupancies[z.id]) {
        zonePeakOccupancies[z.id] = currentZoneOccupancy[z.id];
        zonePeakMinutes[z.id] = m;
      }
    });

    // People start exiting as the event wraps up (last 25% of duration)
    let exitedThisMinute = 0;
    if (m > duration * 0.75) {
      const exitSurgeFactor = Math.pow((m - duration * 0.75) / (duration * 0.25), 2);
      const wantToExit = Math.round((currentInVenue * 0.08) * exitSurgeFactor);
      
      // Total exit capacity across remaining open exits
      const totalExitCap = Object.values(exitCapacityPerMinute).reduce((a, b) => a + b, 0);
      exitedThisMinute = Math.min(wantToExit, Math.round(totalExitCap), currentInVenue);

      currentInVenue -= exitedThisMinute;
      totalExited += exitedThisMinute;

      // Deduct from zones proportionately
      if (currentInVenue > 0) {
        zones.forEach(z => {
          currentZoneOccupancy[z.id] = Math.max(
            0,
            Math.round(currentZoneOccupancy[z.id] * (1 - (exitedThisMinute / (currentInVenue + exitedThisMinute))))
          );
        });
      } else {
        zones.forEach(z => { currentZoneOccupancy[z.id] = 0; });
      }
    }

    if (currentInVenue > peakTotalInVenue) {
      peakTotalInVenue = currentInVenue;
      peakMinute = m;
    }

    // High density zone alerts
    const highDensityZones: string[] = [];
    zones.forEach(z => {
      const cap = z.capacity || 1000;
      if (currentZoneOccupancy[z.id] > cap * 0.9) {
        highDensityZones.push(z.id);
      }
    });

    // Update sample agents visually
    sampleAgents.forEach((agent, i) => {
      const targetZ = zones.find(z => z.id === agent.targetZoneId) || zones[i % zones.length];
      if (!targetZ) return;

      const targetCenterX = targetZ.x + targetZ.width / 2;
      const targetCenterY = targetZ.y + targetZ.height / 2;

      // Jitter inside the zone
      const jitterX = (rng.nextFloat() - 0.5) * (targetZ.width * 0.6);
      const jitterY = (rng.nextFloat() - 0.5) * (targetZ.height * 0.6);

      const destX = targetCenterX + jitterX;
      const destY = targetCenterY + jitterY;

      // Walk toward destination
      const dx = destX - agent.x;
      const dy = destY - agent.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 8) {
        agent.x += (dx / dist) * 4.5 * (assumptions.walkingSpeedMps / 1.3);
        agent.y += (dy / dist) * 4.5 * (assumptions.walkingSpeedMps / 1.3);
        agent.status = 'walking';
      } else {
        agent.status = 'at_zone';
        agent.currentZoneId = targetZ.id;
        // Occasionally pick new zone
        if (rng.nextFloat() < 0.03) {
          agent.targetZoneId = zones[Math.floor(rng.nextFloat() * zones.length)].id;
        }
      }
    });

    ticks.push({
      minute: m,
      totalEntered,
      totalInVenue: currentInVenue,
      totalExited,
      zoneOccupancies: { ...currentZoneOccupancy },
      gateQueues: { ...currentGateQueues },
      bottleneckGateIds: [...bottleneckGates],
      highDensityZoneIds: [...highDensityZones],
      agentsSample: sampleAgents.map(a => ({
        id: a.id,
        x: Math.round(a.x),
        y: Math.round(a.y),
        status: a.status,
        zoneId: a.targetZoneId
      }))
    });
  }

  // Calculate zone capacity exceedance
  const zoneCapacityExceedance: Record<string, {
    exceeded: boolean;
    peakCount: number;
    capacity: number;
    ratio: number;
    peakMinute: number;
  }> = {};

  const bottleneckLocations: string[] = [];

  zones.forEach(z => {
    const cap = z.capacity || 1000;
    const peak = zonePeakOccupancies[z.id] || 0;
    const ratio = peak / cap;
    const exceeded = ratio > 1.0;

    zoneCapacityExceedance[z.id] = {
      exceeded,
      peakCount: peak,
      capacity: cap,
      ratio: Math.round(ratio * 100) / 100,
      peakMinute: zonePeakMinutes[z.id] || 0
    };

    if (ratio > 0.9) {
      bottleneckLocations.push(`${z.name} (Simulated peak: ${peak}/${cap} attendees, ${Math.round(ratio * 100)}%)`);
    }
  });

  // Check gate queues for bottlenecks
  allGates.forEach(g => {
    const maxQ = Math.max(...ticks.map(t => t.gateQueues[g.id] || 0));
    if (maxQ > (gateCapacityPerMinute[g.id] || 20) * 1.5) {
      bottleneckLocations.push(`${g.name} Ingress Queue (Max queued: ${maxQ} attendees)`);
    }
  });

  // Calculate average wait time in minutes
  const avgWait = totalQueuedArrivalsCount > 0 
    ? Math.round((cumulativeGateWaitTimes / Math.max(1, totalQueuedArrivalsCount)) * 10) / 10 
    : 0;

  // Synthesize operational recommendations
  const operationalRecommendations: string[] = [];
  
  if (assumptions.disabledExits.length > 0) {
    operationalRecommendations.push(
      `Noticeable egress constriction: ${assumptions.disabledExits.length} exit(s) closed. Egress surge at T+${Math.round(duration * 0.75)}m requires pre-positioning security along secondary avenues.`
    );
  }

  if (bottleneckLocations.length > 0) {
    operationalRecommendations.push(
      `High density alerts detected in ${bottleneckLocations.length} locations. Deploy marshals to maintain continuous one-way pedestrian flow.`
    );
  }

  if (avgWait > 12) {
    operationalRecommendations.push(
      `Average ingress queue wait time reaches ~${avgWait} mins during initial rush. Recommend staggering student ticket waves or adding auxiliary ticket validation lanes.`
    );
  } else {
    operationalRecommendations.push(
      `Ingress throughput is within acceptable operational tolerance (~${avgWait} mins average wait). Keep primary lanes unobstructed.`
    );
  }

  return {
    id: `sim_${Date.now()}_${rng.nextInt() % 10000}`,
    eventId,
    calculatedAt: new Date().toISOString(),
    assumptions,
    peakTotalInVenue,
    peakMinute,
    zonePeakOccupancies,
    zoneCapacityExceedance,
    bottleneckLocations,
    averageGateWaitMinutes: avgWait,
    maxGateQueueCount: maxGateQueueOverall,
    operationalRecommendations,
    ticks
  };
}
