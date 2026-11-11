import React, { useState } from 'react';
import { 
  Users, 
  History, 
  Settings, 
  RotateCcw, 
  ShieldCheck, 
  Key, 
  Database,
  Lock,
  Clock
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const TeamLogsSettingsPage: React.FC = () => {
  const { activityLogs, resetToDefaultSeed, staff, currentEvent } = useAppStore();

  const [activeTab, setActiveTab] = useState<'logs' | 'team' | 'settings'>('logs');

  const teamMembers = [
    { name: 'Elena Rostova', role: 'Incident Commander', permissions: 'Full Control / Sign-Off', email: 'e.rostova@campus.edu' },
    { name: 'Marcus Vance', role: 'Safety Director', permissions: 'Security & Operations', email: 'm.vance@campus.edu' },
    { name: 'Dr. Aris Thorne', role: 'Chief Medical Officer', permissions: 'Medical & EMS', email: 'a.thorne@campus.edu' },
    { name: 'Kavita Patel', role: 'Crowd Logistics Lead', permissions: 'Simulation & Ingress', email: 'k.patel@campus.edu' },
    { name: 'Devon Miller', role: 'Facilities & Power Lead', permissions: 'Infrastructure & Power', email: 'd.miller@campus.edu' },
  ];

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#101513] select-none overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#303B33]">
        <div>
          <h2 className="text-lg font-bold text-[#F0F2EC]">Team Permissions & Operational Audit Trail</h2>
          <p className="text-xs text-[#9AA59C] font-mono mt-0.5">
            Immutable user activity history, role-based command privileges, and local configuration
          </p>
        </div>

        {/* Tab Switch */}
        <div className="flex bg-[#151C18] border border-[#303B33] rounded p-0.5 font-mono text-xs">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded ${activeTab === 'logs' ? 'bg-[#202A24] text-[#64B58A] font-bold' : 'text-[#9AA59C]'}`}
          >
            Activity Logs ({activityLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 rounded ${activeTab === 'team' ? 'bg-[#202A24] text-[#64B58A] font-bold' : 'text-[#9AA59C]'}`}
          >
            Team & Roles ({teamMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded ${activeTab === 'settings' ? 'bg-[#202A24] text-[#64B58A] font-bold' : 'text-[#9AA59C]'}`}
          >
            System Settings
          </button>
        </div>
      </div>

      {activeTab === 'logs' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#F0F2EC]">Real-Time User Action Stream</h3>
            <span className="text-xs font-mono text-[#78977E]">AUTO-COMMITTED</span>
          </div>

          <div className="overflow-x-auto border border-[#303B33] rounded">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#151C18] text-[#9AA59C] border-b border-[#303B33]">
                <tr>
                  <th className="p-3">TIMESTAMP</th>
                  <th className="p-3">OPERATOR</th>
                  <th className="p-3">ACTION CATEGORY</th>
                  <th className="p-3">EVENT ACTION</th>
                  <th className="p-3">AUDIT DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303B33] bg-[#1B231E]">
                {activityLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#202A24]/60 transition-colors">
                    <td className="p-3 text-[#78977E] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="p-3 text-[#F0F2EC] font-semibold font-sans">
                      {log.user}
                    </td>
                    <td className="p-3">
                      <Badge variant="muted">{log.category.toUpperCase()}</Badge>
                    </td>
                    <td className="p-3 text-[#64B58A] font-semibold">
                      {log.action}
                    </td>
                    <td className="p-3 text-[#9AA59C] max-w-md font-sans text-xs">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#F0F2EC]">Operational Command Roster</h3>
            <span className="text-xs font-mono text-[#9AA59C]">Role-Based Access Control</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((m, idx) => (
              <div key={idx} className="p-4 rounded bg-[#151C18] border border-[#303B33] space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="blue">{m.role}</Badge>
                  <Lock className="w-3.5 h-3.5 text-[#78977E]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F0F2EC]">{m.name}</h4>
                  <div className="text-xs text-[#9AA59C] font-mono">{m.email}</div>
                </div>
                <div className="pt-2 border-t border-[#303B33] text-[11px] font-mono text-[#78977E]">
                  Permissions: <strong className="text-[#F0F2EC]">{m.permissions}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="p-5 rounded bg-[#151C18] border border-[#303B33] space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#F0F2EC]">Database Storage & Local Demo Persistence</h3>
              <p className="text-xs text-[#9AA59C] leading-relaxed">
                EventShield utilizes a reactive client-side service layer with local storage caching for zero-dependency execution. All changes (venue coordinates, simulations, incidents, checklists) are permanently persisted across browser refreshes.
              </p>
            </div>

            <div className="pt-3 border-t border-[#303B33] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#F0F2EC] block">Reset Sample Demo Data</span>
                <span className="text-[11px] text-[#9AA59C]">Reinitialize all tables to factory NOVA FEST 2026 state</span>
              </div>
              <Button
                variant="danger"
                size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={resetToDefaultSeed}
                className="text-xs font-mono"
              >
                Reset Database
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

