import React, { useState, useRef, useEffect } from 'react';
import { VenueElement, VenueElementType, StaffMember } from '../../types';
import { cn } from '../../lib/utils';

export interface VenueCanvasLayers {
  structure: boolean;
  zones: boolean;
  gates: boolean;
  exits: boolean;
  emergency: boolean;
  barriers: boolean;
  staff: boolean;
  densityOverlay: boolean;
  grid: boolean;
}

interface VenueCanvasProps {
  elements: VenueElement[];
  selectedElementId: string | null;
  onSelectElement: (element: VenueElement | null) => void;
  onUpdateElement: (element: VenueElement) => void;
  onDeleteElement?: (id: string) => void;
  layers: VenueCanvasLayers;
  staff?: StaffMember[];
  simulatedDensityData?: Record<string, number>;
  simulatedAgents?: { id: number; x: number; y: number; status: string; zoneId: string }[];
  isLiveMode?: boolean;
  readOnly?: boolean;
}

export const VenueCanvas: React.FC<VenueCanvasProps> = ({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  layers,
  staff = [],
  simulatedDensityData,
  simulatedAgents = [],
  isLiveMode = false,
  readOnly = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 20, y: 20 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Dragging / Resizing elements
  const [draggingElementId, setDraggingElementId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [initialResizeState, setInitialResizeState] = useState<{ x: number; y: number; width: number; height: number; mouseX: number; mouseY: number } | null>(null);

  const selectedElement = elements.find(e => e.id === selectedElementId) || null;

  // Zoom handlers
  const handleZoomIn = () => setZoom(prev => Math.min(2.5, prev + 0.15));
  const handleZoomOut = () => setZoom(prev => Math.max(0.4, prev - 0.15));
  const handleFit = () => {
    setZoom(0.95);
    setPan({ x: 20, y: 15 });
  };

  // Canvas Mouse Down (Panning)
  const handleCanvasMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // If clicking background
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).id === 'canvas-bg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      onSelectElement(null);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    if (isResizing && initialResizeState && selectedElement && !readOnly) {
      const dx = (e.clientX - initialResizeState.mouseX) / zoom;
      const dy = (e.clientY - initialResizeState.mouseY) / zoom;
      const newWidth = Math.max(20, Math.round((initialResizeState.width + dx) / 10) * 10);
      const newHeight = Math.max(15, Math.round((initialResizeState.height + dy) / 10) * 10);

      onUpdateElement({
        ...selectedElement,
        width: newWidth,
        height: newHeight
      });
      return;
    }

    if (draggingElementId && !readOnly) {
      const el = elements.find(item => item.id === draggingElementId);
      if (!el) return;

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      // Calculate SVG coordinates
      const mouseSvgX = (e.clientX - containerRect.left - pan.x) / zoom;
      const mouseSvgY = (e.clientY - containerRect.top - pan.y) / zoom;

      // Snap to 10px grid
      const snappedX = Math.max(0, Math.round((mouseSvgX - dragOffset.x) / 10) * 10);
      const snappedY = Math.max(0, Math.round((mouseSvgY - dragOffset.y) / 10) * 10);

      onUpdateElement({
        ...el,
        x: snappedX,
        y: snappedY
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingElementId(null);
    setIsResizing(false);
    setInitialResizeState(null);
    setResizeHandle(null);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom(prev => Math.max(0.4, Math.min(2.5, prev + delta)));
  };

  // Keyboard shortcut delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId && !readOnly && onDeleteElement) {
        // Prevent deleting if focus is on input
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) return;
        onDeleteElement(selectedElementId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, readOnly, onDeleteElement]);

  // Color helper based on element type and density
  const getElementFill = (el: VenueElement) => {
    if (layers.densityOverlay && (el.type === 'zone' || el.type === 'stage' || el.type === 'food_court')) {
      const occupancy = simulatedDensityData ? (simulatedDensityData[el.id] || 0) : (el.currentSimulatedOccupancy || 0);
      const cap = el.capacity || 1000;
      const ratio = occupancy / cap;

      if (ratio > 1.0) return 'rgba(227, 107, 98, 0.45)'; // Critical Red
      if (ratio > 0.85) return 'rgba(229, 170, 82, 0.45)'; // Warning Amber
      if (ratio > 0.5) return 'rgba(100, 181, 138, 0.35)'; // Operational Green
      return 'rgba(32, 42, 36, 0.6)';
    }

    switch (el.type) {
      case 'stage': return '#26382E';
      case 'zone': return '#1E2822';
      case 'food_court': return '#253427';
      case 'gate': return el.operatingStatus === 'closed' ? '#3B2323' : '#1E3628';
      case 'exit': return '#1B3128';
      case 'medical': return '#1A382C';
      case 'security': return '#2A2E24';
      case 'restroom': return '#202A24';
      case 'restricted': return '#382E1E';
      case 'assembly': return '#1A2F2B';
      case 'barrier': return '#455047';
      default: return '#1F2923';
    }
  };

  const getElementStroke = (el: VenueElement, isSelected: boolean) => {
    if (isSelected) return '#64B58A';

    if (layers.densityOverlay && (el.type === 'zone' || el.type === 'stage' || el.type === 'food_court')) {
      const occupancy = simulatedDensityData ? (simulatedDensityData[el.id] || 0) : (el.currentSimulatedOccupancy || 0);
      const cap = el.capacity || 1000;
      const ratio = occupancy / cap;
      if (ratio > 1.0) return '#E36B62';
      if (ratio > 0.85) return '#E5AA52';
      if (ratio > 0.5) return '#64B58A';
    }

    switch (el.type) {
      case 'stage': return '#64B58A';
      case 'gate': return el.operatingStatus === 'closed' ? '#E36B62' : '#64B58A';
      case 'exit': return '#64B58A';
      case 'medical': return '#64B58A';
      case 'security': return '#80A8C8';
      case 'restricted': return '#E5AA52';
      case 'assembly': return '#78977E';
      case 'barrier': return '#78977E';
      default: return '#303B33';
    }
  };

  return (
    <div 
      ref={containerRef}
      onWheel={handleWheel}
      className="relative w-full h-full bg-[#101513] overflow-hidden select-none border border-[#303B33] rounded-sm"
    >
      {/* Zoom / Pan Controls HUD */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-[#151C18]/90 border border-[#303B33] rounded p-1 shadow-md font-mono text-xs text-[#9AA59C]">
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#202A24] text-[#F0F2EC]"
          title="Zoom Out"
        >
          -
        </button>
        <span className="w-12 text-center text-[11px] text-[#F0F2EC]">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#202A24] text-[#F0F2EC]"
          title="Zoom In"
        >
          +
        </button>
        <div className="w-[1px] h-4 bg-[#303B33] mx-1" />
        <button
          onClick={handleFit}
          className="px-2 h-7 flex items-center justify-center rounded hover:bg-[#202A24] text-[#64B58A] text-[11px]"
          title="Reset View"
        >
          Fit
        </button>
      </div>

      {/* Coordinate & Element Count HUD */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3 bg-[#151C18]/85 border border-[#303B33] px-3 py-1.5 rounded font-mono text-[11px] text-[#9AA59C]">
        <span className="text-[#64B58A]">SCALE 1:1</span>
        <span>·</span>
        <span>OBJECTS: <strong className="text-[#F0F2EC]">{elements.length}</strong></span>
        {selectedElement && (
          <>
            <span>·</span>
            <span className="text-[#F0F2EC]">
              SELECTED: {selectedElement.id} ({selectedElement.x}, {selectedElement.y})
            </span>
          </>
        )}
      </div>

      {/* Main Interactive SVG Canvas */}
      <svg
        id="venue-svg"
        className="w-full h-full cursor-crosshair"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
      >
        <defs>
          {/* Architectural Fine Grid Pattern */}
          <pattern id="archGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#303B33" strokeWidth="0.5" strokeOpacity="0.4" />
          </pattern>
          <pattern id="archGridMajor" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#archGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#303B33" strokeWidth="1" strokeOpacity="0.8" />
          </pattern>
          
          {/* Restricted Area Diagonal Stripe Pattern */}
          <pattern id="restrictedStripe" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="10" stroke="#E5AA52" strokeWidth="2" strokeOpacity="0.3" />
          </pattern>
        </defs>

        {/* Pan and Zoom Group */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Background Canvas Bounds */}
          <rect
            id="canvas-bg"
            x="-200"
            y="-200"
            width="1500"
            height="1200"
            fill="#101513"
          />

          {/* Grid overlay */}
          {layers.grid && (
            <rect
              x="0"
              y="0"
              width="1050"
              height="750"
              fill="url(#archGridMajor)"
              className="pointer-events-none"
            />
          )}

          {/* Perimeter Boundary Box */}
          <rect
            x="0"
            y="0"
            width="1020"
            height="720"
            fill="none"
            stroke="#303B33"
            strokeWidth="2"
            strokeDasharray="8 4"
            className="pointer-events-none"
          />

          {/* Render Elements by Layer Priority */}
          {elements.map((el) => {
            // Check layer visibility
            if (el.type === 'zone' && !layers.zones) return null;
            if (el.type === 'stage' && !layers.structure) return null;
            if (el.type === 'food_court' && !layers.zones) return null;
            if (el.type === 'gate' && !layers.gates) return null;
            if (el.type === 'exit' && !layers.exits) return null;
            if (el.type === 'medical' && !layers.emergency) return null;
            if (el.type === 'security' && !layers.emergency) return null;
            if (el.type === 'barrier' && !layers.barriers) return null;
            if (el.type === 'assembly' && !layers.emergency) return null;

            const isSelected = selectedElementId === el.id;
            const fill = getElementFill(el);
            const stroke = getElementStroke(el, isSelected);

            return (
              <g
                key={el.id}
                transform={`translate(${el.x}, ${el.y})`}
                className="cursor-move select-none"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onSelectElement(el);
                  if (!readOnly) {
                    setDraggingElementId(el.id);
                    const containerRect = containerRef.current?.getBoundingClientRect();
                    if (containerRect) {
                      const mouseSvgX = (e.clientX - containerRect.left - pan.x) / zoom;
                      const mouseSvgY = (e.clientY - containerRect.top - pan.y) / zoom;
                      setDragOffset({
                        x: mouseSvgX - el.x,
                        y: mouseSvgY - el.y
                      });
                    }
                  }
                }}
              >
                {/* Object Shape */}
                <rect
                  width={el.width}
                  height={el.height}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isSelected ? 2.5 : 1.2}
                  strokeDasharray={el.type === 'barrier' ? '4 2' : el.type === 'restricted' ? '6 3' : undefined}
                  rx={2}
                  className="transition-colors duration-150"
                />

                {/* Restricted Overlay Pattern */}
                {el.type === 'restricted' && (
                  <rect
                    width={el.width}
                    height={el.height}
                    fill="url(#restrictedStripe)"
                    pointerEvents="none"
                  />
                )}

                {/* Type Icon / Badge Indicator */}
                <g className="pointer-events-none">
                  {/* Gate / Exit flow arrow */}
                  {(el.type === 'gate' || el.type === 'exit') && (
                    <circle
                      cx={el.width / 2}
                      cy={el.height / 2}
                      r={Math.min(el.width, el.height) / 3.5}
                      fill={el.type === 'gate' ? '#64B58A' : '#80A8C8'}
                      fillOpacity={0.8}
                    />
                  )}

                  {/* Medical Red Cross Marker */}
                  {el.type === 'medical' && (
                    <path
                      d={`M ${el.width/2 - 6} ${el.height/2} H ${el.width/2 + 6} M ${el.width/2} ${el.height/2 - 6} V ${el.height/2 + 6}`}
                      stroke="#64B58A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  )}
                </g>

                {/* Object Label */}
                <text
                  x={el.width > 70 ? 8 : el.width / 2}
                  y={el.height > 40 ? 16 : el.height / 2 + 3}
                  textAnchor={el.width > 70 ? 'start' : 'middle'}
                  fill="#F0F2EC"
                  fontSize={el.type === 'stage' ? 12 : 10}
                  fontFamily="IBM Plex Mono"
                  fontWeight={el.type === 'stage' ? '600' : '500'}
                  className="pointer-events-none select-none"
                >
                  {el.name}
                </text>

                {/* Subtext info: Capacity / Status */}
                {el.width > 90 && el.height > 45 && (
                  <text
                    x={8}
                    y={30}
                    fill="#9AA59C"
                    fontSize={9}
                    fontFamily="IBM Plex Mono"
                    className="pointer-events-none select-none"
                  >
                    {el.capacity ? `CAP: ${el.capacity}` : ''}
                    {el.throughputPerHour ? `FLOW: ${el.throughputPerHour}/h` : ''}
                    {el.operatingStatus ? ` · ${el.operatingStatus.toUpperCase()}` : ''}
                  </text>
                )}

                {/* Resize handle on selected element (Bottom-Right) */}
                {isSelected && !readOnly && (
                  <rect
                    x={el.width - 7}
                    y={el.height - 7}
                    width={7}
                    height={7}
                    fill="#64B58A"
                    stroke="#101513"
                    strokeWidth="1"
                    className="cursor-se-resize"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setIsResizing(true);
                      setResizeHandle('br');
                      setInitialResizeState({
                        x: el.x,
                        y: el.y,
                        width: el.width,
                        height: el.height,
                        mouseX: e.clientX,
                        mouseY: e.clientY
                      });
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* Render Staff Markers */}
          {layers.staff && staff.map(stf => {
            const assignedZone = elements.find(el => el.id === stf.assignedZoneId);
            if (!assignedZone) return null;

            // Compute pseudo position inside zone
            const hash = stf.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
            const posX = assignedZone.x + 15 + (hash % Math.max(20, assignedZone.width - 30));
            const posY = assignedZone.y + 20 + ((hash * 7) % Math.max(15, assignedZone.height - 35));

            return (
              <g key={stf.id} transform={`translate(${posX}, ${posY})`} className="pointer-events-none">
                <circle
                  r={5}
                  fill={stf.role === 'security' ? '#80A8C8' : stf.role === 'medical' ? '#64B58A' : '#E5AA52'}
                  stroke="#101513"
                  strokeWidth="1.5"
                />
                <text
                  y={12}
                  textAnchor="middle"
                  fill="#F0F2EC"
                  fontSize={8}
                  fontFamily="IBM Plex Mono"
                >
                  {stf.avatarInitials}
                </text>
              </g>
            );
          })}

          {/* Render Dynamic Simulated Crowd Agents (Dots) */}
          {simulatedAgents.map(ag => (
            <circle
              key={ag.id}
              cx={ag.x}
              cy={ag.y}
              r={2.5}
              fill="#64B58A"
              fillOpacity={0.85}
              className="pointer-events-none"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

