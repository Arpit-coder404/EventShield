import React, { useState } from 'react';
import { 
  FlaskConical, 
  GitCompare, 
  AlertTriangle, 
  Play, 
  CheckCircle, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  FileDown,
  Info
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PRECONFIGURED_SCENARIOS, compareScenarios } from '../../engine/scenarios/scenarioEngine';
import { ScenarioDefinition, ScenarioComparison } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { formatNumber, formatPercent } from '../../lib/utils';
import { VenueCanvas, VenueCanvasLayers } from '../venue/VenueCanvas';

export const ScenarioLabPage: React.FC = () => {
  const { venue, assumptions, currentEvent, staff } = useAppStore();

  const [selectedScenarioAId, setSelectedScenarioAId] = useState<string>('scen_baseline');
  const [selectedScenarioBId, setSelectedScenarioBId] = useState<string>('scen_exit_closure');
  const [comparisonResult, setComparisonResult] = useState<ScenarioComparison | null>(() => {
    const scenA = PRECONFIGURED_SCENARIOS.find(s => s.id === 'scen_baseline') || PRECONFIGURED_SCENARIOS[0];
    const scenB = PRECONFIGURED_SCENARIOS.find(s => s.id === 'scen_exit_closure') || PRECONFIGURED_SCENARIOS[1];
    return compareScenarios(venue, assumptions, scenA, scenB, currentEvent.id);
  });

  const scenarioA = PRECONFIGURED_SCENARIOS.find(s => s.id === selectedScenarioAId) || PRECONFIGURED_SCENARIOS[0];
  const scenarioB = PRECONFIGURED_SCENARIOS.find(s => s.id === selectedScenarioBId) || PRECONFIGURED_SCENARIOS[1];

  const handleRunComparison = () => {
    const comparison = compareScenarios(venue, assumptions, scenarioA, scenarioB, currentEvent.id);
    setComparisonResult(comparison);
  };

  const layers: VenueCanvasLayers = {
    structure: true,
    zones: true,
    gates: true,
    exits: true,
    emergency: true,
    barriers: true,
    staff: false,
    densityOverlay: true,
    grid: true
  };

  const getSeverityBadgeVariant = (sev: string) => {
    switch (sev) {
      case 'critical': return 'red';
      case 'severe': return 'red';
      case 'high': return 'amber';
      case 'moderate': return 'amber';
      default: return 'green';
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#101513] select-none overflow-hidden">
      {/* Top Scenario Control Strip */}
      <div className="h-14 border-b border-[#303B33] bg-[#151C18] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <FlaskConical className="w-5 h-5 text-[#64B58A]" />
          <div>
            <h2 className="text-sm font-semibold text-[#F0F2EC]">Scenario Stress-Testing Lab</h2>
            <p className="text-[10px] font-mono text-[#9AA59C]">Compare Plan Baseline Against Incident & Failure Models</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            icon={<GitCompare className="w-3.5 h-3.5" />}
            onClick={handleRunComparison}
            className="text-xs font-semibold"
          >
            Compute Comparison
          </Button>
        </div>
      </div>

      {/* Main Dual-Scenario Workspace */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Scenario Selection Headers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Plan A (Baseline) */}
          <div className="p-4 rounded bg-[#1B231E] border border-[#303B33] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#78977E]">PLAN A (REFERENCE)</span>
              <Badge variant={getSeverityBadgeVariant(scenarioA.severity)}>
                {scenarioA.severity.toUpperCase()}
              </Badge>
            </div>

            <select
              value={selectedScenarioAId}
              onChange={(e) => setSelectedScenarioAId(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] font-semibold focus:border-[#64B58A] outline-none"
            >
              {PRECONFIGURED_SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <p className="text-xs text-[#9AA59C] leading-relaxed">
              {scenarioA.description}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#303B33]/60 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[#9AA59C] block">PEAK COUNT</span>
                <span className="text-[#F0F2EC] font-bold">
                  {comparisonResult ? formatNumber(comparisonResult.scenarioA.result.peakTotalInVenue) : '—'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#9AA59C] block">AVG WAIT</span>
                <span className="text-[#64B58A] font-bold">
                  {comparisonResult ? `${comparisonResult.scenarioA.result.averageGateWaitMinutes}m` : '—'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#9AA59C] block">MAX QUEUE</span>
                <span className="text-[#F0F2EC] font-bold">
                  {comparisonResult ? formatNumber(comparisonResult.scenarioA.result.maxGateQueueCount) : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Plan B (Stress Test / Contingency) */}
          <div className="p-4 rounded bg-[#1B231E] border border-[#303B33] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#E5AA52]">PLAN B (STRESS TEST)</span>
              <Badge variant={getSeverityBadgeVariant(scenarioB.severity)}>
                {scenarioB.severity.toUpperCase()}
              </Badge>
            </div>

            <select
              value={selectedScenarioBId}
              onChange={(e) => setSelectedScenarioBId(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] font-semibold focus:border-[#E5AA52] outline-none"
            >
              {PRECONFIGURED_SCENARIOS.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <p className="text-xs text-[#9AA59C] leading-relaxed">
              {scenarioB.description}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#303B33]/60 font-mono text-xs">
              <div>
                <span className="text-[10px] text-[#9AA59C] block">PEAK COUNT</span>
                <span className="text-[#F0F2EC] font-bold">
                  {comparisonResult ? formatNumber(comparisonResult.scenarioB.result.peakTotalInVenue) : '—'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#9AA59C] block">AVG WAIT</span>
                <span className="text-[#E5AA52] font-bold">
                  {comparisonResult ? `${comparisonResult.scenarioB.result.averageGateWaitMinutes}m` : '—'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#9AA59C] block">MAX QUEUE</span>
                <span className="text-[#E36B62] font-bold">
                  {comparisonResult ? formatNumber(comparisonResult.scenarioB.result.maxGateQueueCount) : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparative Delta Intelligence Strip */}
        {comparisonResult && (
          <div className="p-4 rounded bg-[#151C18] border border-[#303B33] space-y-4">
            <div className="flex items-center justify-between border-b border-[#303B33] pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#64B58A]" />
                <h3 className="text-xs font-semibold text-[#F0F2EC]">
                  Calculated Variance (Plan B vs Plan A)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#78977E]">
                DETERMINISTIC SIMULATION ENGINE
              </span>
            </div>

            {/* Delta metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-3 rounded bg-[#101513] border border-[#303B33]">
                <div className="text-[10px] text-[#9AA59C] uppercase">Max Queue Delta</div>
                <div className={`text-base font-bold mt-0.5 ${comparisonResult.deltaMetrics.maxQueueDiff > 0 ? 'text-[#E5AA52]' : 'text-[#64B58A]'}`}>
                  {comparisonResult.deltaMetrics.maxQueueDiff > 0 ? `+${comparisonResult.deltaMetrics.maxQueueDiff}` : comparisonResult.deltaMetrics.maxQueueDiff} persons
                </div>
                <div className="text-[10px] text-[#9AA59C]">At Ingress Gate checkpoints</div>
              </div>

              <div className="p-3 rounded bg-[#101513] border border-[#303B33]">
                <div className="text-[10px] text-[#9AA59C] uppercase">Wait Time Shift</div>
                <div className={`text-base font-bold mt-0.5 ${comparisonResult.deltaMetrics.avgWaitTimeDiff > 0 ? 'text-[#E36B62]' : 'text-[#64B58A]'}`}>
                  {comparisonResult.deltaMetrics.avgWaitTimeDiff > 0 ? `+${comparisonResult.deltaMetrics.avgWaitTimeDiff}` : comparisonResult.deltaMetrics.avgWaitTimeDiff} min
                </div>
                <div className="text-[10px] text-[#9AA59C]">Average queue processing duration</div>
              </div>

              <div className="p-3 rounded bg-[#101513] border border-[#303B33]">
                <div className="text-[10px] text-[#9AA59C] uppercase">Critical Zones Added</div>
                <div className="text-base font-bold mt-0.5 text-[#E36B62]">
                  {comparisonResult.deltaMetrics.criticalZonesAdded.length}
                </div>
                <div className="text-[10px] text-[#9AA59C]">
                  {comparisonResult.deltaMetrics.criticalZonesAdded.join(', ') || 'No new exceedances'}
                </div>
              </div>
            </div>

            {/* Comparative Observations List */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-[#78977E]">
                Operational Findings & Model Divergences
              </div>
              <ul className="space-y-1.5 text-xs text-[#F0F2EC]">
                {comparisonResult.comparativeObservations.map((obs, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 rounded bg-[#101513]/70 border border-[#303B33]/60">
                    <ArrowRight className="w-3.5 h-3.5 text-[#64B58A] mt-0.5 shrink-0" />
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required Response Actions */}
            <div className="p-3 rounded bg-[#101513] border border-[#E5AA52]/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#E5AA52] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-semibold text-[#E5AA52]">Operational Recommendation for Plan B:</span>
                <p className="text-[#9AA59C] leading-relaxed">
                  To absorb the impact of this scenario, preposition <strong>4 additional security marshals</strong> and <strong>2 EMS first-aid responders</strong> at secondary egress routes 30 minutes prior to anticipated onset.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Notice */}
        <div className="p-3 border border-[#303B33] bg-[#151C18] rounded text-[10px] font-mono text-[#9AA59C] flex items-center justify-between">
          <span>ALL SCENARIO OUTPUTS REPRODUCIBLE UNDER SEED #{assumptions.randomSeed}</span>
          <span className="text-[#78977E]">DECISION-SUPPORT MODEL ONLY</span>
        </div>
      </div>
    </div>
  );
};

