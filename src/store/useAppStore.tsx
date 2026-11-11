import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import React from 'react';
import { 
  EventItem, 
  Venue, 
  VenueElement, 
  StaffMember, 
  ResourceItem, 
  Incident, 
  RiskItem, 
  EmergencyPlaybook, 
  ReadinessItem, 
  SimulationAssumptions, 
  SimulationResult, 
  NotificationItem, 
  ActivityLogItem,
  GateStatus,
  IncidentStatus,
  StaffStatus,
  EventStatus
} from '../types';
import { StorageService } from '../services/storage';
import { runDeterministicSimulation } from '../engine/crowd/simulationEngine';
import { evaluateOperationalRisks } from '../engine/risk/riskEngine';

export type AppPage = 
  | 'landing'
  | 'overview'
  | 'live'
  | 'events'
  | 'venue'
  | 'simulation'
  | 'scenarios'
  | 'gates'
  | 'staff'
  | 'incidents'
  | 'emergency'
  | 'risk'
  | 'readiness'
  | 'reports'
  | 'admin';

interface AppStoreContextType {
  currentPage: AppPage;
  setCurrentPage: (page: AppPage) => void;
  events: EventItem[];
  currentEvent: EventItem;
  venue: Venue;
  staff: StaffMember[];
  resources: ResourceItem[];
  incidents: Incident[];
  risks: RiskItem[];
  playbooks: EmergencyPlaybook[];
  readinessItems: ReadinessItem[];
  assumptions: SimulationAssumptions;
  simulationResult: SimulationResult;
  notifications: NotificationItem[];
  activityLogs: ActivityLogItem[];
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;

  // Actions
  switchEvent: (eventId: string) => void;
  createEvent: (eventData: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt' | 'venueId'>) => EventItem;
  updateEvent: (partial: Partial<EventItem>) => void;
  updateEventStatus: (status: EventStatus) => boolean;
  
  // Venue actions
  updateVenueElement: (element: VenueElement) => void;
  addVenueElement: (element: VenueElement) => void;
  deleteVenueElement: (elementId: string) => void;
  saveVenueElements: (elements: VenueElement[]) => void;

  // Simulation
  updateAssumptions: (partial: Partial<SimulationAssumptions>) => void;
  triggerSimulation: (customAssumptions?: SimulationAssumptions) => SimulationResult;

  // Gates & Zones
  setGateStatus: (gateId: string, status: GateStatus) => void;
  setZoneOccupancy: (zoneId: string, occupancy: number) => void;

  // Staff & Resources
  assignStaffToZone: (staffId: string, zoneId: string) => void;
  setStaffStatus: (staffId: string, status: StaffStatus) => void;
  allocateResource: (resourceId: string, deltaQuantity: number) => void;

  // Incidents
  createIncident: (incident: Omit<Incident, 'id' | 'reportedAt' | 'notes' | 'eventId'>) => Incident;
  updateIncidentStatus: (incidentId: string, status: IncidentStatus, resolutionSummary?: string) => void;
  addIncidentNote: (incidentId: string, text: string, author?: string) => void;

  // Risk
  addRiskItem: (risk: Omit<RiskItem, 'id' | 'eventId' | 'score' | 'level'>) => void;
  updateRiskItem: (riskId: string, updates: Partial<RiskItem>) => void;

  // Readiness
  toggleReadinessItem: (itemId: string, status: 'completed' | 'in_progress' | 'blocked' | 'not_started') => void;
  signOffAllReadiness: (name: string, role: string) => void;
  calculateReadinessPercent: () => number;

  // Notifications & Logs
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  logActivity: (action: string, details: string, category: string) => void;

  // Reset
  resetToDefaultSeed: () => void;
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

export const AppStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Page state
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Core entities
  const [events, setEvents] = useState<EventItem[]>(() => StorageService.getEvents());
  const [currentEventId, setCurrentEventId] = useState<string>(() => StorageService.getCurrentEventId());
  
  const currentEvent = events.find(e => e.id === currentEventId) || events[0];

  const [venues, setVenues] = useState<Record<string, Venue>>(() => StorageService.getVenues());
  const currentVenue = venues[currentEvent?.venueId] || Object.values(venues)[0];

  const [staff, setStaff] = useState<StaffMember[]>(() => StorageService.getStaff());
  const [resources, setResources] = useState<ResourceItem[]>(() => StorageService.getResources());
  const [incidents, setIncidents] = useState<Incident[]>(() => StorageService.getIncidents());
  
  const [risks, setRisks] = useState<RiskItem[]>(() => 
    StorageService.getRisks(currentVenue, staff, resources, currentEvent?.expectedAttendance || 8000)
  );

  const [playbooks, setPlaybooks] = useState<EmergencyPlaybook[]>(() => StorageService.getPlaybooks());
  const [readinessItems, setReadinessItems] = useState<ReadinessItem[]>(() => StorageService.getReadinessItems());
  
  const [assumptions, setAssumptions] = useState<SimulationAssumptions>(() => 
    StorageService.getAssumptions(currentEventId)
  );

  const [simulationResult, setSimulationResult] = useState<SimulationResult>(() => 
    StorageService.getSimulationResult(currentEventId, currentVenue, assumptions)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.getNotifications());
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => StorageService.getActivityLogs());

  // Log activity helper
  const logActivity = useCallback((action: string, details: string, category: string) => {
    const newLog: ActivityLogItem = {
      id: `act_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      eventId: currentEventId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Current Operator',
      action,
      details,
      category
    };
    setActivityLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 150);
      StorageService.saveActivityLogs(updated);
      return updated;
    });
  }, [currentEventId]);

  // Notifications helper
  const addNotification = useCallback((
    title: string, 
    message: string, 
    type: NotificationItem['type'], 
    severity: NotificationItem['severity'],
    linkPage?: string
  ) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title,
      message,
      type,
      severity,
      timestamp: new Date().toISOString(),
      eventId: currentEventId,
      read: false,
      linkPage
    };
    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      StorageService.saveNotifications(updated);
      return updated;
    });
  }, [currentEventId]);

  // Switch event
  const switchEvent = useCallback((eventId: string) => {
    setCurrentEventId(eventId);
    StorageService.setCurrentEventId(eventId);
    const targetAssumptions = StorageService.getAssumptions(eventId);
    setAssumptions(targetAssumptions);
    
    const ev = events.find(e => e.id === eventId);
    if (ev && venues[ev.venueId]) {
      const res = StorageService.getSimulationResult(eventId, venues[ev.venueId], targetAssumptions);
      setSimulationResult(res);
    }
    logActivity('Switched Event', `Active context changed to event ID ${eventId}`, 'events');
  }, [events, venues, logActivity]);

  // Create event
  const createEvent = useCallback((
    eventData: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt' | 'venueId'>
  ) => {
    const newId = `ev_${Date.now()}`;
    const newVenueId = `ven_${Date.now()}`;

    // Clone baseline elements
    const newVenue: Venue = {
      id: newVenueId,
      eventId: newId,
      name: `${eventData.name} Grounds`,
      width: 1000,
      height: 700,
      gridUnit: 20,
      elements: JSON.parse(JSON.stringify(currentVenue.elements)),
      updatedAt: new Date().toISOString()
    };

    const newEvent: EventItem = {
      ...eventData,
      id: newId,
      venueId: newVenueId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedEvents = [newEvent, ...events];
    const updatedVenues = { ...venues, [newVenueId]: newVenue };

    setEvents(updatedEvents);
    setVenues(updatedVenues);
    setCurrentEventId(newId);

    StorageService.saveEvents(updatedEvents);
    StorageService.saveVenues(updatedVenues);
    StorageService.setCurrentEventId(newId);

    // Initial simulation
    const initSim = runDeterministicSimulation(newVenue, assumptions, newId);
    setSimulationResult(initSim);
    StorageService.saveSimulationResult(newId, initSim);

    logActivity('Created Event', `Created new event: ${eventData.name}`, 'events');
    addNotification('Event Created', `Successfully initialized ${eventData.name}`, 'readiness', 'info', 'overview');

    return newEvent;
  }, [currentVenue, events, venues, assumptions, logActivity, addNotification]);

  // Update event
  const updateEvent = useCallback((partial: Partial<EventItem>) => {
    setEvents(prev => {
      const updated = prev.map(e => e.id === currentEventId ? { ...e, ...partial, updatedAt: new Date().toISOString() } : e);
      StorageService.saveEvents(updated);
      return updated;
    });
    logActivity('Updated Event Settings', `Modified fields on ${currentEvent.name}`, 'events');
  }, [currentEventId, currentEvent?.name, logActivity]);

  // Update Event Status with readiness check
  const updateEventStatus = useCallback((newStatus: EventStatus): boolean => {
    // If moving to approved or live, check readiness
    if (newStatus === 'approved' || newStatus === 'live') {
      const criticalIncomplete = readinessItems.filter(r => r.isCritical && r.status !== 'completed');
      if (criticalIncomplete.length > 0) {
        addNotification(
          'Status Transition Blocked', 
          `Cannot mark event '${newStatus}'. ${criticalIncomplete.length} critical readiness checklist items are incomplete.`,
          'readiness',
          'critical',
          'readiness'
        );
        return false;
      }
    }

    updateEvent({ status: newStatus });
    addNotification('Status Updated', `Event marked as '${newStatus.toUpperCase()}'`, 'readiness', 'info');
    logActivity('Lifecycle Status Updated', `Event lifecycle transition to: ${newStatus}`, 'events');
    return true;
  }, [readinessItems, updateEvent, addNotification, logActivity]);

  // Venue element updates
  const updateVenueElement = useCallback((element: VenueElement) => {
    setVenues(prev => {
      const v = prev[currentVenue.id];
      if (!v) return prev;
      const elements = v.elements.map(el => el.id === element.id ? element : el);
      const updatedVenue = { ...v, elements, updatedAt: new Date().toISOString() };
      const nextVenues = { ...prev, [v.id]: updatedVenue };
      StorageService.saveVenues(nextVenues);
      return nextVenues;
    });
  }, [currentVenue?.id]);

  const addVenueElement = useCallback((element: VenueElement) => {
    setVenues(prev => {
      const v = prev[currentVenue.id];
      if (!v) return prev;
      const elements = [...v.elements, element];
      const updatedVenue = { ...v, elements, updatedAt: new Date().toISOString() };
      const nextVenues = { ...prev, [v.id]: updatedVenue };
      StorageService.saveVenues(nextVenues);
      return nextVenues;
    });
    logActivity('Added Venue Element', `Placed ${element.type} element: ${element.name}`, 'venue');
  }, [currentVenue?.id, logActivity]);

  const deleteVenueElement = useCallback((elementId: string) => {
    setVenues(prev => {
      const v = prev[currentVenue.id];
      if (!v) return prev;
      const target = v.elements.find(e => e.id === elementId);
      const elements = v.elements.filter(el => el.id !== elementId);
      const updatedVenue = { ...v, elements, updatedAt: new Date().toISOString() };
      const nextVenues = { ...prev, [v.id]: updatedVenue };
      StorageService.saveVenues(nextVenues);
      logActivity('Deleted Venue Element', `Removed element: ${target?.name || elementId}`, 'venue');
      return nextVenues;
    });
  }, [currentVenue?.id, logActivity]);

  const saveVenueElements = useCallback((elements: VenueElement[]) => {
    setVenues(prev => {
      const v = prev[currentVenue.id];
      if (!v) return prev;
      const updatedVenue = { ...v, elements, updatedAt: new Date().toISOString() };
      const nextVenues = { ...prev, [v.id]: updatedVenue };
      StorageService.saveVenues(nextVenues);
      return nextVenues;
    });
    logActivity('Saved Venue Layout', `Layout coordinates and capacities saved for ${currentVenue.name}`, 'venue');
    addNotification('Layout Saved', 'Venue spatial configuration updated', 'readiness', 'info');
  }, [currentVenue?.id, currentVenue?.name, logActivity, addNotification]);

  // Simulation execution
  const updateAssumptions = useCallback((partial: Partial<SimulationAssumptions>) => {
    setAssumptions(prev => {
      const next = { ...prev, ...partial };
      StorageService.saveAssumptions(currentEventId, next);
      return next;
    });
  }, [currentEventId]);

  const triggerSimulation = useCallback((customAssumptions?: SimulationAssumptions): SimulationResult => {
    const activeAssumptions = customAssumptions || assumptions;
    const result = runDeterministicSimulation(currentVenue, activeAssumptions, currentEventId);
    setSimulationResult(result);
    StorageService.saveSimulationResult(currentEventId, result);
    
    logActivity(
      'Executed Crowd Simulation',
      `Calculated ${activeAssumptions.totalExpectedAttendees} attendees (Peak: ${result.peakTotalInVenue} at T+${result.peakMinute}m)`,
      'simulation'
    );
    addNotification(
      'Simulation Finished',
      `Simulation completed. ${result.bottleneckLocations.length} bottleneck alerts identified.`,
      'simulation',
      result.bottleneckLocations.length > 2 ? 'warning' : 'info',
      'simulation'
    );

    return result;
  }, [assumptions, currentVenue, currentEventId, logActivity, addNotification]);

  // Gate & Zone operations
  const setGateStatus = useCallback((gateId: string, status: GateStatus) => {
    setVenues(prev => {
      const v = prev[currentVenue.id];
      if (!v) return prev;
      const elements = v.elements.map(e => e.id === gateId ? { ...e, operatingStatus: status } : e);
      const updatedVenue = { ...v, elements, updatedAt: new Date().toISOString() };
      const nextVenues = { ...prev, [v.id]: updatedVenue };
      StorageService.saveVenues(nextVenues);
      return nextVenues;
    });
    const gateObj = currentVenue.elements.find(e => e.id === gateId);
    logActivity('Gate Status Changed', `${gateObj?.name || gateId} set to '${status.toUpperCase()}'`, 'gates');
    addNotification('Gate Status Updated', `${gateObj?.name || gateId} is now ${status.toUpperCase()}`, 'gate', 'info', 'gates');
  }, [currentVenue, logActivity, addNotification]);

  const setZoneOccupancy = useCallback((zoneId: string, occupancy: number) => {
    setVenues(prev => {
      const v = prev[currentVenue.id];
      if (!v) return prev;
      const elements = v.elements.map(e => e.id === zoneId ? { ...e, currentMeasuredOccupancy: occupancy } : e);
      const updatedVenue = { ...v, elements, updatedAt: new Date().toISOString() };
      const nextVenues = { ...prev, [v.id]: updatedVenue };
      StorageService.saveVenues(nextVenues);
      return nextVenues;
    });
    logActivity('Measured Occupancy Updated', `Zone ${zoneId} count recorded as ${occupancy}`, 'zones');
  }, [currentVenue?.id, logActivity]);

  // Staff operations
  const assignStaffToZone = useCallback((staffId: string, zoneId: string) => {
    setStaff(prev => {
      const updated = prev.map(s => s.id === staffId ? { ...s, assignedZoneId: zoneId } : s);
      StorageService.saveStaff(updated);
      return updated;
    });
    const member = staff.find(s => s.id === staffId);
    const z = currentVenue.elements.find(e => e.id === zoneId);
    logActivity('Staff Deployed', `Assigned ${member?.name} to ${z?.name || zoneId}`, 'staff');
  }, [staff, currentVenue.elements, logActivity]);

  const setStaffStatus = useCallback((staffId: string, status: StaffStatus) => {
    setStaff(prev => {
      const updated = prev.map(s => s.id === staffId ? { ...s, status } : s);
      StorageService.saveStaff(updated);
      return updated;
    });
  }, []);

  const allocateResource = useCallback((resourceId: string, deltaQuantity: number) => {
    setResources(prev => {
      const updated = prev.map(r => {
        if (r.id !== resourceId) return r;
        const newAlloc = Math.max(0, Math.min(r.totalQuantity, r.allocatedQuantity + deltaQuantity));
        const newAvail = r.totalQuantity - newAlloc;
        return { ...r, allocatedQuantity: newAlloc, availableQuantity: newAvail };
      });
      StorageService.saveResources(updated);
      return updated;
    });
  }, []);

  // Incident operations
  const createIncident = useCallback((
    incidentData: Omit<Incident, 'id' | 'reportedAt' | 'notes' | 'eventId'>
  ): Incident => {
    const newInc: Incident = {
      ...incidentData,
      id: `inc_${Date.now()}`,
      eventId: currentEventId,
      reportedAt: new Date().toISOString(),
      notes: [
        {
          id: `n_${Date.now()}`,
          text: `Incident reported by ${incidentData.reportedBy}`,
          timestamp: new Date().toISOString(),
          author: incidentData.reportedBy
        }
      ]
    };

    setIncidents(prev => {
      const updated = [newInc, ...prev];
      StorageService.saveIncidents(updated);
      return updated;
    });

    logActivity(
      'Logged Incident',
      `[${incidentData.severity.toUpperCase()}] ${incidentData.category}: ${incidentData.description}`,
      'incidents'
    );

    addNotification(
      `New Incident: ${incidentData.category.toUpperCase()}`,
      `[${incidentData.severity.toUpperCase()}] ${incidentData.description}`,
      'incident',
      incidentData.severity === 'critical' ? 'critical' : incidentData.severity === 'high' ? 'warning' : 'info',
      'incidents'
    );

    return newInc;
  }, [currentEventId, logActivity, addNotification]);

  const updateIncidentStatus = useCallback((
    incidentId: string, 
    status: IncidentStatus, 
    resolutionSummary?: string
  ) => {
    setIncidents(prev => {
      const updated = prev.map(inc => {
        if (inc.id !== incidentId) return inc;
        const now = new Date().toISOString();
        return {
          ...inc,
          status,
          ...(resolutionSummary ? { resolutionSummary, resolvedAt: now } : {})
        };
      });
      StorageService.saveIncidents(updated);
      return updated;
    });
    logActivity('Incident Status Changed', `Incident ${incidentId} transitioned to ${status}`, 'incidents');
    addNotification('Incident Updated', `Incident ${incidentId} marked as ${status}`, 'incident', 'info', 'incidents');
  }, [logActivity, addNotification]);

  const addIncidentNote = useCallback((incidentId: string, text: string, author: string = 'Operator') => {
    setIncidents(prev => {
      const updated = prev.map(inc => {
        if (inc.id !== incidentId) return inc;
        const newNote = {
          id: `n_${Date.now()}`,
          text,
          timestamp: new Date().toISOString(),
          author
        };
        return { ...inc, notes: [...inc.notes, newNote] };
      });
      StorageService.saveIncidents(updated);
      return updated;
    });
  }, []);

  // Risk operations
  const addRiskItem = useCallback((riskData: Omit<RiskItem, 'id' | 'eventId' | 'score' | 'level'>) => {
    const score = riskData.likelihood * riskData.impact;
    const level: RiskItem['level'] = score >= 17 ? 'critical' : score >= 10 ? 'high' : score >= 5 ? 'moderate' : 'low';
    const newRisk: RiskItem = {
      ...riskData,
      id: `risk_${Date.now()}`,
      eventId: currentEventId,
      score,
      level
    };

    setRisks(prev => {
      const updated = [newRisk, ...prev];
      StorageService.saveRisks(updated);
      return updated;
    });
    logActivity('Registered Risk', `Logged risk score ${score} (${level}): ${riskData.description}`, 'risk');
  }, [currentEventId, logActivity]);

  const updateRiskItem = useCallback((riskId: string, updates: Partial<RiskItem>) => {
    setRisks(prev => {
      const updated = prev.map(r => {
        if (r.id !== riskId) return r;
        const likelihood = updates.likelihood ?? r.likelihood;
        const impact = updates.impact ?? r.impact;
        const score = likelihood * impact;
        const level: RiskItem['level'] = score >= 17 ? 'critical' : score >= 10 ? 'high' : score >= 5 ? 'moderate' : 'low';
        return { ...r, ...updates, score, level };
      });
      StorageService.saveRisks(updated);
      return updated;
    });
  }, []);

  // Readiness operations
  const toggleReadinessItem = useCallback((
    itemId: string, 
    status: 'completed' | 'in_progress' | 'blocked' | 'not_started'
  ) => {
    setReadinessItems(prev => {
      const updated = prev.map(item => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          status,
          verifiedAt: status === 'completed' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
          verifiedBy: status === 'completed' ? 'Lead Safety Marshal' : undefined
        };
      });
      StorageService.saveReadinessItems(updated);
      return updated;
    });
  }, []);

  const signOffAllReadiness = useCallback((name: string, role: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setReadinessItems(prev => {
      const updated = prev.map(item => ({
        ...item,
        status: 'completed' as const,
        verifiedBy: `${name} (${role})`,
        verifiedAt: now
      }));
      StorageService.saveReadinessItems(updated);
      return updated;
    });
    logActivity('Readiness Checklist Signed Off', `All verification criteria approved by ${name} (${role})`, 'readiness');
    addNotification('Readiness Complete', 'All operational safety criteria signed off', 'readiness', 'info', 'readiness');
  }, [logActivity, addNotification]);

  const calculateReadinessPercent = useCallback(() => {
    if (readinessItems.length === 0) return 0;
    const completed = readinessItems.filter(i => i.status === 'completed').length;
    return Math.round((completed / readinessItems.length) * 100);
  }, [readinessItems]);

  // Notifications
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      StorageService.saveNotifications(updated);
      return updated;
    });
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      StorageService.saveNotifications(updated);
      return updated;
    });
  }, []);

  const resetToDefaultSeed = useCallback(() => {
    StorageService.resetAllToSeed();
  }, []);

  return (
    <AppStoreContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        events,
        currentEvent,
        venue: currentVenue,
        staff,
        resources,
        incidents,
        risks,
        playbooks,
        readinessItems,
        assumptions,
        simulationResult,
        notifications,
        activityLogs,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,

        switchEvent,
        createEvent,
        updateEvent,
        updateEventStatus,

        updateVenueElement,
        addVenueElement,
        deleteVenueElement,
        saveVenueElements,

        updateAssumptions,
        triggerSimulation,

        setGateStatus,
        setZoneOccupancy,

        assignStaffToZone,
        setStaffStatus,
        allocateResource,

        createIncident,
        updateIncidentStatus,
        addIncidentNote,

        addRiskItem,
        updateRiskItem,

        toggleReadinessItem,
        signOffAllReadiness,
        calculateReadinessPercent,

        markNotificationAsRead,
        markAllNotificationsAsRead,
        logActivity,

        resetToDefaultSeed
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
};

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
}
