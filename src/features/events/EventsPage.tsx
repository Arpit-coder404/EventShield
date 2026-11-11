import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { formatNumber } from '../../lib/utils';
import { EventItem, EventStatus } from '../../types';

export const EventsPage: React.FC<{
  onOpenCreateModal: () => void;
}> = ({ onOpenCreateModal }) => {
  const { 
    events, 
    currentEvent, 
    switchEvent, 
    updateEventStatus, 
    setCurrentPage, 
    calculateReadinessPercent 
  } = useAppStore();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const readinessScore = calculateReadinessPercent();

  const filteredEvents = events.filter(e => {
    if (filterCategory === 'all') return true;
    return e.category === filterCategory;
  });

  const getStatusBadgeVariant = (status: EventStatus) => {
    switch (status) {
      case 'live': return 'red';
      case 'approved': return 'green';
      case 'planning': return 'blue';
      case 'ready_for_review': return 'amber';
      case 'completed': return 'muted';
      default: return 'outline';
    }
  };

  const handleStatusChange = (newStatus: EventStatus) => {
    updateEventStatus(newStatus);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#101513] select-none overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#303B33]">
        <div>
          <h2 className="text-lg font-bold text-[#F0F2EC]">Events Registry & Lifecycle Operations</h2>
          <p className="text-xs text-[#9AA59C] font-mono mt-0.5">
            Manage operational workspaces, safety credentials, and stage configurations
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Plus className="w-4 h-4" />}
          onClick={onOpenCreateModal}
          className="text-xs font-semibold"
        >
          Create New Event Plan
        </Button>
      </div>

      {/* Active Operational Event Spotlight */}
      <div className="p-5 rounded bg-[#151C18] border border-[#64B58A]/50 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-[#78977E]">ACTIVE COMMAND CONTEXT</span>
              <Badge variant={getStatusBadgeVariant(currentEvent.status)} dot>
                {currentEvent.status.toUpperCase()}
              </Badge>
            </div>
            <h3 className="text-base font-bold text-[#F0F2EC]">{currentEvent.name}</h3>
            <p className="text-xs text-[#9AA59C] max-w-2xl">{currentEvent.description}</p>
          </div>

          <div className="flex items-center gap-2">
            {currentEvent.status !== 'approved' && currentEvent.status !== 'live' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleStatusChange('approved')}
                className="text-xs font-mono"
              >
                Approve Readiness
              </Button>
            )}

            {currentEvent.status !== 'live' ? (
              <Button
                size="sm"
                variant="primary"
                icon={<Radio className="w-3.5 h-3.5 animate-pulse" />}
                onClick={() => {
                  const allowed = updateEventStatus('live');
                  if (allowed) setCurrentPage('live');
                }}
                className="text-xs font-semibold"
              >
                Launch Live Ops
              </Button>
            ) : (
              <Button
                size="sm"
                variant="warning"
                onClick={() => handleStatusChange('completed')}
                className="text-xs font-mono"
              >
                Conclude Event
              </Button>
            )}
          </div>
        </div>

        {/* Readiness Checklist Status Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-[#303B33] font-mono text-xs">
          <div className="p-3 rounded bg-[#101513] border border-[#303B33]">
            <span className="text-[#9AA59C] text-[10px] block">READINESS INDEX</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base font-bold text-[#64B58A]">{readinessScore}%</span>
              <span className="text-[10px] text-[#78977E]">VERIFIED</span>
            </div>
          </div>

          <div className="p-3 rounded bg-[#101513] border border-[#303B33]">
            <span className="text-[#9AA59C] text-[10px] block">PLANNED CAPACITY</span>
            <div className="text-base font-bold text-[#F0F2EC] mt-1">
              {formatNumber(currentEvent.expectedAttendance)}
            </div>
          </div>

          <div className="p-3 rounded bg-[#101513] border border-[#303B33]">
            <span className="text-[#9AA59C] text-[10px] block">VENUE TYPE</span>
            <div className="text-xs font-bold text-[#80A8C8] mt-1 truncate">
              {currentEvent.eventType}
            </div>
          </div>

          <div className="p-3 rounded bg-[#101513] border border-[#303B33]">
            <span className="text-[#9AA59C] text-[10px] block">EMERGENCY LEAD</span>
            <div className="text-xs font-bold text-[#F0F2EC] mt-1 truncate">
              {currentEvent.emergencyContact.name}
            </div>
          </div>
        </div>
      </div>

      {/* Events List Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[#F0F2EC]">All Configured Events</h4>
          <span className="text-xs font-mono text-[#9AA59C]">{filteredEvents.length} Plans</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map(ev => {
            const isCurrent = ev.id === currentEvent.id;
            return (
              <div
                key={ev.id}
                className={`p-4 rounded border transition-all flex flex-col justify-between space-y-4 ${
                  isCurrent 
                    ? 'bg-[#1B231E] border-[#64B58A] shadow-md' 
                    : 'bg-[#151C18] border-[#303B33] hover:border-[#78977E]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={getStatusBadgeVariant(ev.status)}>
                      {ev.status}
                    </Badge>
                    <span className="text-[10px] font-mono text-[#78977E]">{ev.category}</span>
                  </div>

                  <h4 className="text-sm font-bold text-[#F0F2EC]">{ev.name}</h4>
                  <p className="text-xs text-[#9AA59C] line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#303B33]/60 space-y-1.5 font-mono text-xs text-[#9AA59C]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#78977E]" />
                    <span className="text-[#F0F2EC] truncate">{ev.venueName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#78977E]" />
                    <span>{ev.date} ({ev.startTime}–{ev.endTime})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#78977E]" />
                    <span>{formatNumber(ev.expectedAttendance)} Attendees</span>
                  </div>
                </div>

                <div className="pt-2">
                  {!isCurrent ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => switchEvent(ev.id)}
                      className="w-full text-xs font-mono"
                    >
                      Set Active Context
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setCurrentPage('overview')}
                      className="w-full text-xs font-semibold"
                    >
                      Open Command Center
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

