import { 
  EventItem, 
  Venue, 
  StaffMember, 
  ResourceItem, 
  Incident, 
  RiskItem, 
  EmergencyPlaybook, 
  ReadinessItem, 
  SimulationAssumptions, 
  SimulationResult, 
  NotificationItem, 
  ActivityLogItem 
} from '../types';
import { 
  SEED_EVENT, 
  SEED_VENUE, 
  SEED_STAFF, 
  SEED_RESOURCES, 
  SEED_INCIDENTS, 
  SEED_EMERGENCY_PLAYBOOKS, 
  SEED_READINESS_ITEMS, 
  SEED_DEFAULT_ASSUMPTIONS, 
  SEED_NOTIFICATIONS, 
  SEED_ACTIVITY_LOGS 
} from '../data/seedData';
import { evaluateOperationalRisks } from '../engine/risk/riskEngine';
import { runDeterministicSimulation } from '../engine/crowd/simulationEngine';

const STORAGE_KEYS = {
  EVENTS: 'eventshield_events_v1',
  CURRENT_EVENT_ID: 'eventshield_current_event_id_v1',
  VENUES: 'eventshield_venues_v1',
  STAFF: 'eventshield_staff_v1',
  RESOURCES: 'eventshield_resources_v1',
  INCIDENTS: 'eventshield_incidents_v1',
  RISKS: 'eventshield_risks_v1',
  PLAYBOOKS: 'eventshield_playbooks_v1',
  READINESS: 'eventshield_readiness_v1',
  ASSUMPTIONS: 'eventshield_assumptions_v1',
  SIMULATION_RESULTS: 'eventshield_sim_results_v1',
  NOTIFICATIONS: 'eventshield_notifications_v1',
  ACTIVITY_LOGS: 'eventshield_activity_logs_v1'
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Failed to parse localStorage key ${key}:`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write to localStorage key ${key}:`, e);
  }
}

export const StorageService = {
  getEvents(): EventItem[] {
    return getItem<EventItem[]>(STORAGE_KEYS.EVENTS, [SEED_EVENT]);
  },

  saveEvents(events: EventItem[]): void {
    setItem(STORAGE_KEYS.EVENTS, events);
  },

  getCurrentEventId(): string {
    return getItem<string>(STORAGE_KEYS.CURRENT_EVENT_ID, SEED_EVENT.id);
  },

  setCurrentEventId(id: string): void {
    setItem(STORAGE_KEYS.CURRENT_EVENT_ID, id);
  },

  getVenues(): Record<string, Venue> {
    return getItem<Record<string, Venue>>(STORAGE_KEYS.VENUES, {
      [SEED_VENUE.id]: SEED_VENUE
    });
  },

  saveVenues(venues: Record<string, Venue>): void {
    setItem(STORAGE_KEYS.VENUES, venues);
  },

  getStaff(): StaffMember[] {
    return getItem<StaffMember[]>(STORAGE_KEYS.STAFF, SEED_STAFF);
  },

  saveStaff(staff: StaffMember[]): void {
    setItem(STORAGE_KEYS.STAFF, staff);
  },

  getResources(): ResourceItem[] {
    return getItem<ResourceItem[]>(STORAGE_KEYS.RESOURCES, SEED_RESOURCES);
  },

  saveResources(resources: ResourceItem[]): void {
    setItem(STORAGE_KEYS.RESOURCES, resources);
  },

  getIncidents(): Incident[] {
    return getItem<Incident[]>(STORAGE_KEYS.INCIDENTS, SEED_INCIDENTS);
  },

  saveIncidents(incidents: Incident[]): void {
    setItem(STORAGE_KEYS.INCIDENTS, incidents);
  },

  getRisks(venue: Venue, staff: StaffMember[], resources: ResourceItem[], attendance: number): RiskItem[] {
    const stored = getItem<RiskItem[] | null>(STORAGE_KEYS.RISKS, null);
    if (stored && stored.length > 0) return stored;
    const { evaluatedRisks } = evaluateOperationalRisks(venue, staff, resources, attendance);
    setItem(STORAGE_KEYS.RISKS, evaluatedRisks);
    return evaluatedRisks;
  },

  saveRisks(risks: RiskItem[]): void {
    setItem(STORAGE_KEYS.RISKS, risks);
  },

  getPlaybooks(): EmergencyPlaybook[] {
    return getItem<EmergencyPlaybook[]>(STORAGE_KEYS.PLAYBOOKS, SEED_EMERGENCY_PLAYBOOKS);
  },

  savePlaybooks(playbooks: EmergencyPlaybook[]): void {
    setItem(STORAGE_KEYS.PLAYBOOKS, playbooks);
  },

  getReadinessItems(): ReadinessItem[] {
    return getItem<ReadinessItem[]>(STORAGE_KEYS.READINESS, SEED_READINESS_ITEMS);
  },

  saveReadinessItems(items: ReadinessItem[]): void {
    setItem(STORAGE_KEYS.READINESS, items);
  },

  getAssumptions(eventId: string): SimulationAssumptions {
    const map = getItem<Record<string, SimulationAssumptions>>(STORAGE_KEYS.ASSUMPTIONS, {});
    return map[eventId] || SEED_DEFAULT_ASSUMPTIONS;
  },

  saveAssumptions(eventId: string, assumptions: SimulationAssumptions): void {
    const map = getItem<Record<string, SimulationAssumptions>>(STORAGE_KEYS.ASSUMPTIONS, {});
    map[eventId] = assumptions;
    setItem(STORAGE_KEYS.ASSUMPTIONS, map);
  },

  getSimulationResult(eventId: string, venue: Venue, assumptions: SimulationAssumptions): SimulationResult {
    const map = getItem<Record<string, SimulationResult>>(STORAGE_KEYS.SIMULATION_RESULTS, {});
    if (map[eventId]) return map[eventId];
    const initialResult = runDeterministicSimulation(venue, assumptions, eventId);
    map[eventId] = initialResult;
    setItem(STORAGE_KEYS.SIMULATION_RESULTS, map);
    return initialResult;
  },

  saveSimulationResult(eventId: string, result: SimulationResult): void {
    const map = getItem<Record<string, SimulationResult>>(STORAGE_KEYS.SIMULATION_RESULTS, {});
    map[eventId] = result;
    setItem(STORAGE_KEYS.SIMULATION_RESULTS, map);
  },

  getNotifications(): NotificationItem[] {
    return getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
  },

  saveNotifications(notifs: NotificationItem[]): void {
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },

  getActivityLogs(): ActivityLogItem[] {
    return getItem<ActivityLogItem[]>(STORAGE_KEYS.ACTIVITY_LOGS, SEED_ACTIVITY_LOGS);
  },

  saveActivityLogs(logs: ActivityLogItem[]): void {
    setItem(STORAGE_KEYS.ACTIVITY_LOGS, logs);
  },

  resetAllToSeed(): void {
    localStorage.clear();
    window.location.reload();
  }
};

