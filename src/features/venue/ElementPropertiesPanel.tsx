import React from 'react';
import { Trash2, Shield, X, Sliders } from 'lucide-react';
import { VenueElement, VenueElementType, GateStatus } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface ElementPropertiesPanelProps {
  element: VenueElement | null;
  onUpdate: (updated: VenueElement) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const ElementPropertiesPanel: React.FC<ElementPropertiesPanelProps> = ({
  element,
  onUpdate,
  onDelete,
  onClose,
}) => {
  if (!element) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-[#9AA59C] font-mono text-xs border-l border-[#303B33] bg-[#151C18]">
        <Sliders className="w-8 h-8 text-[#78977E]/50 mb-3" />
        <div className="text-sm font-semibold text-[#F0F2EC] mb-1 font-sans">No Object Selected</div>
        <p className="text-[11px] text-[#9AA59C] max-w-[200px] leading-relaxed">
          Click any element on the venue canvas to view and calibrate spatial attributes.
        </p>
      </div>
    );
  }

  const handleFieldChange = (field: keyof VenueElement, value: any) => {
    onUpdate({
      ...element,
      [field]: value
    });
  };

  const elementTypes: { label: string; value: VenueElementType }[] = [
    { label: 'Crowd Zone', value: 'zone' },
    { label: 'Performance Stage', value: 'stage' },
    { label: 'Ingress Gate', value: 'gate' },
    { label: 'Emergency Exit', value: 'exit' },
    { label: 'Food / Concession Court', value: 'food_court' },
    { label: 'Medical Post / First-Aid', value: 'medical' },
    { label: 'Security Checkpoint', value: 'security' },
    { label: 'Restrooms / Sanitation', value: 'restroom' },
    { label: 'Restricted Backstage', value: 'restricted' },
    { label: 'Assembly Point', value: 'assembly' },
    { label: 'Crowd Barrier / Fence', value: 'barrier' },
  ];

  const gateStatuses: GateStatus[] = ['planned', 'ready', 'open', 'restricted', 'closed'];

  return (
    <div className="h-full w-80 bg-[#151C18] border-l border-[#303B33] flex flex-col overflow-hidden select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-[#303B33] bg-[#1B231E]/60 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#78977E]">PROPERTIES INSPECTOR</span>
          <h3 className="text-xs font-semibold text-[#F0F2EC] truncate max-w-[200px]">
            {element.name}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-[#9AA59C] hover:text-[#F0F2EC] hover:bg-[#202A24]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Identifier & Type */}
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-mono uppercase text-[#9AA59C] mb-1">
              Element ID
            </label>
            <input
              type="text"
              readOnly
              value={element.id}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-2.5 py-1.5 text-xs text-[#9AA59C] font-mono cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#9AA59C] mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={element.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-2.5 py-1.5 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#9AA59C] mb-1">
              Element Type
            </label>
            <select
              value={element.type}
              onChange={(e) => handleFieldChange('type', e.target.value as VenueElementType)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-2.5 py-1.5 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            >
              {elementTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Spatial Coordinates & Dimensions */}
        <div className="p-3 bg-[#1B231E]/50 border border-[#303B33] rounded space-y-2">
          <div className="text-[10px] font-mono uppercase text-[#78977E] tracking-wider">
            Spatial Geometry (Grid Px)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <span className="text-[#9AA59C] text-[10px]">POS X</span>
              <input
                type="number"
                value={element.x}
                onChange={(e) => handleFieldChange('x', Number(e.target.value))}
                className="w-full bg-[#101513] border border-[#303B33] rounded px-2 py-1 text-[#F0F2EC]"
              />
            </div>
            <div>
              <span className="text-[#9AA59C] text-[10px]">POS Y</span>
              <input
                type="number"
                value={element.y}
                onChange={(e) => handleFieldChange('y', Number(e.target.value))}
                className="w-full bg-[#101513] border border-[#303B33] rounded px-2 py-1 text-[#F0F2EC]"
              />
            </div>
            <div>
              <span className="text-[#9AA59C] text-[10px]">WIDTH</span>
              <input
                type="number"
                value={element.width}
                onChange={(e) => handleFieldChange('width', Number(e.target.value))}
                className="w-full bg-[#101513] border border-[#303B33] rounded px-2 py-1 text-[#F0F2EC]"
              />
            </div>
            <div>
              <span className="text-[#9AA59C] text-[10px]">HEIGHT</span>
              <input
                type="number"
                value={element.height}
                onChange={(e) => handleFieldChange('height', Number(e.target.value))}
                className="w-full bg-[#101513] border border-[#303B33] rounded px-2 py-1 text-[#F0F2EC]"
              />
            </div>
          </div>
        </div>

        {/* Capacity / Throughput Settings */}
        <div className="space-y-3">
          {(element.type === 'zone' || element.type === 'stage' || element.type === 'food_court' || element.type === 'assembly') && (
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#9AA59C] mb-1">
                Planned Capacity (Persons)
              </label>
              <input
                type="number"
                step={50}
                value={element.capacity || 1000}
                onChange={(e) => handleFieldChange('capacity', Number(e.target.value))}
                className="w-full bg-[#101513] border border-[#303B33] rounded px-2.5 py-1.5 text-xs text-[#F0F2EC] font-mono focus:border-[#64B58A] outline-none"
              />
            </div>
          )}

          {(element.type === 'gate' || element.type === 'exit') && (
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#9AA59C] mb-1">
                Throughput Capacity (People / Hour)
              </label>
              <input
                type="number"
                step={100}
                value={element.throughputPerHour || 1500}
                onChange={(e) => handleFieldChange('throughputPerHour', Number(e.target.value))}
                className="w-full bg-[#101513] border border-[#303B33] rounded px-2.5 py-1.5 text-xs text-[#F0F2EC] font-mono focus:border-[#64B58A] outline-none"
              />
            </div>
          )}

          {/* Operating Status */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-[#9AA59C] mb-1">
              Operational Status
            </label>
            <select
              value={element.operatingStatus || 'open'}
              onChange={(e) => handleFieldChange('operatingStatus', e.target.value as GateStatus)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-2.5 py-1.5 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            >
              {gateStatuses.map(s => (
                <option key={s} value={s}>{s.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Access Restriction */}
          <div>
            <label className="block text-[10px] font-mono uppercase text-[#9AA59C] mb-1">
              Access Restrictions / Credentials
            </label>
            <input
              type="text"
              placeholder="e.g. Public Access, VIP Only, Crew Credential"
              value={element.accessRestrictions || ''}
              onChange={(e) => handleFieldChange('accessRestrictions', e.target.value)}
              className="w-full bg-[#101513] border border-[#303B33] rounded px-2.5 py-1.5 text-xs text-[#F0F2EC] focus:border-[#64B58A] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-[#303B33] bg-[#1B231E]/60 flex items-center justify-between">
        <Button
          size="sm"
          variant="danger"
          icon={<Trash2 className="w-3.5 h-3.5" />}
          onClick={() => onDelete(element.id)}
          className="text-xs"
        >
          Delete Object
        </Button>
        <span className="text-[10px] font-mono text-[#78977E]">AUTO-SYNCED</span>
      </div>
    </div>
  );
};

