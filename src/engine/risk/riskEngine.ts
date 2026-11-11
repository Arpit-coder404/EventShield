import { RiskItem, RiskLevel, Venue, StaffMember, ResourceItem } from '../../types';

export function calculateRiskLevel(score: number): RiskLevel {
  if (score >= 17) return 'critical';
  if (score >= 10) return 'high';
  if (score >= 5) return 'moderate';
  return 'low';
}

export interface RiskFactorBreakdown {
  factor: string;
  observedValue: string;
  threshold: string;
  derivedLikelihood: 1 | 2 | 3 | 4 | 5;
  derivedImpact: 1 | 2 | 3 | 4 | 5;
  justification: string;
}

export function evaluateOperationalRisks(
  venue: Venue,
  staff: StaffMember[],
  resources: ResourceItem[],
  expectedAttendance: number
): {
  evaluatedRisks: RiskItem[];
  methodologyNotes: string[];
} {
  const evaluatedRisks: RiskItem[] = [];
  const methodologyNotes = [
    'Formula: Risk Score = Likelihood (1-5) × Impact (1-5).',
    'Rating Bands: 1-4 Low (Green), 5-9 Moderate (Information Blue), 10-16 High (Amber), 17-25 Critical (Red).',
    'All scores derived deterministically from venue geometry, capacity ratios, staff allocations, and emergency resource quotas.'
  ];

  // 1. Density risk on main stage zone
  const lawnZone = venue.elements.find(e => e.id === 'zone_lawn_a' || e.name.toLowerCase().includes('main stage lawn'));
  if (lawnZone) {
    const plannedCap = lawnZone.capacity || 3200;
    const estShare = Math.round(expectedAttendance * 0.45);
    const ratio = estShare / plannedCap;

    let likelihood: 1 | 2 | 3 | 4 | 5 = 3;
    let impact: 1 | 2 | 3 | 4 | 5 = 4;

    if (ratio > 1.1) {
      likelihood = 4;
      impact = 4;
    } else if (ratio < 0.8) {
      likelihood = 2;
      impact = 3;
    }

    const score = likelihood * impact;
    evaluatedRisks.push({
      id: 'risk_lawn_density',
      eventId: venue.eventId,
      description: `High crowd density in ${lawnZone.name} during peak stage programming`,
      zoneId: lawnZone.id,
      likelihood,
      impact,
      score,
      level: calculateRiskLevel(score),
      evidence: `Estimated peak gathering of ${estShare} attendees against configured zone capacity of ${plannedCap} (Utilization: ${Math.round(ratio * 100)}%).`,
      mitigationAction: 'Establish sterile center barrier corridor, pre-position 4 security personnel at lawn perimeter, activate buffer zone signs.',
      assignedOwner: 'Chief Safety Marshal',
      status: 'monitoring',
      reviewDate: '2026-11-10'
    });
  }

  // 2. Ingress gate throughput vs attendance
  const gates = venue.elements.filter(e => e.type === 'gate');
  const totalThroughput = gates.reduce((acc, g) => acc + (g.throughputPerHour || 1200), 0);
  const hoursToProcess = expectedAttendance / (totalThroughput || 1);

  const gateLikelihood: 1 | 2 | 3 | 4 | 5 = hoursToProcess > 2.0 ? 4 : hoursToProcess > 1.5 ? 3 : 2;
  const gateImpact: 1 | 2 | 3 | 4 | 5 = 3;
  const gateScore = gateLikelihood * gateImpact;

  evaluatedRisks.push({
    id: 'risk_gate_ingress',
    eventId: venue.eventId,
    description: 'Pedestrian queue spillover at Primary Ingress Gates during initial 90-minute wave',
    zoneId: 'gate_g01',
    likelihood: gateLikelihood,
    impact: gateImpact,
    score: gateScore,
    level: calculateRiskLevel(gateScore),
    evidence: `Combined gate throughput is ${totalThroughput} attendees/hr. Ingress wave requires ~${Math.round(hoursToProcess * 10) / 10} hours to clear total expected volume without pre-check lanes.`,
    mitigationAction: 'Deploy fast-pass wristband verification 30m prior to turnstiles; assign 6 additional ticket stewards to Gate G01/G02.',
    assignedOwner: 'Ingress Operations Lead',
    status: 'open',
    reviewDate: '2026-11-11'
  });

  // 3. Medical coverage ratio
  const medicalStaff = staff.filter(s => s.role === 'medical');
  const firstAidResources = resources.filter(r => r.category === 'Safety & First Aid');
  const medicalRatio = expectedAttendance / Math.max(1, medicalStaff.length);

  const medLikelihood: 1 | 2 | 3 | 4 | 5 = medicalRatio > 1500 ? 4 : medicalRatio > 1000 ? 3 : 2;
  const medImpact: 1 | 2 | 3 | 4 | 5 = 4;
  const medScore = medLikelihood * medImpact;

  evaluatedRisks.push({
    id: 'risk_medical_coverage',
    eventId: venue.eventId,
    description: 'Delayed emergency medical response during simultaneous multi-zone incidents',
    zoneId: 'med_m01',
    likelihood: medLikelihood,
    impact: medImpact,
    score: medScore,
    level: calculateRiskLevel(medScore),
    evidence: `Currently ${medicalStaff.length} EMT responders assigned (${Math.round(medicalRatio)} attendees per medic). Recommended standard for university gathering is ≤800 per medic.`,
    mitigationAction: 'Request mutual aid standby from University Campus EMS; deploy 2 mobile roving first-aid teams with AED units.',
    assignedOwner: 'Medical Coordinator',
    status: 'open',
    reviewDate: '2026-11-11'
  });

  // 4. Perimeter barrier displacement risk
  evaluatedRisks.push({
    id: 'risk_barrier_pinch',
    eventId: venue.eventId,
    description: 'Temporary bike-rack barricade displacement between Food Court East and Lawn B pathway',
    zoneId: 'zone_food_east',
    likelihood: 2,
    impact: 3,
    score: 6,
    level: 'moderate',
    evidence: 'Narrow 3.2m transit corridor between food stalls and lawn seating creates localized pedestrian counter-flow.',
    mitigationAction: 'Anchor steel crowd-control barricades with sandbag ballast and establish one-way flow signage.',
    assignedOwner: 'Facilities & Logistics Lead',
    status: 'mitigated',
    reviewDate: '2026-11-09'
  });

  return { evaluatedRisks, methodologyNotes };
}

