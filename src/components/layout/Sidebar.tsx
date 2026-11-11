import React, { useState } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Radio, 
  CalendarDays, 
  Map, 
  Users, 
  FlaskConical, 
  DoorOpen, 
  UserCheck, 
  AlertTriangle, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Settings, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Bell,
  RotateCcw
} from 'lucide-react';
import { useAppStore, AppPage } from '../../store/useAppStore';
import { Badge } from '../common/Badge';
import { cn } from '../../lib/utils';

interface NavItem {
  id: AppPage;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeVariant?: 'green' | 'amber' | 'red' | 'blue';
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{
  onOpenCreateModal: () => void;
}> = ({ onOpenCreateModal }) => {
  const { 
    currentPage, 
    setCurrentPage, 
    events, 
    currentEvent, 
    switchEvent, 
    notifications,
    setIsNotificationDrawerOpen,
    incidents,
    resetToDefaultSeed
  } = useAppStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeIncidentsCount = incidents.filter(i => i.status !== 'resolved' && i.status !== 'closed').length;

  const navGroups: NavGroup[] = [
    {
      title: 'COMMAND',
      items: [
        { id: 'overview', label: 'Command Overview', icon: LayoutDashboard },
        { 
          id: 'live', 
          label: 'Live Operations', 
          icon: Radio,
          badge: currentEvent.status === 'live' ? 'LIVE' : undefined,
          badgeVariant: 'red'
        },
      ]
    },
    {
      title: 'EVENT PLANNING',
      items: [
        { id: 'events', label: 'Events Registry', icon: CalendarDays },
        { id: 'venue', label: 'Venue Designer', icon: Map },
        { id: 'simulation', label: 'Crowd Simulation', icon: Users },
        { id: 'scenarios', label: 'Scenario Lab', icon: FlaskConical },
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'gates', label: 'Gates & Zones', icon: DoorOpen },
        { id: 'staff', label: 'Staff & Resources', icon: UserCheck },
        { 
          id: 'incidents', 
          label: 'Incident Management', 
          icon: AlertTriangle,
          badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined,
          badgeVariant: 'red'
        },
        { id: 'emergency', label: 'Emergency Plans', icon: BookOpen },
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'risk', label: 'Risk Analysis', icon: ShieldAlert },
        { id: 'readiness', label: 'Event Readiness', icon: CheckCircle2 },
        { id: 'reports', label: 'Reports & Insights', icon: FileText },
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { id: 'admin', label: 'Team & Activity', icon: Settings },
      ]
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'live': return 'red';
      case 'approved': return 'green';
      case 'planning': return 'blue';
      case 'ready_for_review': return 'amber';
      default: return 'muted';
    }
  };

  return (
    <aside 
      className={cn(
        'h-screen bg-[#151C18] border-r border-[#303B33] flex flex-col transition-all duration-200 select-none z-30 shrink-0 sticky top-0',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#303B33] bg-[#101513]/40">
        <div 
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-2.5 cursor-pointer group overflow-hidden"
        >
          <div className="w-8 h-8 rounded bg-[#1B231E] border border-[#303B33] flex items-center justify-center text-[#64B58A] group-hover:border-[#64B58A] transition-colors shrink-0">
            <Shield className="w-4 h-4 text-[#64B58A]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-heading font-bold text-sm tracking-wide text-[#F0F2EC] flex items-center gap-1.5">
                EVENTSHIELD
                <span className="text-[10px] font-mono text-[#78977E] px-1 py-0.2 bg-[#1B231E] border border-[#303B33] rounded">v2.4</span>
              </span>
              <span className="text-[10px] text-[#9AA59C] font-mono tracking-tight -mt-0.5">OPS COMMAND CORE</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#9AA59C] hover:text-[#F0F2EC] p-1 rounded hover:bg-[#202A24] transition-colors shrink-0"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Event Selector */}
      {!isCollapsed ? (
        <div className="p-3 border-b border-[#303B33] bg-[#1B231E]/40 relative">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#9AA59C] mb-1.5 flex items-center justify-between">
            <span>ACTIVE EVENT</span>
            <Badge variant={getStatusBadgeVariant(currentEvent.status)} dot>
              {currentEvent.status}
            </Badge>
          </div>

          <button
            onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
            className="w-full flex items-center justify-between p-2 rounded bg-[#101513] border border-[#303B33] hover:border-[#78977E]/50 text-left transition-colors"
          >
            <div className="truncate mr-1">
              <div className="text-xs font-semibold text-[#F0F2EC] truncate">{currentEvent.name}</div>
              <div className="text-[11px] font-mono text-[#9AA59C] truncate">{currentEvent.venueName}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#9AA59C] shrink-0" />
          </button>

          {isEventDropdownOpen && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-[#1B231E] border border-[#303B33] rounded shadow-xl z-50 py-1 max-h-64 overflow-y-auto">
              <div className="px-2 py-1 text-[10px] font-mono text-[#9AA59C] uppercase tracking-wider">
                Select Operational Context
              </div>
              {events.map(ev => (
                <button
                  key={ev.id}
                  onClick={() => {
                    switchEvent(ev.id);
                    setIsEventDropdownOpen(false);
                  }}
                  className={cn(
                    'w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#202A24] transition-colors',
                    ev.id === currentEvent.id && 'bg-[#202A24] border-l-2 border-[#64B58A]'
                  )}
                >
                  <div className="truncate">
                    <div className="font-medium text-[#F0F2EC] truncate">{ev.name}</div>
                    <div className="text-[10px] font-mono text-[#9AA59C]">{ev.date} · {ev.category}</div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(ev.status)} className="scale-90 origin-right">
                    {ev.status}
                  </Badge>
                </button>
              ))}
              <div className="p-1 border-t border-[#303B33] mt-1">
                <button
                  onClick={() => {
                    setIsEventDropdownOpen(false);
                    onOpenCreateModal();
                  }}
                  className="w-full px-2 py-1.5 text-xs font-medium text-[#64B58A] hover:bg-[#64B58A]/10 rounded flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Event</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-2 border-b border-[#303B33] flex justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            title={currentEvent.name}
            className="w-10 h-10 rounded bg-[#101513] border border-[#303B33] flex items-center justify-center text-xs font-mono font-bold text-[#64B58A]"
          >
            {currentEvent.name.substring(0, 2).toUpperCase()}
          </button>
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-0.5">
            {!isCollapsed && (
              <div className="px-2.5 py-1 text-[10px] font-mono tracking-wider text-[#9AA59C]/80 uppercase">
                {group.title}
              </div>
            )}
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm text-xs font-medium transition-colors group relative',
                    isActive 
                      ? 'bg-[#202A24] text-[#F0F2EC] font-semibold border-l-2 border-[#64B58A]' 
                      : 'text-[#9AA59C] hover:text-[#F0F2EC] hover:bg-[#1B231E]'
                  )}
                >
                  <Icon className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-[#64B58A]' : 'text-[#9AA59C] group-hover:text-[#F0F2EC]'
                  )} />
                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <Badge variant={item.badgeVariant || 'muted'} className="text-[10px] py-0 px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                  {isCollapsed && item.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E36B62]" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[#303B33] bg-[#101513]/60 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="flex items-center gap-2 p-1.5 rounded hover:bg-[#202A24] text-[#9AA59C] hover:text-[#F0F2EC] transition-colors relative"
            title="System Operational Notifications"
          >
            <Bell className="w-4 h-4" />
            {!isCollapsed && <span className="text-xs">Alerts</span>}
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-[#E36B62] text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {!isCollapsed && (
            <button
              onClick={resetToDefaultSeed}
              className="p-1.5 rounded hover:bg-[#202A24] text-[#9AA59C] hover:text-[#E5AA52] transition-colors text-xs flex items-center gap-1 font-mono"
              title="Reset state to initial sample demo data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {!isCollapsed && (
          <div className="pt-2 border-t border-[#303B33]/60 flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#202A24] border border-[#303B33] flex items-center justify-center font-mono text-xs font-bold text-[#64B58A]">
              ER
            </div>
            <div className="flex-1 truncate">
              <div className="text-xs font-medium text-[#F0F2EC] truncate">Elena Rostova</div>
              <div className="text-[10px] font-mono text-[#9AA59C] truncate">Incident Commander</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

