import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { useAppStore } from '../../store/useAppStore';
import { EventCategory } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const { createEvent, setCurrentPage } = useAppStore();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('University Festival');
  const [organizer, setOrganizer] = useState('University Operations');
  const [venueName, setVenueName] = useState('Campus Central Quad');
  const [date, setDate] = useState('2026-11-28');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('22:00');
  const [expectedAttendance, setExpectedAttendance] = useState(6500);
  const [maxPlannedAttendance, setMaxPlannedAttendance] = useState(8500);
  const [numStages, setNumStages] = useState(2);
  const [eventType, setEventType] = useState<'Outdoor Campus' | 'Indoor Arena' | 'Open Park' | 'Convention Center'>('Outdoor Campus');
  const [contactName, setContactName] = useState('Safety Director Vance');
  const [contactPhone, setContactPhone] = useState('+1 (555) 019-3829');
  const [contactRole, setContactRole] = useState('Operations Safety Lead');
  const [contactChannel, setContactChannel] = useState('VHF Channel 1');

  const categories: EventCategory[] = [
    'University Festival',
    'Concert',
    'Conference',
    'Sports Event',
    'Exhibition',
    'Workshop',
    'Cultural Celebration',
    'Public Gathering'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createEvent({
      name,
      tagline: tagline || 'Intelligent Event Operations Plan',
      description,
      category,
      organizer,
      venueName,
      date,
      startTime,
      endTime,
      expectedAttendance: Number(expectedAttendance),
      maxPlannedAttendance: Number(maxPlannedAttendance),
      numStages: Number(numStages),
      eventType,
      emergencyContact: {
        name: contactName,
        phone: contactPhone,
        role: contactRole,
        channel: contactChannel
      },
      operationalTeam: [contactName, organizer],
      status: 'planning'
    });

    onClose();
    setCurrentPage('overview');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Event Plan"
      subtitle="Initialize an operational safety and crowd simulation command plan"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              Event Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SOLSTICE MUSIC FEST 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
            Short Tagline / Scope
          </label>
          <input
            type="text"
            placeholder="e.g. Annual Outdoor Inter-Collegiate Arts & Music Gathering"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              Venue Name
            </label>
            <input
              type="text"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              Organizer Entity
            </label>
            <input
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              Venue Layout Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as any)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            >
              <option value="Outdoor Campus">Outdoor Campus Grounds</option>
              <option value="Indoor Arena">Indoor Arena / Stadium</option>
              <option value="Open Park">Open Municipal Park</option>
              <option value="Convention Center">Convention Center Hall</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              Event Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              Expected Attendance
            </label>
            <input
              type="number"
              min={100}
              max={100000}
              step={100}
              value={expectedAttendance}
              onChange={(e) => setExpectedAttendance(Number(e.target.value))}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              Max Planned Cap
            </label>
            <input
              type="number"
              min={100}
              max={150000}
              step={100}
              value={maxPlannedAttendance}
              onChange={(e) => setMaxPlannedAttendance(Number(e.target.value))}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-[#9AA59C] mb-1">
              Number of Stages
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={numStages}
              onChange={(e) => setNumStages(Number(e.target.value))}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none font-mono"
            />
          </div>
        </div>

        <div className="p-3 bg-[#151C18] border border-[#303B33] rounded space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#78977E]">
            Emergency Operations Contact
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Lead Contact Name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="bg-[#101513] border border-[#303B33] rounded px-2.5 py-1.5 text-xs text-[#F0F2EC]"
            />
            <input
              type="text"
              placeholder="Emergency Phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="bg-[#101513] border border-[#303B33] rounded px-2.5 py-1.5 text-xs text-[#F0F2EC] font-mono"
            />
            <input
              type="text"
              placeholder="Operational Role"
              value={contactRole}
              onChange={(e) => setContactRole(e.target.value)}
              className="bg-[#101513] border border-[#303B33] rounded px-2.5 py-1.5 text-xs text-[#F0F2EC]"
            />
            <input
              type="text"
              placeholder="Tactical Radio Channel"
              value={contactChannel}
              onChange={(e) => setContactChannel(e.target.value)}
              className="bg-[#101513] border border-[#303B33] rounded px-2.5 py-1.5 text-xs text-[#F0F2EC] font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2 border-t border-[#303B33]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Initialize Event Command
          </Button>
        </div>
      </form>
    </Modal>
  );
};

