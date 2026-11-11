export type EventStatus = 
  | 'draft' 
  | 'planning' 
  | 'ready_for_review' 
  | 'approved' 
  | 'live' 
  | 'completed' 
  | 'archived';

export type EventCategory = 
  | 'University Festival'
  | 'Concert'
  | 'Conference'
  | 'Sports Event'
  | 'Exhibition'
  | 'Workshop'
  | 'Cultural Celebration'
  | 'Public Gathering';

export interface EventItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: EventCategory;
  organizer: string;
  venueName: string;
  venueId: string;
  date: string;
  startTime: string;
  endTime: string;
  expectedAttendance: number;
  maxPlannedAttendance: number;
  currentMeasuredAttendance?: number;
  numStages: number;
  eventType: 'Outdoor Campus' | 'Indoor Arena' | 'Open Park' | 'Convention Center';
  emergencyContact: {
    name: string;
    phone: string;
    role: string;
    channel: string;
  };
  operationalTeam: string[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export type VenueElementType = 
  | 'stage' 
  | 'zone' 
  | 'gate' 
  | 'exit' 
  | 'pathway' 
  | 'barrier' 
  | 'food_court' 
  | 'restroom' 
  | 'medical' 
  | 'security' 
  | 'restricted' 
  | 'assembly';

export type GateStatus = 'planned' | 'ready' | 'open' | 'restricted' | 'closed';

export interface VenueElement {
  id: string;
  name: string;
  type: VenueElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  capacity?: number;
  expectedAttendance?: number;
  currentSimulatedOccupancy?: number;
  currentMeasuredOccupancy?: number;
  densityThreshold?: number; // people / m^2
  areaSquareMeters?: number;
  throughputPerHour?: number; // for gate/exit
  operatingStatus?: GateStatus;
  assignedStaff?: string[];
  accessRestrictions?: string;
  color?: string;
  connectedZoneId?: string;
  pathPoints?: { x: number; y: number }[];
  isEmergencyExit?: boolean;
}

export interface Venue {
  id: string;
  eventId: string;
  name: string;
  width: number;
  height: number;
  gridUnit: number;
  elements: VenueElement[];
  updatedAt: string;
}

export type StaffRole = 
  | 'event_manager'
  | 'security'
  | 'gate_staff'
  | 'medical'
  | 'tech'
  | 'volunteer'
  | 'ops_coordinator';

export type StaffStatus = 'on_duty' | 'break' | 'off_duty' | 'standby';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  team: string;
  contact: string;
  assignedZoneId?: string;
  shift: string;
  status: StaffStatus;
  isConfirmed: boolean;
  avatarInitials: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  category: 'Safety & First Aid' | 'Mobility' | 'Communications' | 'Perimeter & Crowd' | 'Fire Safety' | 'Power & Utilities';
  totalQuantity: number;
  availableQuantity: number;
  allocatedQuantity: number;
  locationZoneId: string;
  responsibleTeam: string;
  inspectionStatus: 'passed' | 'pending' | 'attention';
  unit: string;
  lastChecked: string;
}

export type IncidentCategory = 
  | 'medical'
  | 'crowd_congestion'
  | 'security'
  | 'infrastructure'
  | 'fire'
  | 'lost_person'
  | 'access'
  | 'technical'
  | 'other';

export type IncidentSeverity = 'low' | 'moderate' | 'high' | 'critical';
export type IncidentStatus = 'reported' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';

export interface IncidentNote {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

export interface Incident {
  id: string;
  eventId: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  zoneId: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  assignedTeam: string;
  status: IncidentStatus;
  notes: IncidentNote[];
  actionsTaken?: string[];
  resolutionSummary?: string;
  resolvedAt?: string;
  mapCoordinates?: { x: number; y: number };
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface RiskItem {
  id: string;
  eventId: string;
  description: string;
  zoneId: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  score: number; // likelihood * impact
  level: RiskLevel;
  evidence: string;
  mitigationAction: string;
  assignedOwner: string;
  status: 'open' | 'mitigated' | 'monitoring' | 'resolved';
  reviewDate: string;
}

export interface EmergencyPlaybook {
  id: string;
  eventId: string;
  title: string;
  category: IncidentCategory | 'evacuation' | 'weather';
  triggerCondition: string;
  responsibleRole: string;
  commProcedure: string;
  approvedSteps: string[];
  requiredResources: string[];
  assemblyPoint: string;
  escalationContacts: { role: string; name: string; contact: string }[];
  reviewDate: string;
  approvalStatus: 'draft' | 'under_review' | 'approved' | 'archived';
  approvedBy?: string;
}

export interface ReadinessItem {
  id: string;
  section: 'venue' | 'crowd_planning' | 'personnel' | 'resources' | 'response';
  title: string;
  description: string;
  isCritical: boolean;
  status: 'completed' | 'in_progress' | 'blocked' | 'not_started';
  verifiedBy?: string;
  verifiedAt?: string;
}

export type ArrivalDistributionType = 'steep_peak' | 'gradual' | 'dual_surge' | 'flat';

export interface StageSchedule {
  stageId: string;
  title: string;
  startMinute: number;
  endMinute: number;
  attractionWeight: number; // 1 to 5
}

export interface SimulationAssumptions {
  totalExpectedAttendees: number;
  arrivalDistribution: ArrivalDistributionType;
  gateThroughputs: Record<string, number>; // gateId -> people/hr
  zoneAttraction: Record<string, number>; // zoneId -> relative attraction (1-10)
  stageSchedules: StageSchedule[];
  walkingSpeedMps: number;
  simulationDurationMinutes: number;
  randomSeed: number;
  disabledExits: string[];
  disabledGates: string[];
  weatherFactor: number; // 1.0 = normal, 0.7 = heavy rain slow
}

export interface SimulatedAgent {
  id: number;
  x: number;
  y: number;
  targetZoneId: string;
  currentZoneId: string;
  gateOriginId: string;
  status: 'entering' | 'queuing' | 'walking' | 'at_zone' | 'leaving' | 'exited';
  speed: number;
}

export interface SimulationTick {
  minute: number;
  totalEntered: number;
  totalInVenue: number;
  totalExited: number;
  zoneOccupancies: Record<string, number>;
  gateQueues: Record<string, number>;
  bottleneckGateIds: string[];
  highDensityZoneIds: string[];
  agentsSample: { id: number; x: number; y: number; status: string; zoneId: string }[];
}

export interface SimulationResult {
  id: string;
  eventId: string;
  calculatedAt: string;
  assumptions: SimulationAssumptions;
  peakTotalInVenue: number;
  peakMinute: number;
  zonePeakOccupancies: Record<string, number>;
  zoneCapacityExceedance: Record<string, {
    exceeded: boolean;
    peakCount: number;
    capacity: number;
    ratio: number;
    peakMinute: number;
  }>;
  bottleneckLocations: string[];
  averageGateWaitMinutes: number;
  maxGateQueueCount: number;
  operationalRecommendations: string[];
  ticks: SimulationTick[];
}

export type ScenarioType = 
  | 'normal'
  | 'gate_congestion'
  | 'stage_surge'
  | 'exit_closure'
  | 'medical_incident'
  | 'power_outage'
  | 'severe_weather'
  | 'attendance_surge'
  | 'comm_failure';

export interface ScenarioDefinition {
  id: string;
  name: string;
  type: ScenarioType;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  affectedZoneIds: string[];
  affectedGateIds: string[];
  onsetMinute: number;
  durationMinutes: number;
  disabledExitIds: string[];
  attendanceMultiplier: number;
  weatherFactor: number;
  recommendedResponseRole: string;
}

export interface ScenarioComparison {
  scenarioA: {
    definition: ScenarioDefinition;
    result: SimulationResult;
  };
  scenarioB: {
    definition: ScenarioDefinition;
    result: SimulationResult;
  };
  deltaMetrics: {
    peakOccupancyDiff: number;
    maxQueueDiff: number;
    avgWaitTimeDiff: number;
    criticalZonesAdded: string[];
    bottlenecksAdded: string[];
  };
  comparativeObservations: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'incident' | 'risk' | 'staff' | 'resource' | 'simulation' | 'readiness' | 'gate' | 'playbook';
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  eventId: string;
  read: boolean;
  linkPage?: string;
}

export interface ActivityLogItem {
  id: string;
  eventId: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  category: string;
}

