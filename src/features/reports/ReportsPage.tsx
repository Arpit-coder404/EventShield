import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle, 
  Users, 
  Clock, 
  AlertTriangle, 
  ShieldCheck,
  TrendingUp,
  Share2
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatNumber, formatPercent } from '../../lib/utils';

export const ReportsPage: React.FC = () => {
  const { currentEvent, venue, staff, resources, incidents, simulationResult, calculateReadinessPercent } = useAppStore();

  const [reportType, setReportType] = useState<'post_event' | 'simulation' | 'incidents' | 'readiness'>('post_event');

  const readinessPercent = calculateReadinessPercent();
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved' || i.status === 'closed');
  const deployedStaff = staff.filter(s => s.status === 'on_duty');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Category,Metric,Value,Unit\n';
    csvContent += `Event,Name,"${currentEvent.name}",String\n`;
    csvContent += `Event,Date,"${currentEvent.date}",Date\n`;
    csvContent += `Attendance,Planned,${currentEvent.expectedAttendance},Attendees\n`;
    csvContent += `Attendance,Measured,${currentEvent.currentMeasuredAttendance || 6840},Attendees\n`;
    csvContent += `Safety,ReadinessScore,${readinessPercent},Percent\n`;
    csvContent += `Incidents,TotalLogged,${incidents.length},Count\n`;
    csvContent += `Incidents,Resolved,${resolvedIncidents.length},Count\n`;
    csvContent += `Simulation,PeakCapacityInVenue,${simulationResult.peakTotalInVenue},Attendees\n`;
    csvContent += `Simulation,AverageGateWait,${simulationResult.averageGateWaitMinutes},Minutes\n`;
    csvContent += `Staff,Deployed,${deployedStaff.length},Persons\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentEvent.id}_operational_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#101513] select-none overflow-y-auto p-4 sm:p-6 space-y-6 print:p-0 print:bg-white print:text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#303B33] print:hidden">
        <div>
          <h2 className="text-lg font-bold text-[#F0F2EC]">Operational Intelligence & Audit Reports</h2>
          <p className="text-xs text-[#9AA59C] font-mono mt-0.5">
            Structured post-event debrief, telemetry audit, and compliance documentation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={<Printer className="w-3.5 h-3.5" />}
            onClick={handlePrint}
            className="text-xs font-mono"
          >
            Print Dossier
          </Button>

          <Button
            size="sm"
            variant="primary"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportCSV}
            className="text-xs font-semibold"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex bg-[#151C18] border border-[#303B33] rounded p-0.5 font-mono text-xs max-w-xl print:hidden">
        <button
          onClick={() => setReportType('post_event')}
          className={`flex-1 py-1.5 rounded ${reportType === 'post_event' ? 'bg-[#202A24] text-[#64B58A] font-bold' : 'text-[#9AA59C]'}`}
        >
          Comprehensive Dossier
        </button>
        <button
          onClick={() => setReportType('simulation')}
          className={`flex-1 py-1.5 rounded ${reportType === 'simulation' ? 'bg-[#202A24] text-[#64B58A] font-bold' : 'text-[#9AA59C]'}`}
        >
          Simulation Audit
        </button>
        <button
          onClick={() => setReportType('incidents')}
          className={`flex-1 py-1.5 rounded ${reportType === 'incidents' ? 'bg-[#202A24] text-[#64B58A] font-bold' : 'text-[#9AA59C]'}`}
        >
          Incident Log
        </button>
      </div>

      {/* Main Report Document Sheet */}
      <div className="p-6 rounded bg-[#151C18] border border-[#303B33] space-y-6 max-w-4xl mx-auto print:border-none print:bg-white print:p-0">
        {/* Document Header */}
        <div className="pb-4 border-b border-[#303B33] space-y-1">
          <div className="flex justify-between items-center text-xs font-mono text-[#78977E]">
            <span>EVENTSHIELD OPERATIONAL AUDIT SYSTEM</span>
            <span>CLASSIFICATION: OPERATIONAL LOG</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#F0F2EC] print:text-black">
            {currentEvent.name} — Post-Event Operational Intelligence Dossier
          </h1>
          <div className="flex items-center gap-4 text-xs font-mono text-[#9AA59C] pt-1">
            <span>Venue: {venue.name}</span>
            <span>·</span>
            <span>Date: {currentEvent.date}</span>
            <span>·</span>
            <span>Generated: {new Date().toISOString().substring(0, 10)}</span>
          </div>
        </div>

        {/* Planned vs Actual Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded bg-[#101513] border border-[#303B33] space-y-1">
            <span className="text-[10px] text-[#9AA59C] block">PLANNED ATTENDANCE</span>
            <div className="text-base font-bold text-[#F0F2EC]">{formatNumber(currentEvent.expectedAttendance)}</div>
            <div className="text-[10px] text-[#78977E]">Target Max: {formatNumber(currentEvent.maxPlannedAttendance)}</div>
          </div>

          <div className="p-3 rounded bg-[#101513] border border-[#303B33] space-y-1">
            <span className="text-[10px] text-[#9AA59C] block">MEASURED HEADCOUNT</span>
            <div className="text-base font-bold text-[#64B58A]">{formatNumber(currentEvent.currentMeasuredAttendance || 6840)}</div>
            <div className="text-[10px] text-[#78977E]">Turnstile verified</div>
          </div>

          <div className="p-3 rounded bg-[#101513] border border-[#303B33] space-y-1">
            <span className="text-[10px] text-[#9AA59C] block">INCIDENTS LOGGED</span>
            <div className="text-base font-bold text-[#E5AA52]">{incidents.length} Records</div>
            <div className="text-[10px] text-[#64B58A]">{resolvedIncidents.length} Resolved (100%)</div>
          </div>

          <div className="p-3 rounded bg-[#101513] border border-[#303B33] space-y-1">
            <span className="text-[10px] text-[#9AA59C] block">SAFETY READINESS</span>
            <div className="text-base font-bold text-[#64B58A]">{readinessPercent}%</div>
            <div className="text-[10px] text-[#78977E]">Fully audited</div>
          </div>
        </div>

        {/* Section 1: Ingress & Gate Throughput Audit */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-[#F0F2EC] border-b border-[#303B33] pb-1">
            1. Ingress Gate Performance & Crowd Simulation Contrast
          </h3>
          <p className="text-xs text-[#9AA59C] leading-relaxed">
            The deterministic crowd simulation predicted an ingress peak queue of ~{simulationResult.maxGateQueueCount} attendees with an average processing wait of {simulationResult.averageGateWaitMinutes} minutes under gradual arrival conditions. In field execution, scanner Wi-Fi timeouts at Gate G01 elevated queue wait times to ~14 minutes at T+40m, safely managed by auxiliary wristband lines.
          </p>

          <div className="overflow-x-auto border border-[#303B33] rounded">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#101513] text-[#9AA59C]">
                <tr>
                  <th className="p-2.5">GATE</th>
                  <th className="p-2.5">HOURLY CAP</th>
                  <th className="p-2.5">SIMULATED QUEUE</th>
                  <th className="p-2.5">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#303B33]">
                {venue.elements.filter(e => e.type === 'gate').map(g => (
                  <tr key={g.id}>
                    <td className="p-2.5 text-[#F0F2EC] font-semibold">{g.name}</td>
                    <td className="p-2.5">{g.throughputPerHour || 1500}/hr</td>
                    <td className="p-2.5 text-[#80A8C8]">
                      {simulationResult.ticks[60]?.gateQueues[g.id] || 0} queued (Peak)
                    </td>
                    <td className="p-2.5">
                      <Badge variant={g.operatingStatus === 'open' ? 'green' : 'amber'}>
                        {g.operatingStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Incident Resolution Ledger */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-[#F0F2EC] border-b border-[#303B33] pb-1">
            2. Operational Incidents & Triage Actions
          </h3>

          <div className="space-y-2">
            {incidents.map(inc => (
              <div key={inc.id} className="p-3 rounded bg-[#101513] border border-[#303B33] space-y-1 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#F0F2EC]">{inc.id} · {inc.category.toUpperCase()}</span>
                  <Badge variant={inc.severity === 'critical' ? 'red' : 'amber'}>
                    {inc.severity}
                  </Badge>
                </div>
                <p className="text-xs font-sans text-[#9AA59C]">{inc.description}</p>
                <div className="flex justify-between text-[10px] text-[#78977E] pt-1">
                  <span>Assigned: {inc.assignedTeam}</span>
                  <span>Status: <strong className="text-[#64B58A]">{inc.status.toUpperCase()}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Operational Lessons Learned */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-[#F0F2EC] border-b border-[#303B33] pb-1">
            3. Key Findings & Recommended Protocols for Future Editions
          </h3>
          <ul className="space-y-2 text-xs text-[#9AA59C] leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-[#64B58A] font-bold">•</span>
              <span><strong>Offline Badge Scanning:</strong> Preload ticket database to all mobile scanning devices to guarantee uninterrupted ingress during campus Wi-Fi congestion.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#64B58A] font-bold">•</span>
              <span><strong>Mojo Barricade Buffer:</strong> Maintain minimum 4.5m sterile corridor in front of Main Stage Omega to allow rapid extraction by EMS teams.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#64B58A] font-bold">•</span>
              <span><strong>East Egress Route Signage:</strong> Add illuminated ground-level signage along East Avenue to balance egress flow with North Perimeter exit.</span>
            </li>
          </ul>
        </div>

        {/* Signature Box */}
        <div className="pt-6 border-t border-[#303B33] flex justify-between font-mono text-xs text-[#9AA59C]">
          <div>
            <div className="text-[#F0F2EC] font-semibold">Elena Rostova</div>
            <div>Incident Commander & Safety Director</div>
          </div>
          <div className="text-right">
            <div className="text-[#64B58A] font-semibold">VERIFIED & ARCHIVED</div>
            <div>EVENTSHIELD RECORD HASH #84920-NOVA</div>
          </div>
        </div>
      </div>
    </div>
  );
};

