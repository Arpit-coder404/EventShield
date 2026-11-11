import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sliders, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Activity, 
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { VenueCanvas, VenueCanvasLayers } from '../venue/VenueCanvas';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { ArrivalDistributionType } from '../../types';
import { formatNumber, formatPercent } from '../../lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

export const CrowdSimulationPage: React.FC = () => {
  const { 
    venue, 
    currentEvent, 
    assumptions, 
    updateAssumptions, 
    simulationResult, 
    triggerSimulation,
    staff
  } = useAppStore();

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMinute, setCurrentMinute] = useState(60);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5>(1);
  const [activeTab, setActiveTab] = useState<'assumptions' | 'results' | 'metrics'>('results');

  const totalMinutes = simulationResult.ticks.length || 180;
  const currentTick = simulationResult.ticks[Math.min(currentMinute, totalMinutes - 1)] || simulationResult.ticks[0];

  // Playback timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentMinute(prev => {
          if (prev >= totalMinutes - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 500 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalMinutes, playbackSpeed]);

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

  const handleRunSimulation = () => {
    const res = triggerSimulation();
    setCurrentMinute(res.peakMinute || 60);
  };

  // Chart data sampled across simulation
  const chartData = simulationResult.ticks
    .filter((_, idx) => idx % 4 === 0)
    .map(t => ({
      time: `T+${t.minute}m`,
      inVenue: t.totalInVenue,
      entered: t.totalEntered,
      exited: t.totalExited,
    }));

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#101513] select-none overflow-hidden">
      {/* Top Simulation Playback Control Bar */}
      <div className="h-14 border-b border-[#303B33] bg-[#151C18] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="primary"
            icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-24 text-xs font-semibold"
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              setIsPlaying(false);
              setCurrentMinute(0);
            }}
            className="text-xs"
          >
            Reset
          </Button>

          {/* Speed Selector */}
          <div className="flex items-center bg-[#101513] border border-[#303B33] rounded p-0.5 font-mono text-xs">
            {([1, 2, 5] as const).map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded ${playbackSpeed === speed ? 'bg-[#202A24] text-[#64B58A] font-bold' : 'text-[#9AA59C]'}`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Timeline Scrubber */}
          <div className="flex items-center gap-2 pl-3 ml-2 border-l border-[#303B33]">
            <Clock className="w-4 h-4 text-[#78977E]" />
            <span className="font-mono text-xs text-[#F0F2EC] w-14">
              T+{currentMinute}m
            </span>
            <input
              type="range"
              min={0}
              max={totalMinutes - 1}
              value={currentMinute}
              onChange={(e) => setCurrentMinute(Number(e.target.value))}
              className="w-48 sm:w-64 accent-[#64B58A] cursor-pointer"
            />
            <span className="font-mono text-xs text-[#9AA59C]">
              / T+{totalMinutes}m
            </span>
          </div>
        </div>

        {/* Live Instant Readout */}
        <div className="hidden lg:flex items-center gap-4 font-mono text-xs">
          <div className="text-[#9AA59C]">
            IN VENUE: <strong className="text-[#64B58A]">{formatNumber(currentTick?.totalInVenue || 0)}</strong>
          </div>
          <div className="text-[#9AA59C]">
            ENTERED: <strong className="text-[#F0F2EC]">{formatNumber(currentTick?.totalEntered || 0)}</strong>
          </div>
          <div className="text-[#9AA59C]">
            EXITED: <strong className="text-[#80A8C8]">{formatNumber(currentTick?.totalExited || 0)}</strong>
          </div>
        </div>
      </div>

      {/* Main Simulation Viewport: Map (65%) + Config/Results Panel (35%) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Map Canvas */}
        <div className="flex-1 h-full relative">
          <VenueCanvas
            elements={venue.elements}
            selectedElementId={null}
            onSelectElement={() => {}}
            onUpdateElement={() => {}}
            layers={layers}
            staff={staff}
            simulatedDensityData={currentTick?.zoneOccupancies}
            simulatedAgents={currentTick?.agentsSample}
            readOnly={true}
          />

          {/* Floating Density Scale Legend */}
          <div className="absolute top-3 left-3 z-20 bg-[#151C18]/90 border border-[#303B33] p-2.5 rounded font-mono text-[10px] space-y-1.5 shadow-lg backdrop-blur-sm">
            <div className="text-[#78977E] uppercase tracking-wider font-semibold">Density Model</div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#64B58A]/40 border border-[#64B58A]" />
              <span className="text-[#F0F2EC]">Safe (&lt;70% cap)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#E5AA52]/40 border border-[#E5AA52]" />
              <span className="text-[#E5AA52]">Congested (70–90%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#E36B62]/50 border border-[#E36B62]" />
              <span className="text-[#E36B62]">Exceeded (&gt;100%)</span>
            </div>
          </div>
        </div>

        {/* Right Side Panel: Tabs for Results, Metrics, Assumptions */}
        <div className="w-96 bg-[#151C18] border-l border-[#303B33] flex flex-col overflow-hidden">
          {/* Tab Switcher */}
          <div className="h-10 border-b border-[#303B33] bg-[#1B231E]/60 flex">
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 text-xs font-medium tracking-wide ${activeTab === 'results' ? 'text-[#64B58A] border-b-2 border-[#64B58A] bg-[#202A24]' : 'text-[#9AA59C] hover:text-[#F0F2EC]'}`}
            >
              Sim Results
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`flex-1 text-xs font-medium tracking-wide ${activeTab === 'metrics' ? 'text-[#64B58A] border-b-2 border-[#64B58A] bg-[#202A24]' : 'text-[#9AA59C] hover:text-[#F0F2EC]'}`}
            >
              Timeline Graph
            </button>
            <button
              onClick={() => setActiveTab('assumptions')}
              className={`flex-1 text-xs font-medium tracking-wide ${activeTab === 'assumptions' ? 'text-[#64B58A] border-b-2 border-[#64B58A] bg-[#202A24]' : 'text-[#9AA59C] hover:text-[#F0F2EC]'}`}
            >
              Assumptions
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'results' && (
              <div className="space-y-4">
                {/* Summary Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-[#1B231E] border border-[#303B33] rounded">
                    <div className="text-[10px] font-mono uppercase text-[#9AA59C]">Peak Attendance</div>
                    <div className="text-base font-bold text-[#F0F2EC] font-mono mt-0.5">
                      {formatNumber(simulationResult.peakTotalInVenue)}
                    </div>
                    <div className="text-[10px] text-[#78977E] font-mono">at T+{simulationResult.peakMinute}m</div>
                  </div>

                  <div className="p-3 bg-[#1B231E] border border-[#303B33] rounded">
                    <div className="text-[10px] font-mono uppercase text-[#9AA59C]">Avg Ingress Wait</div>
                    <div className="text-base font-bold text-[#E5AA52] font-mono mt-0.5">
                      {simulationResult.averageGateWaitMinutes} min
                    </div>
                    <div className="text-[10px] text-[#9AA59C] font-mono">Peak queue: {simulationResult.maxGateQueueCount}</div>
                  </div>
                </div>

                {/* Zone Exceedance Breakdown */}
                <div>
                  <div className="text-xs font-semibold text-[#F0F2EC] mb-2 flex items-center justify-between">
                    <span>Zone Utilization at Peak</span>
                    <span className="text-[10px] font-mono text-[#9AA59C]">Capacity Ratio</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(simulationResult.zoneCapacityExceedance).map(([zid, stat]) => {
                      const zone = venue.elements.find(e => e.id === zid);
                      const isOver = stat.exceeded;
                      return (
                        <div key={zid} className="p-2.5 rounded bg-[#101513] border border-[#303B33] space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#F0F2EC] font-medium truncate max-w-[180px]">
                              {zone?.name || zid}
                            </span>
                            <Badge variant={isOver ? 'red' : stat.ratio > 0.8 ? 'amber' : 'green'}>
                              {formatPercent(stat.ratio)}
                            </Badge>
                          </div>
                          
                          <div className="w-full h-1.5 bg-[#202A24] rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isOver ? 'bg-[#E36B62]' : stat.ratio > 0.8 ? 'bg-[#E5AA52]' : 'bg-[#64B58A]'}`}
                              style={{ width: `${Math.min(100, stat.ratio * 100)}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[10px] font-mono text-[#9AA59C]">
                            <span>Peak: {formatNumber(stat.peakCount)}</span>
                            <span>Limit: {formatNumber(stat.capacity)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Operational Recommendations */}
                <div className="p-3 bg-[#1B231E] border border-[#303B33] rounded space-y-2">
                  <div className="text-xs font-semibold text-[#F0F2EC] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#64B58A]" />
                    <span>Operational Mitigations</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#9AA59C] leading-relaxed">
                    {simulationResult.operationalRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#64B58A] mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#1B231E] border border-[#303B33] rounded">
                  <div className="text-xs font-semibold text-[#F0F2EC] mb-1">
                    Venue Attendance Trajectory
                  </div>
                  <p className="text-[11px] text-[#9AA59C] mb-3">
                    Calculated minute-by-minute attendee presence across the {totalMinutes}-minute window.
                  </p>
                  
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#64B58A" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#64B58A" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#78977E" fontSize={10} tickLine={false} />
                        <YAxis stroke="#78977E" fontSize={10} tickLine={false} width={40} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#151C18', borderColor: '#303B33', fontSize: '11px', fontFamily: 'IBM Plex Mono' }}
                        />
                        <Area type="monotone" dataKey="inVenue" stroke="#64B58A" fillOpacity={1} fill="url(#areaColor)" name="In Venue" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gate Queues at Current Minute */}
                <div className="p-3 bg-[#1B231E] border border-[#303B33] rounded space-y-2">
                  <div className="text-xs font-semibold text-[#F0F2EC] flex items-center justify-between">
                    <span>Gate Queue Status (T+{currentMinute}m)</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(currentTick?.gateQueues || {}).map(([gid, q]) => {
                      const gate = venue.elements.find(e => e.id === gid);
                      return (
                        <div key={gid} className="flex items-center justify-between text-xs font-mono p-1.5 rounded bg-[#101513]">
                          <span className="text-[#F0F2EC]">{gate?.name || gid}</span>
                          <span className={q > 100 ? 'text-[#E5AA52] font-bold' : 'text-[#9AA59C]'}>
                            {q} queuing
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assumptions' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#9AA59C] mb-1">
                      Total Expected Attendees
                    </label>
                    <input
                      type="number"
                      step={250}
                      value={assumptions.totalExpectedAttendees}
                      onChange={(e) => updateAssumptions({ totalExpectedAttendees: Number(e.target.value) })}
                      className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#9AA59C] mb-1">
                      Arrival Profile Curve
                    </label>
                    <select
                      value={assumptions.arrivalDistribution}
                      onChange={(e) => updateAssumptions({ arrivalDistribution: e.target.value as ArrivalDistributionType })}
                      className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC]"
                    >
                      <option value="gradual">Gradual Normal Curve (Bell shape, 40% mid)</option>
                      <option value="steep_peak">Steep Ingress Peak (Sudden rush at gates)</option>
                      <option value="dual_surge">Dual Surge (Doors open + Headliner start)</option>
                      <option value="flat">Flat Continuous (Steady entry)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#9AA59C] mb-1">
                      Deterministic Random Seed
                    </label>
                    <input
                      type="number"
                      value={assumptions.randomSeed}
                      onChange={(e) => updateAssumptions({ randomSeed: Number(e.target.value) })}
                      className="w-full bg-[#101513] border border-[#303B33] rounded px-3 py-2 text-xs text-[#F0F2EC] font-mono"
                    />
                    <span className="text-[10px] text-[#78977E] font-mono mt-1 block">
                      Using the same seed reproduces the exact tick output.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#9AA59C] mb-1">
                      Walking Speed Factor ({assumptions.walkingSpeedMps} m/s)
                    </label>
                    <input
                      type="range"
                      min={0.8}
                      max={1.8}
                      step={0.1}
                      value={assumptions.walkingSpeedMps}
                      onChange={(e) => updateAssumptions({ walkingSpeedMps: Number(e.target.value) })}
                      className="w-full accent-[#64B58A]"
                    />
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  icon={<Sparkles className="w-4 h-4" />}
                  onClick={handleRunSimulation}
                  className="w-full text-xs font-semibold mt-4"
                >
                  Recalculate Model
                </Button>
              </div>
            )}

            {/* Disclaimer Alert */}
            <div className="p-3 border border-[#303B33] bg-[#101513] rounded text-[10px] text-[#9AA59C] leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-[#78977E] shrink-0 mt-0.5" />
              <span>
                <strong>Planning Notice:</strong> Output is a deterministic decision-support estimate based on input assumptions. Real-world event operations require qualified on-site marshals and venue procedures.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

