import React, { useState } from 'react';
import { 
  Users, 
  Package, 
  UserCheck, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Plus, 
  CheckCircle2,
  Phone,
  Shield
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { StaffMember, StaffRole, StaffStatus, ResourceItem } from '../../types';

export const StaffResourcesPage: React.FC = () => {
  const { staff, resources, venue, assignStaffToZone, setStaffStatus, allocateResource } = useAppStore();

  const [activeTab, setActiveTab] = useState<'staff' | 'resources'>('staff');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const zones = venue.elements.filter(e => ['zone', 'stage', 'food_court', 'gate', 'medical', 'security'].includes(e.type));

  const filteredStaff = staff.filter(s => {
    if (filterRole === 'all') return true;
    return s.role === filterRole;
  });

  const getRoleBadgeVariant = (role: StaffRole) => {
    switch (role) {
      case 'event_manager': return 'amber';
      case 'security': return 'blue';
      case 'medical': return 'green';
      case 'ops_coordinator': return 'amber';
      default: return 'muted';
    }
  };

  const getStatusBadgeVariant = (status: StaffStatus) => {
    switch (status) {
      case 'on_duty': return 'green';
      case 'standby': return 'amber';
      case 'break': return 'blue';
      default: return 'muted';
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#101513] select-none overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#303B33]">
        <div>
          <h2 className="text-lg font-bold text-[#F0F2EC]">Staff & Resource Coordination</h2>
          <p className="text-xs text-[#9AA59C] font-mono mt-0.5">
            Personnel deployment matrix, sector zoning, and tactical safety asset tracking
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#151C18] border border-[#303B33] rounded p-0.5 font-mono text-xs">
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1.5 rounded ${activeTab === 'staff' ? 'bg-[#202A24] text-[#64B58A] font-bold' : 'text-[#9AA59C]'}`}
          >
            Staff Roster ({staff.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3 py-1.5 rounded ${activeTab === 'resources' ? 'bg-[#202A24] text-[#64B58A] font-bold' : 'text-[#9AA59C]'}`}
          >
            Resource Inventory ({resources.length})
          </button>
        </div>
      </div>

      {activeTab === 'staff' ? (
        <div className="space-y-4">
          {/* Quick role filter pills */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-[#9AA59C] text-[10px] uppercase">FILTER ROLE:</span>
            {['all', 'security', 'medical', 'gate_staff', 'event_manager', 'ops_coordinator', 'volunteer', 'tech'].map(r => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                  filterRole === r 
                    ? 'bg-[#64B58A] text-[#101513] font-bold' 
                    : 'bg-[#151C18] text-[#9AA59C] border border-[#303B33] hover:text-[#F0F2EC]'
                }`}
              >
                {r.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {/* Staff Roster Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map(member => {
              const assignedZone = venue.elements.find(e => e.id === member.assignedZoneId);
              return (
                <div
                  key={member.id}
                  className="p-4 rounded bg-[#151C18] border border-[#303B33] hover:border-[#78977E] space-y-3 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={getRoleBadgeVariant(member.role)}>
                        {member.role.replace('_', ' ')}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(member.status)} dot>
                        {member.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <div className="w-8 h-8 rounded bg-[#202A24] border border-[#303B33] flex items-center justify-center font-mono font-bold text-xs text-[#64B58A]">
                        {member.avatarInitials}
                      </div>
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-[#F0F2EC] truncate">{member.name}</h4>
                        <div className="text-[11px] text-[#78977E] font-mono">{member.team}</div>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="pt-2 border-t border-[#303B33]/60 space-y-1.5 font-mono text-xs text-[#9AA59C]">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#78977E]" />
                        <span>Zone:</span>
                      </span>
                      <select
                        value={member.assignedZoneId || ''}
                        onChange={(e) => assignStaffToZone(member.id, e.target.value)}
                        className="bg-[#101513] border border-[#303B33] rounded px-2 py-0.5 text-xs text-[#F0F2EC] outline-none max-w-[150px] truncate"
                      >
                        <option value="">Unassigned</option>
                        {zones.map(z => (
                          <option key={z.id} value={z.id}>{z.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#78977E]" />
                        <span>Shift:</span>
                      </span>
                      <span className="text-[#F0F2EC]">{member.shift}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-[#78977E]" />
                        <span>Contact:</span>
                      </span>
                      <span className="text-[#80A8C8]">{member.contact}</span>
                    </div>
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="pt-2 flex gap-1 font-mono text-[10px]">
                    {(['on_duty', 'standby', 'break', 'off_duty'] as StaffStatus[]).map(st => (
                      <button
                        key={st}
                        onClick={() => setStaffStatus(member.id, st)}
                        className={`flex-1 py-1 rounded uppercase font-semibold transition-colors ${
                          member.status === st
                            ? 'bg-[#64B58A] text-[#101513]'
                            : 'bg-[#101513] text-[#9AA59C] border border-[#303B33] hover:text-[#F0F2EC]'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Resource Inventory Table */
        <div className="space-y-4">
          <div className="overflow-x-auto border border-[#303B33] rounded">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#151C18] text-[#9AA59C] border-b border-[#303B33]">
                <tr>
                  <th className="p-3">RESOURCE ASSET</th>
                  <th className="p-3">CATEGORY</th>
                  <th className="p-3">TOTAL</th>
                  <th className="p-3">ALLOCATED</th>
                  <th className="p-3">AVAILABLE</th>
                  <th className="p-3">INSPECTION</th>
                  <th className="p-3">LOCATION</th>
                  <th className="p-3 text-right">DISPATCH ADJUST</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303B33] bg-[#1B231E]">
                {resources.map(res => {
                  const locZone = venue.elements.find(e => e.id === res.locationZoneId);
                  const isLow = res.availableQuantity <= 1;

                  return (
                    <tr key={res.id} className="hover:bg-[#202A24]/60 transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-[#F0F2EC] font-sans">{res.name}</div>
                        <div className="text-[10px] text-[#78977E]">Checked: {res.lastChecked}</div>
                      </td>
                      <td className="p-3">
                        <Badge variant="muted">{res.category}</Badge>
                      </td>
                      <td className="p-3 text-[#F0F2EC] font-bold">
                        {res.totalQuantity} {res.unit}
                      </td>
                      <td className="p-3 text-[#80A8C8]">
                        {res.allocatedQuantity} {res.unit}
                      </td>
                      <td className="p-3">
                        <span className={`font-bold ${isLow ? 'text-[#E5AA52]' : 'text-[#64B58A]'}`}>
                          {res.availableQuantity} {res.unit}
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge variant={res.inspectionStatus === 'passed' ? 'green' : 'amber'}>
                          {res.inspectionStatus.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-3 text-[#9AA59C]">
                        {locZone?.name || res.locationZoneId}
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-1 font-mono">
                          <button
                            onClick={() => allocateResource(res.id, -1)}
                            disabled={res.allocatedQuantity <= 0}
                            className="w-6 h-6 rounded bg-[#101513] border border-[#303B33] hover:bg-[#202A24] text-[#F0F2EC] disabled:opacity-40"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-[#F0F2EC]">
                            {res.allocatedQuantity}
                          </span>
                          <button
                            onClick={() => allocateResource(res.id, 1)}
                            disabled={res.availableQuantity <= 0}
                            className="w-6 h-6 rounded bg-[#101513] border border-[#303B33] hover:bg-[#202A24] text-[#F0F2EC] disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
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

