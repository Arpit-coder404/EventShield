import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  CheckCircle, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Shield, 
  Send, 
  Check, 
  FileText 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Incident, IncidentSeverity, IncidentStatus, IncidentCategory } from '../../types';

export const IncidentManagementPage: React.FC<{
  onOpenReportModal: () => void;
}> = ({ onOpenReportModal }) => {
  const { incidents, venue, updateIncidentStatus, addIncidentNote } = useAppStore();

  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    incidents[0]?.id || null
  );
  const [newNoteText, setNewNoteText] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0] || null;

  const filteredIncidents = incidents.filter(i => {
    if (filterSeverity !== 'all' && i.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    return true;
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedIncident) return;
    addIncidentNote(selectedIncident.id, newNoteText, 'Command Operator');
    setNewNoteText('');
  };

  const handleResolve = () => {
    if (!selectedIncident) return;
    updateIncidentStatus(
      selectedIncident.id, 
      'resolved', 
      resolutionSummary || 'Resolved and cleared on-site by field dispatch'
    );
    setResolutionSummary('');
  };

  const getSeverityBadgeVariant = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'critical': return 'red';
      case 'high': return 'amber';
      case 'moderate': return 'amber';
      default: return 'blue';
    }
  };

  const getStatusBadgeVariant = (st: IncidentStatus) => {
    switch (st) {
      case 'resolved': return 'green';
      case 'closed': return 'muted';
      case 'in_progress': return 'amber';
      default: return 'red';
    }
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#101513] select-none overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-[#303B33] bg-[#151C18] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#E5AA52]" />
          <div>
            <h2 className="text-sm font-semibold text-[#F0F2EC]">Incident Dispatch & Tactical Response</h2>
            <p className="text-[10px] font-mono text-[#9AA59C]">Real-time operational queue, field status tracking, and resolution history</p>
          </div>
        </div>

        <Button
          size="sm"
          variant="primary"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={onOpenReportModal}
          className="text-xs font-semibold"
        >
          + Log Incident
        </Button>
      </div>

      {/* Main Workspace: Left List (45%) + Right Detail Panel (55%) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Incident Queue */}
        <div className="w-full md:w-5/12 border-r border-[#303B33] bg-[#151C18] flex flex-col overflow-hidden">
          {/* Filters Bar */}
          <div className="p-3 border-b border-[#303B33] bg-[#1B231E]/50 flex items-center gap-2 text-xs font-mono">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-[#101513] border border-[#303B33] rounded px-2 py-1 text-xs text-[#F0F2EC] outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="moderate">Moderate Only</option>
              <option value="low">Low Only</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#101513] border border-[#303B33] rounded px-2 py-1 text-xs text-[#F0F2EC] outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-12 text-xs font-mono text-[#9AA59C]">
                No matching incidents in current filter.
              </div>
            ) : (
              filteredIncidents.map(inc => {
                const isSelected = selectedIncident?.id === inc.id;
                const locZone = venue.elements.find(e => e.id === inc.zoneId);

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`p-3 rounded border transition-colors cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[#202A24] border-[#64B58A]'
                        : 'bg-[#1B231E] border-[#303B33] hover:border-[#78977E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#78977E] uppercase">{inc.id}</span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant={getSeverityBadgeVariant(inc.severity)}>
                          {inc.severity}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(inc.status)}>
                          {inc.status}
                        </Badge>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-[#F0F2EC]">{inc.category.replace('_', ' ').toUpperCase()}</h4>
                    <p className="text-xs text-[#9AA59C] line-clamp-2 leading-relaxed">
                      {inc.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA59C] pt-1 border-t border-[#303B33]/60">
                      <span>{locZone?.name || inc.zoneId}</span>
                      <span>{new Date(inc.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail & Dispatch Actions Panel */}
        <div className="hidden md:flex flex-1 flex-col bg-[#101513] overflow-y-auto p-5 space-y-4">
          {selectedIncident ? (
            <div className="space-y-4 max-w-3xl">
              {/* Header Box */}
              <div className="p-4 rounded bg-[#151C18] border border-[#303B33] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#64B58A]">{selectedIncident.id}</span>
                    <Badge variant={getSeverityBadgeVariant(selectedIncident.severity)}>
                      {selectedIncident.severity.toUpperCase()}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(selectedIncident.status)}>
                      {selectedIncident.status.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-xs font-mono text-[#9AA59C]">
                    Reported: {new Date(selectedIncident.reportedAt).toLocaleTimeString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#F0F2EC]">
                  {selectedIncident.category.replace('_', ' ').toUpperCase()}: {selectedIncident.description}
                </h3>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#303B33] font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-[#9AA59C] block">ZONE LOCATION</span>
                    <span className="text-[#F0F2EC] font-semibold">
                      {venue.elements.find(e => e.id === selectedIncident.zoneId)?.name || selectedIncident.zoneId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9AA59C] block">REPORTED BY</span>
                    <span className="text-[#F0F2EC] font-semibold">{selectedIncident.reportedBy}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9AA59C] block">ASSIGNED DISPATCH</span>
                    <span className="text-[#80A8C8] font-semibold">{selectedIncident.assignedTeam}</span>
                  </div>
                </div>
              </div>

              {/* Status Update Controls */}
              <div className="p-4 rounded bg-[#151C18] border border-[#303B33] space-y-3">
                <div className="text-xs font-mono uppercase text-[#78977E]">Update Incident State</div>
                <div className="flex flex-wrap gap-2">
                  {(['reported', 'acknowledged', 'in_progress', 'resolved', 'closed'] as IncidentStatus[]).map(st => (
                    <Button
                      key={st}
                      size="sm"
                      variant={selectedIncident.status === st ? 'primary' : 'outline'}
                      onClick={() => updateIncidentStatus(selectedIncident.id, st)}
                      className="text-xs font-mono uppercase"
                    >
                      {st.replace('_', ' ')}
                    </Button>
                  ))}
                </div>

                {selectedIncident.status !== 'resolved' && selectedIncident.status !== 'closed' && (
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add brief resolution summary..."
                      value={resolutionSummary}
                      onChange={(e) => setResolutionSummary(e.target.value)}
                      className="flex-1 bg-[#101513] border border-[#303B33] rounded px-3 py-1.5 text-xs text-[#F0F2EC]"
                    />
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleResolve}
                      className="text-xs font-mono"
                    >
                      Resolve & Clear
                    </Button>
                  </div>
                )}
              </div>

              {/* Response Log & Notes */}
              <div className="p-4 rounded bg-[#151C18] border border-[#303B33] space-y-3">
                <div className="text-xs font-semibold text-[#F0F2EC] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#78977E]" />
                  <span>Tactical Notes & Chronology</span>
                </div>

                <div className="space-y-2">
                  {selectedIncident.notes.map(note => (
                    <div key={note.id} className="p-3 rounded bg-[#101513] border border-[#303B33] space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#78977E]">
                        <span className="font-semibold text-[#64B58A]">{note.author}</span>
                        <span>{new Date(note.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-[#F0F2EC] leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="pt-2 flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Add operational update or responder note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 bg-[#101513] border border-[#303B33] rounded px-3 py-1.5 text-xs text-[#F0F2EC] outline-none focus:border-[#64B58A]"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="secondary"
                    icon={<Send className="w-3 h-3" />}
                    className="text-xs font-mono"
                  >
                    Post Note
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-xs font-mono text-[#9AA59C]">
              Select an incident from the queue to view full tactical detail and chronology.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

