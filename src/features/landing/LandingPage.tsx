import React from 'react';
import { 
  Shield, 
  Play, 
  ArrowRight, 
  Users, 
  DoorOpen, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  MapPin, 
  Layers, 
  Sparkles,
  GitCompare,
  FileText
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const LandingPage: React.FC = () => {
  const { setCurrentPage } = useAppStore();

  return (
    <div className="min-h-screen bg-[#101513] text-[#F0F2EC] flex flex-col selection:bg-[#64B58A]/30">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-[#303B33] bg-[#151C18]/90 backdrop-blur sticky top-0 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#1B231E] border border-[#303B33] flex items-center justify-center text-[#64B58A]">
            <Shield className="w-4 h-4 text-[#64B58A]" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-sm tracking-wide text-[#F0F2EC] flex items-center gap-1.5">
              EVENTSHIELD
              <span className="text-[10px] font-mono text-[#78977E] px-1 py-0.2 bg-[#1B231E] border border-[#303B33] rounded">v2.4</span>
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-[#9AA59C]">
          <a href="#platform" className="hover:text-[#F0F2EC] transition-colors">Platform</a>
          <a href="#capabilities" className="hover:text-[#F0F2EC] transition-colors">Capabilities</a>
          <a href="#simulation" className="hover:text-[#F0F2EC] transition-colors">Crowd Engine</a>
          <a href="#scenarios" className="hover:text-[#F0F2EC] transition-colors">Scenario Lab</a>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage('overview')}
            className="text-xs font-mono hidden sm:inline-flex"
          >
            Operator Sign In
          </Button>

          <Button
            size="sm"
            variant="primary"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => setCurrentPage('overview')}
            className="text-xs font-semibold"
          >
            Launch Command Center
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-20 max-w-6xl mx-auto flex flex-col items-center text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#151C18] border border-[#303B33] text-xs font-mono text-[#78977E]">
          <span className="w-2 h-2 rounded-full bg-[#64B58A] animate-pulse" />
          <span>INTELLIGENT EVENT OPERATIONS & CROWD SAFETY PLATFORM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight text-[#F0F2EC] max-w-4xl leading-[1.15]">
          Every great event has a plan for what could go wrong.
        </h1>

        <p className="text-base sm:text-lg text-[#9AA59C] max-w-2xl leading-relaxed">
          Simulate crowds. Detect operational risks. Coordinate response teams. Give every event a smarter safety plan.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            onClick={() => setCurrentPage('overview')}
            className="text-sm font-semibold"
          >
            Explore Command Center
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => setCurrentPage('simulation')}
            className="text-sm font-mono"
          >
            Run Crowd Simulation
          </Button>
        </div>

        {/* Hero Interactive Preview Dashboard Graphic */}
        <div className="w-full pt-8">
          <div className="p-3 rounded-md bg-[#151C18] border border-[#303B33] shadow-2xl overflow-hidden text-left font-mono">
            {/* Mock Top Control Strip */}
            <div className="h-10 bg-[#101513] border-b border-[#303B33] px-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#64B58A]" />
                <span className="text-[#F0F2EC] font-bold">NOVA FEST 2026</span>
                <span className="text-[#78977E]">· UNIVERSITY CENTRAL GROUNDS</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#9AA59C]">
                <span>PLANNED: 8,000</span>
                <span className="text-[#64B58A]">GATES: 4/4 OPEN</span>
                <span className="text-[#E5AA52]">ALERT: G01 CONGESTION</span>
              </div>
            </div>

            {/* Mock Top-Down Layout SVG preview */}
            <div className="h-80 sm:h-96 bg-[#101513] relative overflow-hidden flex items-center justify-center p-4">
              <svg className="w-full h-full" viewBox="0 0 800 380">
                {/* Grid */}
                <defs>
                  <pattern id="heroGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#303B33" strokeWidth="0.5" strokeOpacity="0.4" />
                  </pattern>
                </defs>
                <rect width="800" height="380" fill="url(#heroGrid)" />

                {/* Perimeter */}
                <rect x="20" y="20" width="760" height="340" fill="none" stroke="#303B33" strokeDasharray="6 4" strokeWidth="1.5" />

                {/* Main Stage */}
                <rect x="280" y="30" width="240" height="50" fill="#26382E" stroke="#64B58A" strokeWidth="1.5" rx="2" />
                <text x="400" y="60" textAnchor="middle" fill="#F0F2EC" fontSize="11" fontFamily="IBM Plex Mono">MAIN STAGE OMEGA</text>

                {/* Lawn A Zone */}
                <rect x="240" y="90" width="320" height="130" fill="rgba(100, 181, 138, 0.15)" stroke="#64B58A" strokeWidth="1" rx="2" />
                <text x="250" y="110" fill="#F0F2EC" fontSize="10" fontFamily="IBM Plex Mono">MAIN STAGE LAWN (2,890 / 3,400)</text>

                {/* Secondary Stage & Lawn */}
                <rect x="620" y="120" width="130" height="40" fill="#1E2F26" stroke="#80A8C8" strokeWidth="1" rx="2" />
                <text x="685" y="145" textAnchor="middle" fill="#F0F2EC" fontSize="9" fontFamily="IBM Plex Mono">TECH PAVILION</text>

                {/* Ingress Gate */}
                <rect x="30" y="130" width="20" height="60" fill="#1E3628" stroke="#64B58A" strokeWidth="1.5" />
                <text x="60" y="165" fill="#64B58A" fontSize="9" fontFamily="IBM Plex Mono">GATE G01 (INGRESS)</text>

                {/* Food Court */}
                <rect x="600" y="210" width="150" height="80" fill="#253427" stroke="#303B33" strokeWidth="1" rx="2" />
                <text x="610" y="230" fill="#F0F2EC" fontSize="9" fontFamily="IBM Plex Mono">EAST FOOD COURT</text>

                {/* Medical Station */}
                <rect x="280" y="280" width="80" height="50" fill="#1A382C" stroke="#64B58A" strokeWidth="1" rx="2" />
                <text x="320" y="310" textAnchor="middle" fill="#64B58A" fontSize="9" fontFamily="IBM Plex Mono">EMT ALPHA</text>

                {/* Exits */}
                <rect x="380" y="350" width="60" height="18" fill="#1B3128" stroke="#64B58A" strokeWidth="1" />
                <text x="410" y="362" textAnchor="middle" fill="#64B58A" fontSize="8" fontFamily="IBM Plex Mono">EXIT E03</text>

                {/* Agent markers */}
                {[
                  [300, 130], [330, 150], [380, 120], [420, 160], [450, 140],
                  [480, 170], [320, 180], [360, 190], [400, 150], [440, 190],
                  [650, 240], [670, 260], [700, 250], [120, 150], [150, 170]
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill="#64B58A" fillOpacity="0.8" />
                ))}
              </svg>

              {/* Floating CTA pill */}
              <div className="absolute bottom-4 right-4 z-10">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setCurrentPage('venue')}
                  className="text-xs font-semibold shadow-lg"
                >
                  Open Interactive Venue Designer →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 1: The Challenge & The Platform */}
      <section id="platform" className="py-16 px-6 border-t border-[#303B33] bg-[#151C18]/40">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#78977E]">THE OPERATIONAL CHALLENGE</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F0F2EC]">
              Event complexity escalates non-linearly as crowds gather.
            </h2>
            <p className="text-sm text-[#9AA59C] leading-relaxed">
              University festivals, concerts, and public gatherings face high ingress surges, unexpected exit blockages, and medical emergencies. Conventional spreadsheets fail to model spatial dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded bg-[#1B231E] border border-[#303B33] space-y-3">
              <div className="w-9 h-9 rounded bg-[#101513] border border-[#303B33] flex items-center justify-center text-[#64B58A]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F0F2EC]">Unified Spatial Map</h3>
              <p className="text-xs text-[#9AA59C] leading-relaxed">
                Connect gates, mojo barricades, first-aid tents, and stages into a single vector-accurate digital twin.
              </p>
            </div>

            <div className="p-5 rounded bg-[#1B231E] border border-[#303B33] space-y-3">
              <div className="w-9 h-9 rounded bg-[#101513] border border-[#303B33] flex items-center justify-center text-[#80A8C8]">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F0F2EC]">Deterministic Crowd Engine</h3>
              <p className="text-xs text-[#9AA59C] leading-relaxed">
                Simulate arrival waves, gate queues, walking speeds, and zone capacity exceedances with fixed seed reproducibility.
              </p>
            </div>

            <div className="p-5 rounded bg-[#1B231E] border border-[#303B33] space-y-3">
              <div className="w-9 h-9 rounded bg-[#101513] border border-[#303B33] flex items-center justify-center text-[#E5AA52]">
                <GitCompare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F0F2EC]">Scenario Testing Lab</h3>
              <p className="text-xs text-[#9AA59C] leading-relaxed">
                Stress-test egress when an exit is blocked, a gate scanner fails, or severe weather hits. Compare Plan A vs Plan B.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Coordination & Readiness */}
      <section id="capabilities" className="py-16 px-6 border-t border-[#303B33]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-[10px] font-mono uppercase text-[#78977E]">FIELD COORDINATION</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#F0F2EC]">
              Align marshals, EMTs, and emergency playbooks before opening the gates.
            </h2>
            <p className="text-xs text-[#9AA59C] leading-relaxed">
              EventShield enforces strict operational readiness gates. Events cannot be signed off until critical safety items—fire extinguisher certifications, medical staffing ratios, and exit route clearances—are verified by authorized personnel.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setCurrentPage('readiness')}
                className="text-xs font-mono"
              >
                Inspect Safety Checklist →
              </Button>
            </div>
          </div>

          <div className="p-5 rounded bg-[#151C18] border border-[#303B33] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#303B33]">
              <span className="text-[#64B58A] font-bold">PRE-EVENT READINESS AUDIT</span>
              <Badge variant="green">95% COMPLETE</Badge>
            </div>
            <div className="space-y-2 text-[#9AA59C]">
              <div className="flex items-center gap-2 text-[#F0F2EC]">
                <CheckCircle2 className="w-4 h-4 text-[#64B58A]" />
                <span>Venue layout CAD calibrated & gates verified</span>
              </div>
              <div className="flex items-center gap-2 text-[#F0F2EC]">
                <CheckCircle2 className="w-4 h-4 text-[#64B58A]" />
                <span>Deterministic simulation run (Seed #42 validated)</span>
              </div>
              <div className="flex items-center gap-2 text-[#F0F2EC]">
                <CheckCircle2 className="w-4 h-4 text-[#64B58A]" />
                <span>18 security officers positioned at Mojo pit & perimeters</span>
              </div>
              <div className="flex items-center gap-2 text-[#F0F2EC]">
                <CheckCircle2 className="w-4 h-4 text-[#64B58A]" />
                <span>Heat distress & evacuation playbooks approved by CMO</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#303B33] bg-[#151C18] py-8 px-6 text-center text-xs font-mono text-[#9AA59C] space-y-3">
        <div className="text-sm font-bold text-[#F0F2EC] font-sans">
          "Don't just organize an event. Understand everything happening around it."
        </div>
        <div>
          EVENTSHIELD PLATFORM · INTELLIGENT EVENT OPERATIONS & CROWD COMMAND CORE
        </div>
      </footer>
    </div>
  );
};

