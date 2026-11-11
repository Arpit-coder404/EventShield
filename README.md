# EventShield
### Intelligent Event Operations, Crowd Simulation & Safety Command Platform
**"Plan for the unexpected. Stay ahead of the crowd."**

EventShield is an event operations command center and decision-support platform designed for university festivals, concerts, conferences, exhibitions, sports events, cultural celebrations, and large public gatherings.

---

## 🛡️ Core Capabilities

1. **Interactive Vector Venue Designer**
   - Top-down architectural SVG canvas with precision grid (10px snap)
   - Add, position, resize, and configure stages, crowd zones, ingress gates, emergency exits, medical posts, food courts, barriers, and assembly points
   - Real-time property inspector for capacity limits, flow rates, operating states, and access credentials
   - Multi-layer visibility toggles (structure, zones, gates, exits, medical/security, barriers, staff markers, density heatmap, grid)

2. **Deterministic Crowd Simulation Engine**
   - Minute-by-minute simulation across configurable event durations (180+ minutes)
   - Configurable arrival distribution profiles: *Gradual Normal Curve*, *Steep Ingress Peak*, *Dual Surge*, or *Flat Continuous*
   - Dynamic gate queue accumulation based on hourly throughput vs arrival volume
   - Zone attraction weighting driven by live stage performance schedules
   - Bottleneck detection and zone capacity exceedance metrics
   - Fixed random seed option for 100% reproducible scenario testing
   - Animated visual crowd agent markers and density heatmaps

3. **Scenario Stress-Testing Lab (Signature Differentiator)**
   - Preconfigured operational failure scenarios:
     - East Egress Constriction (Exit E02 Closed)
     - North Gate Turnstile Hardware Failure
     - Surprise Guest Stage Rush
     - Multiple Heat Exhaustion Incidents in Crowd Core
     - Substation Power Interruption
     - High Wind & Precipitation Warning
     - Unauthorized Gate Surge (+30% Walk-up Influx)
     - VHF Operations Repeater Malfunction
   - Direct dual-plan comparative modeling (**Plan A vs Plan B**) with calculated delta metrics (queue surge, wait time delta, critical zones added, egress delay)

4. **Live Operations Center (Mission Mode)**
   - Full-screen tactical command workspace
   - Live mission timer clocking elapsed event duration
   - Dynamic incident triage queue with immediate status updates
   - Ingress gate control (toggle open/restricted/closed)
   - Real-time zone density monitoring and field responder roster

5. **Operational Infrastructure & Readiness**
   - **Gates & Zones Management**: Capacity, hourly throughput, and measured vs simulated occupancy calibration
   - **Staff & Resource Coordination**: Deployment matrix, shift scheduling, and emergency asset inventory (AEDs, trauma kits, VHF radios, barricades)
   - **Incident Response & Triage**: Severity-coded reports, responder assignment, and live chronological notes
   - **Emergency Playbooks**: Approved SOPs for heat distress, crowd surges, severe weather, and full venue evacuation
   - **Transparent Risk Register**: Explainable 5×5 Likelihood × Impact scoring matrix with ground-truth physical evidence
   - **Event Safety Readiness Audit**: 19-point verification checklist across Venue, Crowd Planning, Personnel, Resources, and Response
   - **Post-Event Operational Reports**: Planned vs measured telemetry audit, incident logs, lessons learned, and 1-click CSV & print export

---

## 🎨 Visual Identity & Design Principles

Designed after Formula 1 race control, airport operations rooms, and precision aerospace monitoring systems:
- **Palette**: Sophisticated dark operational canvas (`#101513`), tactical surfaces (`#1B231E`, `#202A24`), subtle borders (`#303B33`)
- **Semantic Accents**: Operational Green (`#64B58A`), Warning Amber (`#E5AA52`), Critical Red (`#E36B62`), Information Blue (`#80A8C8`)
- **Typography**: Manrope for bold headings, Inter for high-density UI, and IBM Plex Mono for technical coordinates, timestamps, and sensor telemetry
- **Clean Execution**: Zero decorative gradients, no neon borders, and zero generic SaaS template clichés

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd EventShield

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 🎪 Complete Demonstration Journey (NOVA FEST 2026)

1. **Launch**: Open the platform to explore the product landing page or enter the Command Center directly.
2. **Context**: Notice pre-seeded **NOVA FEST 2026** (8,000 expected attendance at University Central Grounds).
3. **Venue Designer**: Click **Venue Designer** in navigation. Drag elements, resize stages, adjust Gate G01 throughput, or add a new crowd zone. Click **Save Layout**.
4. **Crowd Simulation**: Switch to **Crowd Simulation**. Select *Steep Peak* or *Dual Surge* arrival, adjust attendee count, and press **PLAY** to watch gate queues build and density shift toward Main Stage Lawn A during the headliner performance.
5. **Scenario Lab**: Open **Scenario Lab**. Compare **Plan A (Baseline)** against **Plan B (East Egress Constriction)**. Notice the calculated delta metrics: queue surge and added bottlenecks.
6. **Live Operations**: Click **Live Ops Mode** in the header to enter full-screen mission control. Toggle Gate G01 status, resolve an active incident, and monitor on-duty responders.
7. **Readiness Audit**: Navigate to **Event Readiness**, verify checklist criteria, and sign off the safety audit.
8. **Operational Report**: Open **Reports & Insights** to inspect the comprehensive post-event dossier and click **Export CSV** or **Print Dossier**.

---

*Notice: EventShield is a planning and decision-support tool. Real-world event safety and emergency response procedures must remain under the authority of qualified safety directors and local emergency services.*

