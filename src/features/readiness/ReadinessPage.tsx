import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  FileCheck, 
  UserCheck, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';

export const ReadinessPage: React.FC = () => {
  const { 
    readinessItems, 
    toggleReadinessItem, 
    signOffAllReadiness, 
    calculateReadinessPercent, 
    currentEvent, 
    updateEventStatus 
  } = useAppStore();

  const [activeSection, setActiveSection] = useState<string>('all');
  const [signerName, setSignerName] = useState('Elena Rostova');
  const [signerRole, setSignerRole] = useState('Incident Commander');

  const readinessPercent = calculateReadinessPercent();
  const criticalItems = readinessItems.filter(i => i.isCritical);
  const criticalCompleted = criticalItems.filter(i => i.status === 'completed').length;
  const isAllCriticalComplete = criticalCompleted === criticalItems.length;

  const sections = [
    { id: 'all', title: 'All Items' },
    { id: 'venue', title: 'Venue Layout & Perimeter' },
    { id: 'crowd_planning', title: 'Crowd Simulation & Gates' },
    { id: 'personnel', title: 'Personnel & Field Staff' },
    { id: 'resources', title: 'Emergency Resources' },
    { id: 'response', title: 'Emergency Response' },
  ];

  const filteredItems = readinessItems.filter(item => {
    if (activeSection === 'all') return true;
    return item.section === activeSection;
  });

  const handleSignOff = () => {
    signOffAllReadiness(signerName, signerRole);
    updateEventStatus('approved');
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#101513] select-none overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#303B33]">
        <div>
          <h2 className="text-lg font-bold text-[#F0F2EC]">Event Safety Readiness Audit</h2>
          <p className="text-xs text-[#9AA59C] font-mono mt-0.5">
            Mandatory gate check across infrastructure, staffing, simulation, and emergency response
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            icon={<ShieldCheck className="w-4 h-4" />}
            onClick={handleSignOff}
            className="text-xs font-semibold"
          >
            Sign-Off All Criteria
          </Button>
        </div>
      </div>

      {/* Progress & Blocker Indicator Hero */}
      <div className="p-5 rounded bg-[#151C18] border border-[#303B33] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#78977E]">COMPLIANCE PROGRESS</span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#64B58A] font-mono">{readinessPercent}%</span>
              <span className="text-xs font-mono text-[#F0F2EC]">
                {readinessItems.filter(i => i.status === 'completed').length} of {readinessItems.length} Checklist Items Verified
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-2.5 rounded bg-[#101513] border border-[#303B33] text-right">
              <span className="text-[10px] text-[#9AA59C] block">CRITICAL PREREQUISITES</span>
              <span className={isAllCriticalComplete ? 'text-[#64B58A] font-bold' : 'text-[#E36B62] font-bold'}>
                {criticalCompleted} / {criticalItems.length} Complete
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#101513] border border-[#303B33] text-right">
              <span className="text-[10px] text-[#9AA59C] block">EVENT STATUS</span>
              <Badge variant={currentEvent.status === 'approved' ? 'green' : 'amber'}>
                {currentEvent.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#101513] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#64B58A] transition-all duration-300"
            style={{ width: `${readinessPercent}%` }}
          />
        </div>
      </div>

      {/* Section Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[#303B33] pb-2 font-mono text-xs">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeSection === s.id 
                ? 'bg-[#202A24] text-[#64B58A] font-bold border-b-2 border-[#64B58A]' 
                : 'text-[#9AA59C] hover:text-[#F0F2EC]'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Checklist Items List */}
      <div className="space-y-2.5">
        {filteredItems.map(item => {
          const isDone = item.status === 'completed';
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDone 
                  ? 'bg-[#151C18]/60 border-[#303B33]' 
                  : 'bg-[#1B231E] border-[#E5AA52]/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleReadinessItem(item.id, isDone ? 'not_started' : 'completed')}
                  className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center transition-colors ${
                    isDone 
                      ? 'bg-[#64B58A] text-[#101513]' 
                      : 'border border-[#303B33] bg-[#101513] hover:border-[#64B58A]'
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F0F2EC]">{item.title}</span>
                    {item.isCritical && (
                      <Badge variant="red" className="text-[9px] py-0 px-1">
                        CRITICAL
                      </Badge>
                    )}
                    <span className="text-[10px] font-mono text-[#78977E] uppercase">
                      [{item.section}]
                    </span>
                  </div>

                  <p className="text-xs text-[#9AA59C] leading-relaxed">
                    {item.description}
                  </p>

                  {item.verifiedBy && (
                    <div className="text-[10px] font-mono text-[#64B58A]">
                      Verified by {item.verifiedBy} at {item.verifiedAt}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={item.status}
                  onChange={(e) => toggleReadinessItem(item.id, e.target.value as any)}
                  className="bg-[#101513] border border-[#303B33] rounded px-2.5 py-1 text-xs text-[#F0F2EC] font-mono outline-none"
                >
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="blocked">Blocked</option>
                  <option value="not_started">Not Started</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

