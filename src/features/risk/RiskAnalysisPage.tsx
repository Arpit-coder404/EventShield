import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Plus, 
  CheckCircle, 
  HelpCircle, 
  Layers, 
  Info,
  Sliders
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { RiskItem, RiskLevel } from '../../types';

export const RiskAnalysisPage: React.FC = () => {
  const { risks, addRiskItem, updateRiskItem, venue } = useAppStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [zoneId, setZoneId] = useState(venue.elements[0]?.id || 'zone_lawn_a');
  const [likelihood, setLikelihood] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [impact, setImpact] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [evidence, setEvidence] = useState('');
  const [mitigationAction, setMitigationAction] = useState('');
  const [assignedOwner, setAssignedOwner] = useState('Safety Operations Lead');

  const handleCreateRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    addRiskItem({
      description,
      zoneId,
      likelihood,
      impact,
      evidence,
      mitigationAction,
      assignedOwner,
      status: 'open',
      reviewDate: new Date().toISOString().substring(0, 10)
    });

    setDescription('');
    setEvidence('');
    setMitigationAction('');
    setIsAddModalOpen(false);
  };

  const getLevelBadgeVariant = (lvl: RiskLevel) => {
    switch (lvl) {
      case 'critical': return 'red';
      case 'high': return 'amber';
      case 'moderate': return 'blue';
      default: return 'green';
    }
  };

  // 5x5 Matrix cells
  const matrixCells: { l: number; i: number; items: RiskItem[] }[] = [];
  for (let l = 5; l >= 1; l--) {
    for (let i = 1; i <= 5; i++) {
      const cellRisks = risks.filter(r => r.likelihood === l && r.impact === i);
      matrixCells.push({ l, i, items: cellRisks });
    }
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#101513] select-none overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#303B33]">
        <div>
          <h2 className="text-lg font-bold text-[#F0F2EC]">Transparent Operational Risk Register</h2>
          <p className="text-xs text-[#9AA59C] font-mono mt-0.5">
            Deterministic Likelihood × Impact scoring matrix with inspectable physical evidence
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setIsAddModalOpen(true)}
          className="text-xs font-semibold"
        >
          + Register Risk
        </Button>
      </div>

      {/* 5x5 Probability vs Impact Matrix Visualizer */}
      <div className="p-5 rounded bg-[#151C18] border border-[#303B33] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-[#78977E]">RISK EVALUATION MATRIX</span>
            <Badge variant="green" className="text-[10px]">EXPLAINABLE CRITERIA</Badge>
          </div>
          <span className="text-xs font-mono text-[#9AA59C]">SCORE = LIKELIHOOD (1–5) × IMPACT (1–5)</span>
        </div>

        <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto">
          {matrixCells.map(({ l, i, items }) => {
            const score = l * i;
            const bgClass = 
              score >= 17 ? 'bg-[#E36B62]/20 border-[#E36B62]/40 text-[#E36B62]' :
              score >= 10 ? 'bg-[#E5AA52]/20 border-[#E5AA52]/40 text-[#E5AA52]' :
              score >= 5 ? 'bg-[#80A8C8]/15 border-[#80A8C8]/30 text-[#80A8C8]' :
              'bg-[#64B58A]/10 border-[#64B58A]/30 text-[#64B58A]';

            return (
              <div
                key={`${l}-${i}`}
                className={`p-2 rounded border flex flex-col justify-between h-20 text-center font-mono ${bgClass}`}
              >
                <div className="flex justify-between items-center text-[9px] text-[#9AA59C]">
                  <span>L{l}</span>
                  <span>I{i}</span>
                </div>
                <div className="text-sm font-bold">{score}</div>
                <div className="text-[10px] font-semibold truncate">
                  {items.length > 0 ? `${items.length} Risk${items.length > 1 ? 's' : ''}` : '—'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-[11px] font-mono text-[#9AA59C] max-w-2xl mx-auto px-1">
          <span>← Low Impact (1)</span>
          <span>Critical Impact (5) →</span>
        </div>
      </div>

      {/* Risk Register Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#F0F2EC]">Active Risk Register</h3>
        <div className="overflow-x-auto border border-[#303B33] rounded">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#151C18] text-[#9AA59C] border-b border-[#303B33]">
              <tr>
                <th className="p-3">RISK ID & DESCRIPTION</th>
                <th className="p-3">ZONE</th>
                <th className="p-3">SCORE</th>
                <th className="p-3">LEVEL</th>
                <th className="p-3">PHYSICAL EVIDENCE</th>
                <th className="p-3">MITIGATION PLAN</th>
                <th className="p-3">OWNER</th>
                <th className="p-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#303B33] bg-[#1B231E]">
              {risks.map(r => (
                <tr key={r.id} className="hover:bg-[#202A24]/60 transition-colors">
                  <td className="p-3 max-w-xs">
                    <div className="font-semibold text-[#F0F2EC] font-sans">{r.description}</div>
                    <div className="text-[10px] text-[#78977E]">{r.id}</div>
                  </td>
                  <td className="p-3 text-[#9AA59C]">
                    {venue.elements.find(e => e.id === r.zoneId)?.name || r.zoneId}
                  </td>
                  <td className="p-3 font-bold text-[#F0F2EC]">
                    {r.score} (L{r.likelihood}×I{r.impact})
                  </td>
                  <td className="p-3">
                    <Badge variant={getLevelBadgeVariant(r.level)}>
                      {r.level}
                    </Badge>
                  </td>
                  <td className="p-3 text-[#9AA59C] max-w-xs text-[11px] leading-relaxed">
                    {r.evidence}
                  </td>
                  <td className="p-3 text-[#F0F2EC] max-w-xs text-[11px] leading-relaxed">
                    {r.mitigationAction}
                  </td>
                  <td className="p-3 text-[#80A8C8]">
                    {r.assignedOwner}
                  </td>
                  <td className="p-3 text-right">
                    <select
                      value={r.status}
                      onChange={(e) => updateRiskItem(r.id, { status: e.target.value as any })}
                      className="bg-[#101513] border border-[#303B33] rounded px-2 py-0.5 text-xs text-[#F0F2EC] outline-none font-mono"
                    >
                      <option value="open">Open</option>
                      <option value="monitoring">Monitoring</option>
                      <option value="mitigated">Mitigated</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Risk Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Operational Risk"
        subtitle="Record identified hazard, likelihood/impact ratings, and assigned mitigation owner"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateRisk} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              Risk Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ingress bottleneck at Gate G01 turnstiles"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
                Zone / Location
              </label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
              >
                {venue.elements.map(el => (
                  <option key={el.id} value={el.id}>{el.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
                Likelihood (1–5)
              </label>
              <select
                value={likelihood}
                onChange={(e) => setLikelihood(Number(e.target.value) as any)}
                className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none font-mono"
              >
                {[1, 2, 3, 4, 5].map(v => (
                  <option key={v} value={v}>{v} - {v === 1 ? 'Rare' : v === 5 ? 'Almost Certain' : 'Probable'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
                Impact (1–5)
              </label>
              <select
                value={impact}
                onChange={(e) => setImpact(Number(e.target.value) as any)}
                className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none font-mono"
              >
                {[1, 2, 3, 4, 5].map(v => (
                  <option key={v} value={v}>{v} - {v === 1 ? 'Negligible' : v === 5 ? 'Catastrophic' : 'Moderate'}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              Physical Evidence / Calculation Rationale
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Planned capacity is 3,200 but simulation projects 3,650 peak attendance."
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded p-2.5 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              Mitigation Action Plan
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Deploy 4 extra marshals and establish one-way egress routing."
              value={mitigationAction}
              onChange={(e) => setMitigationAction(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded p-2.5 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#303B33]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Register Risk
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

