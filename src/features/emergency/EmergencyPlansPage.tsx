import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Phone, 
  MapPin, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmergencyPlaybook } from '../../types';

export const EmergencyPlansPage: React.FC = () => {
  const { playbooks } = useAppStore();
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>(playbooks[0]?.id || '');

  const selectedPlaybook = playbooks.find(p => p.id === selectedPlaybookId) || playbooks[0];

  const getStatusBadgeVariant = (st: string) => {
    switch (st) {
      case 'approved': return 'green';
      case 'under_review': return 'amber';
      default: return 'muted';
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#101513] select-none overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-[#303B33] bg-[#151C18] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-[#64B58A]" />
          <div>
            <h2 className="text-sm font-semibold text-[#F0F2EC]">Emergency Preparedness & Response Playbooks</h2>
            <p className="text-[10px] font-mono text-[#9AA59C]">Pre-approved standard operating procedures, trigger thresholds, and chain of custody</p>
          </div>
        </div>
      </div>

      {/* Main Layout: Left Playbook Selector + Right Document Viewer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left List */}
        <div className="w-full md:w-80 border-r border-[#303B33] bg-[#151C18] p-3 space-y-2 overflow-y-auto">
          <div className="text-[10px] font-mono uppercase text-[#78977E] px-2 py-1">
            STANDARD OPERATING PROCEDURES
          </div>

          {playbooks.map(pb => {
            const isSelected = selectedPlaybook?.id === pb.id;
            return (
              <div
                key={pb.id}
                onClick={() => setSelectedPlaybookId(pb.id)}
                className={`p-3 rounded border transition-colors cursor-pointer space-y-1.5 ${
                  isSelected
                    ? 'bg-[#202A24] border-[#64B58A]'
                    : 'bg-[#1B231E] border-[#303B33] hover:border-[#78977E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#78977E] uppercase">{pb.category}</span>
                  <Badge variant={getStatusBadgeVariant(pb.approvalStatus)}>
                    {pb.approvalStatus}
                  </Badge>
                </div>

                <h4 className="text-xs font-bold text-[#F0F2EC] leading-tight">{pb.title}</h4>
                <div className="text-[10px] font-mono text-[#9AA59C]">
                  Reviewed: {pb.reviewDate}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Playbook Content */}
        <div className="hidden md:flex flex-1 flex-col bg-[#101513] overflow-y-auto p-6 space-y-6">
          {selectedPlaybook && (
            <div className="max-w-3xl space-y-6">
              {/* Document Header */}
              <div className="p-5 rounded bg-[#151C18] border border-[#303B33] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#64B58A]">{selectedPlaybook.id}</span>
                    <Badge variant={getStatusBadgeVariant(selectedPlaybook.approvalStatus)}>
                      {selectedPlaybook.approvalStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs font-mono text-[#9AA59C]">
                    Approved By: <strong className="text-[#F0F2EC]">{selectedPlaybook.approvedBy || 'Pending'}</strong>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#F0F2EC]">{selectedPlaybook.title}</h3>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#303B33] font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-[#9AA59C] block">RESPONSIBLE COMMAND ROLE</span>
                    <span className="text-[#F0F2EC] font-semibold">{selectedPlaybook.responsibleRole}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9AA59C] block">EMERGENCY ASSEMBLY POINT</span>
                    <span className="text-[#80A8C8] font-semibold">{selectedPlaybook.assemblyPoint}</span>
                  </div>
                </div>
              </div>

              {/* Trigger Condition */}
              <div className="p-4 rounded bg-[#151C18] border border-[#E5AA52]/40 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E5AA52]">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Activation Trigger Criteria</span>
                </div>
                <p className="text-xs text-[#F0F2EC] leading-relaxed font-mono">
                  {selectedPlaybook.triggerCondition}
                </p>
              </div>

              {/* Communication Protocol */}
              <div className="p-4 rounded bg-[#151C18] border border-[#303B33] space-y-2">
                <div className="text-xs font-semibold text-[#F0F2EC] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#78977E]" />
                  <span>Mandatory Radio & Communications Protocol</span>
                </div>
                <p className="text-xs text-[#9AA59C] leading-relaxed">
                  {selectedPlaybook.commProcedure}
                </p>
              </div>

              {/* Sequential Action Steps */}
              <div className="p-4 rounded bg-[#151C18] border border-[#303B33] space-y-3">
                <div className="text-xs font-semibold text-[#F0F2EC]">
                  Approved Sequential Action Protocol
                </div>
                <ol className="space-y-2 text-xs font-mono text-[#F0F2EC]">
                  {selectedPlaybook.approvedSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2 rounded bg-[#101513] border border-[#303B33]">
                      <span className="w-5 h-5 rounded bg-[#202A24] text-[#64B58A] flex items-center justify-center font-bold text-[11px] shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed font-sans">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Escalation Directory */}
              <div className="p-4 rounded bg-[#151C18] border border-[#303B33] space-y-2">
                <div className="text-xs font-semibold text-[#F0F2EC]">Escalation Contacts Directory</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPlaybook.escalationContacts.map((c, i) => (
                    <div key={i} className="p-2.5 rounded bg-[#101513] border border-[#303B33] font-mono text-xs">
                      <div className="text-[10px] text-[#78977E] uppercase">{c.role}</div>
                      <div className="text-[#F0F2EC] font-semibold font-sans">{c.name}</div>
                      <div className="text-[#80A8C8]">{c.contact}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

