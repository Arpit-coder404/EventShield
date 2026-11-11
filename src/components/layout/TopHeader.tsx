import React from 'react';
import { 
  Radio, 
  Play, 
  AlertTriangle, 
  Bell, 
  Clock, 
  MapPin, 
  Users, 
  DoorOpen, 
  ShieldCheck 
} from 'lucide-react';
import { useAppStore, AppPage } from '../../store/useAppStore';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatNumber } from '../../lib/utils';

export const TopHeader: React.FC<{
  onOpenReportIncident: () => void;
}> = ({ onOpenReportIncident }) => {
  const { 
    currentPage, 
    setCurrentPage, 
    currentEvent, 
    venue, 
    notifications, 
    setIsNotificationDrawerOpen,
    incidents,
    triggerSimulation,
    staff
  } = useAppStore();

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeGates = venue.elements.filter(e => e.type === 'gate' && e.operatingStatus === 'open').length;
  const openIncidents = incidents.filter(i => i.status !== 'resolved' && i.status !== 'closed').length;
  const onDutyStaff = staff.filter(s => s.status === 'on_duty').length;

  const pageTitles: Record<AppPage, { title: string; category: string }> = {
    landing: { title: 'Platform Overview', category: 'EVENTSHIELD' },
    overview: { title: 'Command Overview', category: 'COMMAND' },
    live: { title: 'Live Operations Center', category: 'TACTICAL MONITOR' },
    events: { title: 'Events Registry', category: 'EVENT PLANNING' },
    venue: { title: 'Interactive Venue Designer', category: 'EVENT PLANNING' },
    simulation: { title: 'Deterministic Crowd Simulation', category: 'EVENT PLANNING' },
    scenarios: { title: 'Scenario Lab & Impact Modeling', category: 'INTELLIGENCE' },
    gates: { title: 'Gates & Crowd Zones', category: 'OPERATIONS' },
    staff: { title: 'Staff & Resource Allocation', category: 'OPERATIONS' },
    incidents: { title: 'Incident Response & Triage', category: 'OPERATIONS' },
    emergency: { title: 'Emergency Plans & Playbooks', category: 'PREPAREDNESS' },
    risk: { title: 'Operational Risk Register', category: 'INTELLIGENCE' },
    readiness: { title: 'Event Readiness Checklist', category: 'GOVERNANCE' },
    reports: { title: 'Operational Reports & Insights', category: 'AUDIT & EXPORT' },
    admin: { title: 'Team Permissions & Activity Logs', category: 'ADMINISTRATION' },
  };

  const currentInfo = pageTitles[currentPage] || { title: 'Command Center', category: 'OPERATIONS' };

  return (
    <header className="h-14 border-b border-[#303B33] bg-[#151C18] px-4 flex items-center justify-between shrink-0 select-none z-20">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div>
          <div className="text-[10px] font-mono tracking-wider text-[#78977E] uppercase leading-none">
            {currentInfo.category}
          </div>
          <h1 className="text-sm font-semibold text-[#F0F2EC] tracking-tight leading-tight mt-0.5">
            {currentInfo.title}
          </h1>
        </div>

        <div className="hidden lg:flex items-center gap-2 pl-3 ml-2 border-l border-[#303B33] text-xs font-mono text-[#9AA59C]">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#78977E]" />
            <span className="text-[#F0F2EC]">{currentEvent.venueName}</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#78977E]" />
            <span>{currentEvent.date} ({currentEvent.startTime}–{currentEvent.endTime})</span>
          </span>
        </div>
      </div>

      {/* Operational Metric Strip */}
      <div className="hidden xl:flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#101513] border border-[#303B33]">
          <Users className="w-3.5 h-3.5 text-[#80A8C8]" />
          <span className="text-[#9AA59C]">EXP:</span>
          <span className="text-[#F0F2EC] font-semibold">{formatNumber(currentEvent.expectedAttendance)}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#101513] border border-[#303B33]">
          <DoorOpen className="w-3.5 h-3.5 text-[#64B58A]" />
          <span className="text-[#9AA59C]">GATES:</span>
          <span className="text-[#F0F2EC] font-semibold">{activeGates}/4 OPEN</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#101513] border border-[#303B33]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#78977E]" />
          <span className="text-[#9AA59C]">STAFF:</span>
          <span className="text-[#F0F2EC] font-semibold">{onDutyStaff} DEPLOYED</span>
        </div>

        {openIncidents > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E36B62]/10 border border-[#E36B62]/30 text-[#E36B62]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="font-semibold">{openIncidents} OPEN INCIDENT{openIncidents > 1 ? 'S' : ''}</span>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2">
        {currentPage !== 'simulation' && (
          <Button
            size="sm"
            variant="outline"
            icon={<Play className="w-3.5 h-3.5 text-[#64B58A]" />}
            onClick={() => {
              triggerSimulation();
              setCurrentPage('simulation');
            }}
            className="hidden sm:inline-flex text-xs"
          >
            Run Sim
          </Button>
        )}

        <Button
          size="sm"
          variant="secondary"
          icon={<AlertTriangle className="w-3.5 h-3.5 text-[#E5AA52]" />}
          onClick={onOpenReportIncident}
          className="text-xs"
        >
          Report Incident
        </Button>

        {currentPage !== 'live' ? (
          <Button
            size="sm"
            variant="primary"
            icon={<Radio className="w-3.5 h-3.5 text-[#101513] animate-pulse" />}
            onClick={() => setCurrentPage('live')}
            className="text-xs font-semibold"
          >
            Live Ops Mode
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage('overview')}
            className="text-xs font-mono"
          >
            Exit Live
          </Button>
        )}

        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="relative p-2 rounded hover:bg-[#202A24] text-[#9AA59C] hover:text-[#F0F2EC] transition-colors"
          title="Open Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E36B62]" />
          )}
        </button>
      </div>
    </header>
  );
};

