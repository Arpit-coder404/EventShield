import React, { useState } from 'react';
import { 
  Plus, 
  Save, 
  Layers, 
  Maximize2, 
  Eye, 
  Check, 
  Sparkles,
  Grid,
  Shield,
  RotateCcw
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { VenueCanvas, VenueCanvasLayers } from './VenueCanvas';
import { ElementPropertiesPanel } from './ElementPropertiesPanel';
import { VenueElement, VenueElementType } from '../../types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const VenueDesigner: React.FC = () => {
  const { venue, updateVenueElement, addVenueElement, deleteVenueElement, saveVenueElements, staff } = useAppStore();
  
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [layers, setLayers] = useState<VenueCanvasLayers>({
    structure: true,
    zones: true,
    gates: true,
    exits: true,
    emergency: true,
    barriers: true,
    staff: true,
    densityOverlay: false,
    grid: true
  });

  const selectedElement = venue.elements.find(e => e.id === selectedElementId) || null;

  const toggleLayer = (key: keyof VenueCanvasLayers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddNewElement = (type: VenueElementType) => {
    const count = venue.elements.filter(e => e.type === type).length + 1;
    const typeNames: Record<VenueElementType, string> = {
      stage: `Stage ${count}`,
      zone: `Crowd Zone ${count}`,
      gate: `Gate G0${count}`,
      exit: `Exit E0${count}`,
      food_court: `Food Court ${count}`,
      medical: `Medical Station ${count}`,
      security: `Security Check ${count}`,
      restroom: `Restroom Pod ${count}`,
      restricted: `Restricted Area ${count}`,
      assembly: `Assembly Point ${count}`,
      barrier: `Barrier Line ${count}`,
      pathway: `Pathway ${count}`
    };

    const newElement: VenueElement = {
      id: `${type}_${Date.now().toString().slice(-4)}`,
      name: typeNames[type],
      type,
      x: 350 + (count * 15) % 150,
      y: 250 + (count * 15) % 100,
      width: type === 'stage' ? 200 : type === 'gate' ? 40 : type === 'barrier' ? 120 : 150,
      height: type === 'stage' ? 80 : type === 'gate' ? 60 : type === 'barrier' ? 10 : 120,
      capacity: ['zone', 'stage', 'food_court', 'assembly'].includes(type) ? 1000 : undefined,
      throughputPerHour: ['gate', 'exit'].includes(type) ? 1500 : undefined,
      operatingStatus: 'open'
    };

    addVenueElement(newElement);
    setSelectedElementId(newElement.id);
    setIsAddMenuOpen(false);
  };

  const handleSave = () => {
    saveVenueElements(venue.elements);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden bg-[#101513]">
      {/* Top Operations Toolbar */}
      <div className="h-12 border-b border-[#303B33] bg-[#151C18] px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#F0F2EC]">{venue.name}</span>
            <Badge variant="green" className="text-[10px]">VECTOR SVG CANVAS</Badge>
          </div>

          <div className="h-4 w-[1px] bg-[#303B33]" />

          {/* Add Element Dropdown */}
          <div className="relative">
            <Button
              size="sm"
              variant="primary"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
              className="text-xs"
            >
              Add Element
            </Button>

            {isAddMenuOpen && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-[#1B231E] border border-[#303B33] rounded shadow-2xl py-1 z-40 text-xs font-medium">
                <div className="px-3 py-1 text-[10px] font-mono uppercase text-[#78977E]">Select Venue Asset</div>
                <button
                  onClick={() => handleAddNewElement('zone')}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#202A24] text-[#F0F2EC]"
                >
                  Crowd Zone
                </button>
                <button
                  onClick={() => handleAddNewElement('stage')}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#202A24] text-[#F0F2EC]"
                >
                  Stage / Platform
                </button>
                <button
                  onClick={() => handleAddNewElement('gate')}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#202A24] text-[#F0F2EC]"
                >
                  Ingress Gate
                </button>
                <button
                  onClick={() => handleAddNewElement('exit')}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#202A24] text-[#F0F2EC]"
                >
                  Emergency Exit
                </button>
                <button
                  onClick={() => handleAddNewElement('medical')}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#202A24] text-[#F0F2EC]"
                >
                  Medical Station
                </button>
                <button
                  onClick={() => handleAddNewElement('food_court')}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#202A24] text-[#F0F2EC]"
                >
                  Food / Concession Court
                </button>
                <button
                  onClick={() => handleAddNewElement('security')}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#202A24] text-[#F0F2EC]"
                >
                  Security Checkpoint
                </button>
                <button
                  onClick={() => handleAddNewElement('barrier')}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#202A24] text-[#F0F2EC]"
                >
                  Crowd Barrier Fence
                </button>
                <button
                  onClick={() => handleAddNewElement('restricted')}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#202A24] text-[#F0F2EC]"
                >
                  Restricted Backstage
                </button>
                <button
                  onClick={() => handleAddNewElement('restroom')}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#202A24] text-[#F0F2EC]"
                >
                  Sanitation Restroom
                </button>
                <button
                  onClick={() => handleAddNewElement('assembly')}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#202A24] text-[#F0F2EC]"
                >
                  Emergency Assembly Area
                </button>
              </div>
            )}
          </div>

          {/* Layer Visibility Toggles */}
          <div className="relative">
            <Button
              size="sm"
              variant="secondary"
              icon={<Layers className="w-3.5 h-3.5" />}
              onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
              className="text-xs"
            >
              Layers
            </Button>

            {isLayerMenuOpen && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-[#1B231E] border border-[#303B33] rounded shadow-2xl p-2 z-40 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono uppercase text-[#78977E]">Display Layers</div>
                {(
                  [
                    ['structure', 'Venue Stages & Structures'],
                    ['zones', 'Crowd Zones & Pavilions'],
                    ['gates', 'Ingress Gates'],
                    ['exits', 'Emergency Exits'],
                    ['emergency', 'Medical & Security Posts'],
                    ['barriers', 'Crowd Control Barriers'],
                    ['staff', 'Deployed Staff Markers'],
                    ['densityOverlay', 'Density Color Heatmap'],
                    ['grid', 'Architectural Grid'],
                  ] as [keyof VenueCanvasLayers, string][]
                ).map(([key, label]) => (
                  <label
                    key={key}
                    onClick={() => toggleLayer(key)}
                    className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-[#202A24] cursor-pointer text-[#F0F2EC]"
                  >
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={layers[key]}
                      readOnly
                      className="accent-[#64B58A] cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={<Grid className="w-3.5 h-3.5" />}
            onClick={() => toggleLayer('grid')}
            className="text-xs font-mono hidden sm:inline-flex"
          >
            {layers.grid ? 'Hide Grid' : 'Show Grid'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            icon={<Save className="w-3.5 h-3.5" />}
            onClick={handleSave}
            className="text-xs"
          >
            {saveSuccess ? 'Saved!' : 'Save Layout'}
          </Button>
        </div>
      </div>

      {/* Main Workspace: Canvas + Properties Inspector */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 h-full relative">
          <VenueCanvas
            elements={venue.elements}
            selectedElementId={selectedElementId}
            onSelectElement={(el) => setSelectedElementId(el ? el.id : null)}
            onUpdateElement={updateVenueElement}
            onDeleteElement={deleteVenueElement}
            layers={layers}
            staff={staff}
          />
        </div>

        {/* Properties Inspector Panel */}
        <ElementPropertiesPanel
          element={selectedElement}
          onUpdate={updateVenueElement}
          onDelete={(id) => {
            deleteVenueElement(id);
            setSelectedElementId(null);
          }}
          onClose={() => setSelectedElementId(null)}
        />
      </div>
    </div>
  );
};

