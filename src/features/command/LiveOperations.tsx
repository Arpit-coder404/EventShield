import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Clock, 
  Users, 
  DoorOpen, 
  AlertTriangle, 
  Shield, 
  Activity, 
  Volume2, 
  Layers, 
  Plus, 
  CheckCircle, 
  ArrowLeft,
  Maximize,
  Minimize
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { VenueCanvas, VenueCanvasLayers } from '../venue/VenueCanvas';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatNumber, formatPercent } from '../../lib/utils';
import { Incident, GateStatus } from '../../types';

export const LiveOperations: React.FC<{
  onOpenReportIncident: () => void;
}> = ({ onOpenReportIncident }) => {
  const { 
    currentEvent, 
    venue, 
    staff, 
    resources, 
    incidents, 
    setCurrentPage, 
    setGateStatus, 
    updateIncidentStatus,
    simulationResult
  } = useAppStore();

  const [elapsedSeconds, setElapsedSeconds] = useState(7420); // 2h 03m elapsed
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [activeTab, setActiveTab] = useState<'alerts' | 'gates' | 'staff'>('alerts');

  // Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsed = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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

  const activeIncidents = incidents.filter(i => i.status !== 'resolved' && i.status !== 'closed');
  const gates = venue.elements.filter(e => e.type === 'gate');
  const zones = venue.elements.filter(e => e.type === 'zone' || e.type === 'stage' || e.type === 'food_court');
  const onDutyStaff = staff.filter(s => s.status === 'on_duty');

  return (
    <div className="fixed inset-0 z-40 bg-[#101513] text-[#F0F2EC] flex flex-col select-none overflow-hidden font-sans">
      {/* Top Command Status Bar */}
      <div className="h-14 border-b border-[#303B33] bg-[#151C18] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={() => setCurrentPage('overview')}
            className="text-xs font-mono"
          >
            Exit Live
          </Button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E36B62] animate-pulse" />
            <h1 className="text-sm font-bold tracking-wider text-[#F0F2EC] uppercase font-mono">
              LIVE OPERATIONS COMMAND
            </h1>
            <Badge variant="red" className="text-[10px] animate-pulse">
              LIVE MISSION
            </Badge>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-3 ml-2 border-l border-[#303B33] font-mono text-xs text-[#9AA59C]">
            <span>EVENT: <strong className="text-[#F0F2EC]">{currentEvent.name}</strong></span>
            <span>·</span>
            <span>VENUE: <strong className="text-[#F0F2EC]">{venue.name}</strong></span>
          </div>
        </div>

        {/* Live Metrics & Telemetry Strip */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#101513] border border-[#303B33]">
            <Clock className="w-3.5 h-3.5 text-[#64B58A]" />
            <span className="text-[#9AA59C]">ELAPSED:</span>
            <span className="text-[#64B58A] font-bold text-sm">{formatElapsed(elapsedSeconds)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-[#101513] border border-[#303B33]">
            <Users className="w-3.5 h-3.5 text-[#80A8C8]" />
            <span className="text-[#9AA59C]">MEASURED ATTENDANCE:</span>
            <span className="text-[#F0F2EC] font-bold">
              {formatNumber(currentEvent.currentMeasuredAttendance || 6840)}
            </span>
          </div>

          <Button
            size="sm"
            variant="danger"
            icon={<AlertTriangle className="w-3.5 h-3.5" />}
            onClick={onOpenReportIncident}
            className="text-xs font-semibold"
          >
            + Report Incident
          </Button>
        </div>
      </div>

      {/* Main Command Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Operational Side Panel */}
        <div className="w-80 bg-[#151C18] border-r border-[#303B33] flex flex-col shrink-0 overflow-hidden">
          <div className="h-10 border-b border-[#303B33] bg-[#1B231E]/60 flex text-xs font-mono">
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 flex items-center justify-center gap-1.5 ${activeTab === 'alerts' ? 'text-[#64B58A] border-b-2 border-[#64B58A] bg-[#202A24]' : 'text-[#9AA59C]'}`}
            >
              <span>Incidents</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E36B62] text-white">
                {activeIncidents.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('gates')}
              className={`flex-1 flex items-center justify-center gap-1.5 ${activeTab === 'gates' ? 'text-[#64B58A] border-b-2 border-[#64B58A] bg-[#202A24]' : 'text-[#9AA59C]'}`}
            >
              <span>Gate Feeds</span>
            </button>
          </div>

          {/* Left Tab Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {activeTab === 'alerts' && (
              <div className="space-y-2.5">
                {activeIncidents.map(inc => (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className="p-3 rounded bg-[#1B231E] border border-[#303B33] hover:border-[#64B58A] cursor-pointer space-y-1.5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F0F2EC]">
                        {inc.category.toUpperCase()}
                      </span>
                      <Badge variant={inc.severity === 'critical' ? 'red' : 'amber'}>
                        {inc.severity}
                      </Badge>
                    </div>

                    <p className="text-xs text-[#9AA59C] leading-relaxed">
                      {inc.description}
                    </p>

                    <div className="flex justify-between items-center text-[10px] font-mono text-[#78977E] pt-1 border-t border-[#303B33]/60">
                      <span>{inc.assignedTeam}</span>
                      <span className="text-[#80A8C8]">{inc.status}</span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {inc.status !== 'resolved' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateIncidentStatus(inc.id, 'resolved', 'Resolved on-site by field dispatch');
                          }}
                          className="px-2 py-0.5 rounded text-[10px] bg-[#64B58A]/20 text-[#64B58A] border border-[#64B58A]/40 hover:bg-[#64B58A]/30 font-mono"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gates' && (
              <div className="space-y-2">
                {gates.map(gate => {
                  const isOpen = gate.operatingStatus === 'open';
                  return (
                    <div key={gate.id} className="p-2.5 rounded bg-[#1B231E] border border-[#303B33] space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#F0F2EC]">{gate.name}</span>
                        <Badge variant={isOpen ? 'green' : 'red'}>
                          {gate.operatingStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-[11px] font-mono text-[#9AA59C]">
                        <span>Capacity: {gate.throughputPerHour}/hr</span>
                        <button
                          onClick={() => setGateStatus(gate.id, isOpen ? 'closed' : 'open')}
                          className="text-[#64B58A] underline text-[10px]"
                        >
                          Toggle State
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Central Venue Canvas */}
        <div className="flex-1 h-full relative">
          <VenueCanvas
            elements={venue.elements}
            selectedElementId={null}
            onSelectElement={() => {}}
            onUpdateElement={() => {}}
            layers={layers}
            staff={staff}
            simulatedDensityData={simulationResult.zonePeakOccupancies}
            isLiveMode={true}
            readOnly={true}
          />

          {/* Central Live Overlay Watermark */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-[#151C18]/90 border border-[#303B33] px-3 py-1.5 rounded font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-[#64B58A] animate-pulse" />
            <span className="text-[#F0F2EC] font-semibold">{venue.name}</span>
            <span className="text-[#78977E]">· LIVE SENSORY SWEEP</span>
          </div>

          <div className="absolute bottom-3 right-3 z-20 bg-[#101513]/90 border border-[#303B33] px-2.5 py-1 rounded text-[10px] font-mono text-[#78977E]">
            SAMPLE DATA SIMULATION STREAM
          </div>
        </div>

        {/* Right Tactical Intelligence Panel */}
        <div className="w-80 bg-[#151C18] border-l border-[#303B33] flex flex-col shrink-0 overflow-y-auto p-3 space-y-3">
          <div className="text-xs font-mono uppercase text-[#78977E] tracking-wider pb-1 border-b border-[#303B33]">
            Zone Densities & Field Units
          </div>

          {/* Zone Occupancy Bars */}
          <div className="space-y-2">
            {zones.map(z => {
              const occ = z.currentSimulatedOccupancy || 0;
              const cap = z.capacity || 1000;
              const ratio = occ / cap;
              return (
                <div key={z.id} className="p-2 rounded bg-[#1B231E] border border-[#303B33] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#F0F2EC] font-medium truncate max-w-[170px]">{z.name}</span>
                    <span className={`font-mono text-[10px] font-bold ${ratio > 0.9 ? 'text-[#E5AA52]' : 'text-[#64B58A]'}`}>
                      {formatPercent(ratio)}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-[#101513] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${ratio > 0.9 ? 'bg-[#E5AA52]' : 'bg-[#64B58A]'}`}
                      style={{ width: `${Math.min(100, ratio * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deployed Field Staff Roster */}
          <div className="pt-2 border-t border-[#303B33] space-y-2">
            <div className="text-xs font-semibold text-[#F0F2EC] flex items-center justify-between">
              <span>On-Duty Responders</span>
              <span className="text-[10px] font-mono text-[#64B58A]">{onDutyStaff.length} Deployed</span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {onDutyStaff.slice(0, 6).map(stf => (
                <div key={stf.id} className="p-1.5 rounded bg-[#1B231E] border border-[#303B33] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-[#202A24] text-[10px] flex items-center justify-center font-bold text-[#64B58A]">
                      {stf.avatarInitials}
                    </span>
                    <span className="text-[#F0F2EC] font-sans truncate max-w-[130px]">{stf.name}</span>
                  </div>
                  <Badge variant="blue" className="text-[9px] py-0 px-1">
                    {stf.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

