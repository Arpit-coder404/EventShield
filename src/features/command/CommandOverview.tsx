import React, { useState } from 'react';
import { 
  Users, 
  DoorOpen, 
  ShieldAlert, 
  UserCheck, 
  AlertTriangle, 
  Clock, 
  Activity, 
  ChevronRight, 
  MapPin, 
  Sparkles,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { VenueCanvas, VenueCanvasLayers } from '../venue/VenueCanvas';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { formatNumber, formatPercent } from '../../lib/utils';
import { VenueElement, Incident } from '../../types';

export const CommandOverview: React.FC<{
  onOpenReportIncident: () => void;
}> = ({ onOpenReportIncident }) => {
  const { 
    currentEvent, 
    venue, 
    staff, 
    resources, 
    incidents, 
    simulationResult, 
    setCurrentPage, 
    setGateStatus,
    updateIncidentStatus
  } = useAppStore();

  const [selectedElement, setSelectedElement] = useState<VenueElement | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const gates = venue.elements.filter(e => e.type === 'gate');
  const zones = venue.elements.filter(e => e.type === 'zone' || e.type === 'stage' || e.type === 'food_court');
  const openGates = gates.filter(g => g.operatingStatus === 'open');
  const deployedStaff = staff.filter(s => s.status === 'on_duty');
  const activeIncidents = incidents.filter(i => i.status !== 'resolved' && i.status !== 'closed');

  // Highest density zone from simulation or measured
  let highestDensityZone = zones[0];
  let highestRatio = 0;
  zones.forEach(z => {
    const occ = z.currentSimulatedOccupancy || 0;
    const cap = z.capacity || 1000;
    const ratio = occ / cap;
    if (ratio > highestRatio) {
      highestRatio = ratio;
      highestDensityZone = z;
    }
  });

  const layers: VenueCanvasLayers = {
    structure: true,
    zones: true,
    gates: true,
    exits: true,
    emergency: true,
    barriers: true,
    staff: true,
    densityOverlay: true,
    grid: true
  };

  // Operational timeline events
  const timelineEvents = [
    { time: '12:00', title: 'Perimeter Checkpoints Activated', team: 'Security', status: 'completed' },
    { time: '13:00', title: 'Medical Command Post Level 1 Operational', team: 'EMS Alpha', status: 'completed' },
    { time: '13:30', title: 'Ingress Gates G01–G04 Opened to Attendees', team: 'Ticketing', status: 'completed' },
    { time: '14:00', title: 'Secondary Stage Sound Check Complete', team: 'Production', status: 'completed' },
    { time: '15:15', title: 'Badge Scanner Offline Fallback Activated', team: 'Gate Staff', status: 'in_progress' },
    { time: '17:30', title: 'Main Stage Headliner Performance', team: 'Artist Ops', status: 'upcoming' },
    { time: '21:30', title: 'Egress Protocol Phased Activation', team: 'Incident Command', status: 'upcoming' }
  ];

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#101513] select-none overflow-hidden">
      {/* Top Status Strip */}
      <div className="border-b border-[#303B33] bg-[#151C18] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[#9AA59C]">EVENT STATUS:</span>
            <Badge variant={currentEvent.status === 'live' ? 'red' : 'green'} dot>
              {currentEvent.status.toUpperCase()}
            </Badge>
          </div>
          <div>
            <span className="text-[#9AA59C]">ATTENDANCE:</span>{' '}
            <strong className="text-[#F0F2EC]">{formatNumber(currentEvent.currentMeasuredAttendance || 6840)}</strong>
            <span className="text-[#78977E]"> / {formatNumber(currentEvent.expectedAttendance)} EXP</span>
          </div>
          <div>
            <span className="text-[#9AA59C]">GATES:</span>{' '}
            <strong className="text-[#64B58A]">{openGates.length}/{gates.length} OPEN</strong>
          </div>
          <div>
            <span className="text-[#9AA59C]">STAFF:</span>{' '}
            <strong className="text-[#F0F2EC]">{deployedStaff.length} ON DUTY</strong>
          </div>
          <div>
            <span className="text-[#9AA59C]">INCIDENTS:</span>{' '}
            <strong className={activeIncidents.length > 0 ? 'text-[#E36B62]' : 'text-[#64B58A]'}>
              {activeIncidents.length} ACTIVE
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#9AA59C]">
          <Clock className="w-3.5 h-3.5 text-[#78977E]" />
          <span>UPDATED: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Main Command Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Central Map (65-70% horizontal width) */}
        <div className="flex-[7] h-full relative border-r border-[#303B33] flex flex-col">
          <div className="flex-1 relative">
            <VenueCanvas
              elements={venue.elements}
              selectedElementId={selectedElement?.id || null}
              onSelectElement={(el) => setSelectedElement(el)}
              onUpdateElement={() => {}}
              layers={layers}
              staff={staff}
              simulatedDensityData={simulationResult.zonePeakOccupancies}
              readOnly={true}
            />

            {/* Map Overlay Badge */}
            <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-[#151C18]/90 border border-[#303B33] px-3 py-1.5 rounded font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-[#64B58A] animate-pulse" />
              <span className="text-[#F0F2EC] font-semibold">{venue.name}</span>
              <span className="text-[#78977E]">· TACTICAL OVERVIEW</span>
            </div>
          </div>

          {/* Bottom Operational Timeline Strip */}
          <div className="h-28 border-t border-[#303B33] bg-[#151C18] p-3 flex flex-col justify-between shrink-0">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#78977E] uppercase tracking-wider font-semibold">
                Event Operational Timeline
              </span>
              <span className="text-[#9AA59C]">WINDOW: 12:00 – 22:30</span>
            </div>

            {/* Horizontal timeline nodes */}
            <div className="flex items-center gap-3 overflow-x-auto py-1">
              {timelineEvents.map((ev, i) => (
                <div 
                  key={i} 
                  className={`px-2.5 py-1.5 rounded border text-[11px] font-mono shrink-0 ${
                    ev.status === 'completed' 
                      ? 'bg-[#101513] border-[#303B33] text-[#9AA59C]' 
                      : ev.status === 'in_progress' 
                      ? 'bg-[#202A24] border-[#E5AA52]/60 text-[#F0F2EC]' 
                      : 'bg-[#101513]/50 border-[#303B33]/40 text-[#9AA59C]/70'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#64B58A] font-bold">{ev.time}</span>
                    <span className="truncate max-w-[170px] font-sans font-medium text-[#F0F2EC]">{ev.title}</span>
                  </div>
                  <div className="text-[10px] text-[#78977E] mt-0.5">{ev.team}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Operational Intelligence Panel (30-35% width) */}
        <div className="flex-[3] h-full bg-[#151C18] flex flex-col overflow-y-auto p-4 space-y-4">
          {/* Highest Density Zone Card */}
          <div className="p-3.5 rounded bg-[#1B231E] border border-[#303B33] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#78977E]">PEAK DENSITY SECTOR</span>
              <Badge variant={highestRatio > 0.9 ? 'amber' : 'green'}>
                {formatPercent(highestRatio)} CAP
              </Badge>
            </div>
            
            <div className="text-sm font-semibold text-[#F0F2EC]">
              {highestDensityZone?.name}
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[#9AA59C]">
              <span>Occupancy: {formatNumber(highestDensityZone?.currentSimulatedOccupancy || 0)}</span>
              <span>Capacity: {formatNumber(highestDensityZone?.capacity || 1000)}</span>
            </div>

            <div className="w-full h-1.5 bg-[#101513] rounded-full overflow-hidden">
              <div 
                className={`h-full ${highestRatio > 0.9 ? 'bg-[#E5AA52]' : 'bg-[#64B58A]'}`}
                style={{ width: `${Math.min(100, highestRatio * 100)}%` }}
              />
            </div>
          </div>

          {/* Active Incidents Queue */}
          <div className="p-3.5 rounded bg-[#1B231E] border border-[#303B33] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#E5AA52]" />
                <h3 className="text-xs font-semibold text-[#F0F2EC]">Active Incidents</h3>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenReportIncident}
                className="text-[11px] py-0.5 px-2"
              >
                + Log
              </Button>
            </div>

            {activeIncidents.length === 0 ? (
              <div className="text-xs font-mono text-[#9AA59C] text-center py-4">
                No open incidents. All sectors clear.
              </div>
            ) : (
              <div className="space-y-2">
                {activeIncidents.map(inc => (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className="p-2.5 rounded bg-[#101513] border border-[#303B33] hover:border-[#64B58A]/50 cursor-pointer space-y-1 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F0F2EC] truncate max-w-[180px]">
                        {inc.category.toUpperCase()}
                      </span>
                      <Badge variant={inc.severity === 'critical' ? 'red' : 'amber'} className="text-[10px]">
                        {inc.severity}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#9AA59C] line-clamp-2 leading-relaxed">
                      {inc.description}
                    </p>
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#78977E] pt-1">
                      <span>{inc.assignedTeam}</span>
                      <span className="text-[#80A8C8]">{inc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Gate Status & Capacity Controls */}
          <div className="p-3.5 rounded bg-[#1B231E] border border-[#303B33] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F0F2EC]">Ingress Gate Control</span>
              <button 
                onClick={() => setCurrentPage('gates')}
                className="text-[10px] font-mono text-[#64B58A] hover:underline flex items-center gap-0.5"
              >
                <span>Full Gate Console</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {gates.map(gate => {
                const isOpen = gate.operatingStatus === 'open';
                return (
                  <div key={gate.id} className="p-2 rounded bg-[#101513] border border-[#303B33] flex items-center justify-between">
                    <div>
                      <div className="text-[#F0F2EC] font-medium">{gate.name}</div>
                      <div className="text-[10px] text-[#9AA59C]">Flow: {gate.throughputPerHour}/hr</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setGateStatus(gate.id, isOpen ? 'closed' : 'open')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                          isOpen 
                            ? 'bg-[#64B58A]/15 text-[#64B58A] border border-[#64B58A]/40 hover:bg-[#64B58A]/25' 
                            : 'bg-[#E36B62]/15 text-[#E36B62] border border-[#E36B62]/40 hover:bg-[#E36B62]/25'
                        }`}
                      >
                        {gate.operatingStatus}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Object Detail Panel */}
          {selectedElement && (
            <div className="p-3.5 rounded bg-[#202A24] border border-[#64B58A]/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-[#64B58A]">OBJECT INSPECTOR</span>
                <button
                  onClick={() => setSelectedElement(null)}
                  className="text-xs text-[#9AA59C] hover:text-[#F0F2EC]"
                >
                  ✕
                </button>
              </div>
              <div className="text-xs font-semibold text-[#F0F2EC]">{selectedElement.name}</div>
              <div className="text-[11px] font-mono text-[#9AA59C] space-y-0.5">
                <div>Type: {selectedElement.type.toUpperCase()}</div>
                {selectedElement.capacity && <div>Capacity: {formatNumber(selectedElement.capacity)}</div>}
                {selectedElement.throughputPerHour && <div>Throughput: {selectedElement.throughputPerHour}/hr</div>}
                <div>Status: {selectedElement.operatingStatus || 'ACTIVE'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

