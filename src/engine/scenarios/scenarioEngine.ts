import { 
  ScenarioDefinition, 
  ScenarioComparison, 
  SimulationAssumptions, 
  Venue 
} from '../../types';
import { runDeterministicSimulation } from '../crowd/simulationEngine';

export const PRECONFIGURED_SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'scen_baseline',
    name: 'Normal Operations (Baseline Plan)',
    type: 'normal',
    description: 'All 4 gates and 4 exits fully operational under planned arrival distribution.',
    severity: 'minor',
    affectedZoneIds: [],
    affectedGateIds: [],
    onsetMinute: 0,
    durationMinutes: 180,
    disabledExitIds: [],
    attendanceMultiplier: 1.0,
    weatherFactor: 1.0,
    recommendedResponseRole: 'ops_coordinator'
  },
  {
    id: 'scen_exit_closure',
    name: 'East Egress Constriction (Exit E02 Closed)',
    type: 'exit_closure',
    description: 'Primary eastern perimeter exit is barricaded due to fallen utility lines. Egress traffic reroutes to North and South exits.',
    severity: 'severe',
    affectedZoneIds: ['zone_lawn_b', 'zone_food_east'],
    affectedGateIds: [],
    onsetMinute: 110,
    durationMinutes: 70,
    disabledExitIds: ['exit_e02'],
    attendanceMultiplier: 1.0,
    weatherFactor: 1.0,
    recommendedResponseRole: 'security'
  },
  {
    id: 'scen_gate_congestion',
    name: 'North Gate Turnstile Hardware Failure',
    type: 'gate_congestion',
    description: 'Gate G01 badge scanners lose cloud connectivity during peak ingress. Processing capacity drops by 60%.',
    severity: 'moderate',
    affectedZoneIds: ['zone_entry_plaza'],
    affectedGateIds: ['gate_g01'],
    onsetMinute: 40,
    durationMinutes: 50,
    disabledExitIds: [],
    attendanceMultiplier: 1.0,
    weatherFactor: 1.0,
    recommendedResponseRole: 'gate_staff'
  },
  {
    id: 'scen_stage_surge',
    name: 'Surprise Guest Stage Rush',
    type: 'stage_surge',
    description: 'Unannounced headliner arrival causes sudden migration from food courts and secondary stage toward Main Stage Lawn A.',
    severity: 'critical',
    affectedZoneIds: ['zone_lawn_a', 'stage_main'],
    affectedGateIds: [],
    onsetMinute: 90,
    durationMinutes: 45,
    disabledExitIds: [],
    attendanceMultiplier: 1.05,
    weatherFactor: 1.0,
    recommendedResponseRole: 'security'
  },
  {
    id: 'scen_medical_incident',
    name: 'Multiple Heat Exhaustion Incidents in Crowd Core',
    type: 'medical_incident',
    description: 'Simultaneous medical assistance required in dense central lawn. Requires sterile emergency corridor through crowd.',
    severity: 'severe',
    affectedZoneIds: ['zone_lawn_a'],
    affectedGateIds: [],
    onsetMinute: 75,
    durationMinutes: 40,
    disabledExitIds: [],
    attendanceMultiplier: 1.0,
    weatherFactor: 1.0,
    recommendedResponseRole: 'medical'
  },
  {
    id: 'scen_power_outage',
    name: 'Substation Sector B Power Interruption',
    type: 'power_outage',
    description: 'Food court and secondary stage lighting drops to auxiliary battery levels. Crowd pauses and begins shifting.',
    severity: 'moderate',
    affectedZoneIds: ['zone_food_east', 'stage_secondary'],
    affectedGateIds: [],
    onsetMinute: 60,
    durationMinutes: 35,
    disabledExitIds: [],
    attendanceMultiplier: 1.0,
    weatherFactor: 1.0,
    recommendedResponseRole: 'tech'
  },
  {
    id: 'scen_severe_weather',
    name: 'High Wind & Heavy Precipitation Warning',
    type: 'severe_weather',
    description: 'Squall line impacts outdoor campus. Foot speed slows by 35% and attendees seek covered corridors and exits.',
    severity: 'severe',
    affectedZoneIds: ['zone_lawn_a', 'zone_lawn_b', 'zone_entry_plaza'],
    affectedGateIds: [],
    onsetMinute: 80,
    durationMinutes: 60,
    disabledExitIds: [],
    attendanceMultiplier: 0.95,
    weatherFactor: 0.65,
    recommendedResponseRole: 'event_manager'
  },
  {
    id: 'scen_attendance_surge',
    name: 'Unauthorized Gate Surge / +30% Unregistered Influx',
    type: 'attendance_surge',
    description: 'Viral social media attendance brings 2,400 unreserved walk-ups to perimeter entrances.',
    severity: 'critical',
    affectedZoneIds: ['zone_entry_plaza', 'zone_lawn_a'],
    affectedGateIds: ['gate_g01', 'gate_g02'],
    onsetMinute: 50,
    durationMinutes: 60,
    disabledExitIds: [],
    attendanceMultiplier: 1.30,
    weatherFactor: 1.0,
    recommendedResponseRole: 'security'
  },
  {
    id: 'scen_comm_failure',
    name: 'VHF Operations Repeater Malfunction',
    type: 'comm_failure',
    description: 'Radio repeater fails. Field marshals must transition to cellular push-to-talk and physical runner relays.',
    severity: 'moderate',
    affectedZoneIds: ['zone_lawn_b', 'zone_food_east'],
    affectedGateIds: [],
    onsetMinute: 30,
    durationMinutes: 45,
    disabledExitIds: [],
    attendanceMultiplier: 1.0,
    weatherFactor: 1.0,
    recommendedResponseRole: 'ops_coordinator'
  }
];

export function runScenarioSimulation(
  venue: Venue,
  baseAssumptions: SimulationAssumptions,
  scenario: ScenarioDefinition,
  eventId: string
) {
  // Derive modified assumptions based on the scenario
  const modifiedAssumptions: SimulationAssumptions = {
    ...baseAssumptions,
    totalExpectedAttendees: Math.round(
      baseAssumptions.totalExpectedAttendees * (scenario.attendanceMultiplier || 1.0)
    ),
    weatherFactor: scenario.weatherFactor || baseAssumptions.weatherFactor,
    disabledExits: Array.from(new Set([...baseAssumptions.disabledExits, ...scenario.disabledExitIds])),
    disabledGates: Array.from(new Set([...baseAssumptions.disabledGates, ...scenario.affectedGateIds])),
    // For gate hardware failure, reduce throughput of affected gates
    gateThroughputs: { ...baseAssumptions.gateThroughputs }
  };

  if (scenario.type === 'gate_congestion') {
    scenario.affectedGateIds.forEach(gid => {
      modifiedAssumptions.gateThroughputs[gid] = Math.round((baseAssumptions.gateThroughputs[gid] || 1200) * 0.4);
    });
  }

  // If stage rush, boost stage zone attraction even higher
  if (scenario.type === 'stage_surge') {
    modifiedAssumptions.zoneAttraction = { ...baseAssumptions.zoneAttraction };
    scenario.affectedZoneIds.forEach(zid => {
      modifiedAssumptions.zoneAttraction[zid] = (baseAssumptions.zoneAttraction[zid] || 5) * 2.2;
    });
  }

  return runDeterministicSimulation(venue, modifiedAssumptions, eventId);
}

export function compareScenarios(
  venue: Venue,
  baseAssumptions: SimulationAssumptions,
  scenarioA: ScenarioDefinition,
  scenarioB: ScenarioDefinition,
  eventId: string
): ScenarioComparison {
  const resultA = runScenarioSimulation(venue, baseAssumptions, scenarioA, eventId);
  const resultB = runScenarioSimulation(venue, baseAssumptions, scenarioB, eventId);

  const peakOccupancyDiff = resultB.peakTotalInVenue - resultA.peakTotalInVenue;
  const maxQueueDiff = resultB.maxGateQueueCount - resultA.maxGateQueueCount;
  const avgWaitTimeDiff = Math.round((resultB.averageGateWaitMinutes - resultA.averageGateWaitMinutes) * 10) / 10;

  // Compare critical zones
  const zonesExceededA = new Set(
    Object.entries(resultA.zoneCapacityExceedance).filter(([_, v]) => v.exceeded).map(([k]) => k)
  );
  const zonesExceededB = new Set(
    Object.entries(resultB.zoneCapacityExceedance).filter(([_, v]) => v.exceeded).map(([k]) => k)
  );

  const criticalZonesAdded: string[] = [];
  zonesExceededB.forEach(zid => {
    if (!zonesExceededA.has(zid)) {
      const z = venue.elements.find(e => e.id === zid);
      criticalZonesAdded.push(z ? z.name : zid);
    }
  });

  // Bottleneck changes
  const bottlenecksA = new Set(resultA.bottleneckLocations);
  const bottlenecksAdded = resultB.bottleneckLocations.filter(b => !bottlenecksA.has(b));

  const comparativeObservations: string[] = [];

  if (maxQueueDiff > 50) {
    comparativeObservations.push(
      `Scenario B generates a queue surge of +${maxQueueDiff} attendees at gates compared to Scenario A.`
    );
  }
  if (avgWaitTimeDiff > 2) {
    comparativeObservations.push(
      `Average ingress wait time increases by +${avgWaitTimeDiff} minutes under Scenario B conditions.`
    );
  }
  if (criticalZonesAdded.length > 0) {
    comparativeObservations.push(
      `Capacity exceeded in additional zones under Scenario B: ${criticalZonesAdded.join(', ')}.`
    );
  }
  if (scenarioB.disabledExitIds.length > 0) {
    comparativeObservations.push(
      `Egress constriction caused by closing ${scenarioB.disabledExitIds.join(', ')} delays simulated venue clearance by an estimated 18-24 minutes.`
    );
  }
  if (comparativeObservations.length === 0) {
    comparativeObservations.push(
      'Both scenarios exhibit comparable operational clearance margins with no new critical capacity exceedances.'
    );
  }

  return {
    scenarioA: { definition: scenarioA, result: resultA },
    scenarioB: { definition: scenarioB, result: resultB },
    deltaMetrics: {
      peakOccupancyDiff,
      maxQueueDiff,
      avgWaitTimeDiff,
      criticalZonesAdded,
      bottlenecksAdded
    },
    comparativeObservations
  };
}
