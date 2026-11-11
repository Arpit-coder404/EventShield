import React, { useState } from 'react';
import { 
  DoorOpen, 
  Layers, 
  Activity, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Sliders,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { formatNumber, formatPercent } from '../../lib/utils';
import { GateStatus, VenueElement } from '../../types';

export const GatesZonesPage: React.FC = () => {
  const { venue, setGateStatus, setZoneOccupancy, staff, simulationResult } = useAppStore();

  const [activeTab, setActiveTab] = useState<'gates' | 'zones'>('gates');
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [manualCountInput, setManualCountInput] = useState<number>(0);

  const gates = venue.elements.filter(e => e.type === 'gate');
  const exits = venue.elements.filter(e => e.type === 'exit');
  const zones = venue.elements.filter(e => 
    ['zone', 'stage', 'food_court', 'medical', 'security', 'restricted', 'assembly'].includes(e.type)
  );

  const handleUpdateZoneManualCount = (zoneId: string) => {
    setZoneOccupancy(zoneId, Number(manualCountInput));
    setEditingZoneId(null);
  };

  const getGateBadgeVariant = (status?: GateStatus) => {
    switch (status) {
      case 'open': return 'green';
      case 'restricted': return 'amber';
      case 'closed': return 'red';
      case 'ready': return 'blue';
      default: return 'muted';
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#101513] select-none overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#303B33]">
        <div>
          <h2 className="text-lg font-bold text-[#F0F2EC]">Gates & Operational Zones</h2>
          <p className="text-xs text-[#9AA59C] font-mono mt-0.5">
            Calibrate throughput capacity, monitor ingress meters, and inspect zone occupancies
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#151C18] border border-[#303B33] rounded p-0.5 font-mono text-xs">
          <button
            onClick={() => setActiveTab('gates')}
            className={`px-3 py-1.5 rounded ${activeTab === 'gates' ? 'bg-[#202A24] text-[#64B58A] font-bold' : 'text-[#9AA59C]'}`}
          >
            Gates & Egress ({gates.length + exits.length})
          </button>
          <button
            onClick={() => setActiveTab('zones')}
            className={`px-3 py-1.5 rounded ${activeTab === 'zones' ? 'bg-[#202A24] text-[#64B58A] font-bold' : 'text-[#9AA59C]'}`}
          >
            Crowd Zones ({zones.length})
          </button>
        </div>
      </div>

      {activeTab === 'gates' ? (
        <div className="space-y-6">
          {/* Ingress Turnstiles & Gates */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#F0F2EC] flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-[#64B58A]" />
              <span>Ingress Gates ({gates.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gates.map(gate => {
                const isSelected = selectedGateId === gate.id;
                const assigned = staff.filter(s => gate.assignedStaff?.includes(s.id));
                const currentStatus = gate.operatingStatus || 'open';

                return (
                  <div
                    key={gate.id}
                    onClick={() => setSelectedGateId(gate.id)}
                    className={`p-4 rounded border flex flex-col justify-between space-y-3 transition-colors ${
                      isSelected 
                        ? 'bg-[#1B231E] border-[#64B58A]' 
                        : 'bg-[#151C18] border-[#303B33] hover:border-[#78977E]'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#78977E] uppercase">{gate.id}</span>
                        <Badge variant={getGateBadgeVariant(currentStatus)}>
                          {currentStatus}
                        </Badge>
                      </div>

                      <h4 className="text-sm font-bold text-[#F0F2EC]">{gate.name}</h4>
                    </div>

                    <div className="space-y-1 font-mono text-xs text-[#9AA59C] pt-2 border-t border-[#303B33]/60">
                      <div className="flex justify-between">
                        <span>THROUGHPUT:</span>
                        <strong className="text-[#F0F2EC]">{gate.throughputPerHour || 1500}/hr</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>ASSIGNED STAFF:</span>
                        <strong className="text-[#80A8C8]">{assigned.length} Marshals</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-1.5">
                      {(['open', 'restricted', 'closed'] as GateStatus[]).map(st => (
                        <button
                          key={st}
                          onClick={(e) => {
                            e.stopPropagation();
                            setGateStatus(gate.id, st);
                          }}
                          className={`flex-1 py-1 rounded text-[10px] font-mono uppercase font-semibold transition-colors ${
                            currentStatus === st
                              ? 'bg-[#64B58A] text-[#101513]'
                              : 'bg-[#101513] text-[#9AA59C] border border-[#303B33] hover:text-[#F0F2EC]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Egress Exits */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#F0F2EC] flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-[#80A8C8]" />
              <span>Emergency Exits & Egress Portals ({exits.length})</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {exits.map(exit => (
                <div
                  key={exit.id}
                  className="p-4 rounded bg-[#151C18] border border-[#303B33] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#80A8C8] uppercase">{exit.id}</span>
                    <Badge variant="blue">EGRESS ROUTE</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-[#F0F2EC]">{exit.name}</h4>
                  <div className="text-xs font-mono text-[#9AA59C] pt-2 border-t border-[#303B33]/60">
                    <div>Hourly Clearance: <strong className="text-[#F0F2EC]">{exit.throughputPerHour || 1800}/hr</strong></div>
                    <div>Emergency Route: <strong className="text-[#64B58A]">CERTIFIED</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Zone Management Table */
        <div className="space-y-4">
          <div className="overflow-x-auto border border-[#303B33] rounded">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#151C18] text-[#9AA59C] border-b border-[#303B33]">
                <tr>
                  <th className="p-3">ZONE ID / NAME</th>
                  <th className="p-3">CATEGORY</th>
                  <th className="p-3">CAPACITY</th>
                  <th className="p-3">SIMULATED PEAK</th>
                  <th className="p-3">LIVE MEASURED</th>
                  <th className="p-3">UTILIZATION</th>
                  <th className="p-3 text-right">MANUAL OVERRIDE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303B33] bg-[#1B231E]">
                {zones.map(z => {
                  const simPeak = simulationResult.zonePeakOccupancies[z.id] || z.currentSimulatedOccupancy || 0;
                  const cap = z.capacity || 1000;
                  const ratio = simPeak / cap;
                  const isEditing = editingZoneId === z.id;

                  return (
                    <tr key={z.id} className="hover:bg-[#202A24]/60 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-[#F0F2EC] font-sans">{z.name}</div>
                        <div className="text-[10px] text-[#78977E]">{z.id}</div>
                      </td>
                      <td className="p-3">
                        <Badge variant="muted" className="text-[10px]">
                          {z.type.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-3 text-[#F0F2EC]">
                        {formatNumber(cap)}
                      </td>
                      <td className="p-3 text-[#80A8C8]">
                        {formatNumber(simPeak)} (Model)
                      </td>
                      <td className="p-3 text-[#64B58A]">
                        {z.currentMeasuredOccupancy ? `${formatNumber(z.currentMeasuredOccupancy)} (Sensors)` : '—'}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={ratio > 1.0 ? 'text-[#E36B62] font-bold' : ratio > 0.8 ? 'text-[#E5AA52]' : 'text-[#64B58A]'}>
                            {formatPercent(ratio)}
                          </span>
                          <div className="w-16 h-1.5 bg-[#101513] rounded-full overflow-hidden hidden sm:block">
                            <div 
                              className={`h-full ${ratio > 1.0 ? 'bg-[#E36B62]' : ratio > 0.8 ? 'bg-[#E5AA52]' : 'bg-[#64B58A]'}`}
                              style={{ width: `${Math.min(100, ratio * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <input
                              type="number"
                              value={manualCountInput}
                              onChange={(e) => setManualCountInput(Number(e.target.value))}
                              className="w-20 bg-[#101513] border border-[#303B33] rounded px-1.5 py-0.5 text-xs text-[#F0F2EC]"
                            />
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleUpdateZoneManualCount(z.id)}
                              className="text-[10px] py-0.5 px-2"
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingZoneId(z.id);
                              setManualCountInput(z.currentMeasuredOccupancy || simPeak);
                            }}
                            className="text-[10px] py-0.5 px-2 font-mono"
                          >
                            Calibrate
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

