import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { useAppStore } from '../../store/useAppStore';
import { IncidentCategory, IncidentSeverity } from '../../types';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({ isOpen, onClose }) => {
  const { venue, createIncident, staff } = useAppStore();

  const [category, setCategory] = useState<IncidentCategory>('crowd_congestion');
  const [severity, setSeverity] = useState<IncidentSeverity>('moderate');
  const [zoneId, setZoneId] = useState<string>(venue.elements[0]?.id || 'zone_entry_plaza');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState('Safety Marshal Patrol');
  const [assignedTeam, setAssignedTeam] = useState('Perimeter Security');

  const categories: { label: string; value: IncidentCategory }[] = [
    { label: 'Crowd Congestion / Bottleneck', value: 'crowd_congestion' },
    { label: 'Medical / First Aid', value: 'medical' },
    { label: 'Security / Access Violation', value: 'security' },
    { label: 'Infrastructure / Facility Defect', value: 'infrastructure' },
    { label: 'Fire / Smoke Hazard', value: 'fire' },
    { label: 'Lost Person / Separation', value: 'lost_person' },
    { label: 'Access / Credential Issue', value: 'access' },
    { label: 'Technical / Power Failure', value: 'technical' },
    { label: 'Other Operational Matter', value: 'other' },
  ];

  const severities: { label: string; value: IncidentSeverity; color: string }[] = [
    { label: 'Low (Routine monitor)', value: 'low', color: 'text-[#80A8C8]' },
    { label: 'Moderate (Action needed)', value: 'moderate', color: 'text-[#E5AA52]' },
    { label: 'High (Immediate dispatch)', value: 'high', color: 'text-[#E5AA52]' },
    { label: 'Critical (Safety Threat)', value: 'critical', color: 'text-[#E36B62]' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    createIncident({
      category,
      severity,
      zoneId,
      description,
      reportedBy,
      assignedTeam,
      status: 'reported'
    });

    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Operational Incident"
      subtitle="Broadcast tactical incident report to Command Center and field dispatch units"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1.5">
            Incident Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as IncidentCategory)}
            className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1.5">
              Severity Level *
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            >
              {severities.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1.5">
              Affected Zone / Facility *
            </label>
            <select
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            >
              {venue.elements.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.name} ({el.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1.5">
            Operational Description *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe physical condition, observed crowd reaction, and immediate response needs..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#101513] border border-[#303B33] rounded p-2.5 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none placeholder:text-[#9AA59C]/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1.5">
              Reported By
            </label>
            <input
              type="text"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1.5">
              Assigned Response Team
            </label>
            <select
              value={assignedTeam}
              onChange={(e) => setAssignedTeam(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            >
              <option value="Perimeter Security">Perimeter Security</option>
              <option value="EMS Alpha Unit">EMS Alpha Unit</option>
              <option value="EMS Bravo Unit">EMS Bravo Unit</option>
              <option value="Pit & Mojo Response">Pit & Mojo Response</option>
              <option value="Ticketing & Ingress">Ticketing & Ingress</option>
              <option value="Facilities & Logistics">Facilities & Logistics</option>
              <option value="Operations Hub">Operations Hub</option>
              <option value="Student Guides Squad">Student Guides Squad</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-[#303B33]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Broadcast Incident
          </Button>
        </div>
      </form>
    </Modal>
  );
};

