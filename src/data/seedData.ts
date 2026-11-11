import { 
  EventItem, 
  Venue, 
  StaffMember, 
  ResourceItem, 
  Incident, 
  EmergencyPlaybook, 
  ReadinessItem, 
  SimulationAssumptions,
  NotificationItem,
  ActivityLogItem
} from '../types';

export const SEED_EVENT: EventItem = {
  id: 'ev_nova_2026',
  name: 'NOVA FEST 2026',
  tagline: 'Annual University Technology, Arts & Cultural Festival',
  description: 'Flagship multiday university celebration featuring live musical performances, interactive exhibitions, guest speakers, student showcases, and food pavilion.',
  category: 'University Festival',
  organizer: 'University Student Union & Campus Operations Directorate',
  venueName: 'University Central Grounds',
  venueId: 'ven_central_grounds',
  date: '2026-11-20',
  startTime: '14:00',
  endTime: '22:30',
  expectedAttendance: 8000,
  maxPlannedAttendance: 10000,
  currentMeasuredAttendance: 6840,
  numStages: 2,
  eventType: 'Outdoor Campus',
  emergencyContact: {
    name: 'Captain Marcus Vance',
    phone: '+1 (555) 019-4822',
    role: 'Lead Campus Safety & Security Director',
    channel: 'VHF Tactical Channel 4 / PTT Alpha'
  },
  operationalTeam: [
    'Elena Rostova (Incident Commander)',
    'Marcus Vance (Safety Director)',
    'Dr. Aris Thorne (Chief Medical Officer)',
    'Kavita Patel (Crowd Logistics Lead)',
    'Devon Miller (Facilities & Power Lead)'
  ],
  status: 'planning',
  createdAt: '2026-11-01T08:00:00Z',
  updatedAt: '2026-11-12T01:30:00Z'
};

export const SEED_VENUE: Venue = {
  id: 'ven_central_grounds',
  eventId: 'ev_nova_2026',
  name: 'University Central Grounds - Operational Layout',
  width: 1000,
  height: 700,
  gridUnit: 20,
  updatedAt: '2026-11-12T01:45:00Z',
  elements: [
    // --- STAGES ---
    {
      id: 'stage_main',
      name: 'Main Stage (Omega Amphitheater)',
      type: 'stage',
      x: 360,
      y: 60,
      width: 280,
      height: 90,
      capacity: 3500,
      color: '#64B58A',
      accessRestrictions: 'Artist & Production Access Only',
      operatingStatus: 'ready'
    },
    {
      id: 'stage_secondary',
      name: 'Acoustic & Tech Pavilion Stage',
      type: 'stage',
      x: 760,
      y: 280,
      width: 170,
      height: 70,
      capacity: 1200,
      color: '#80A8C8',
      accessRestrictions: 'Performer Credential Required',
      operatingStatus: 'ready'
    },

    // --- CROWD ZONES ---
    {
      id: 'zone_lawn_a',
      name: 'Main Stage Lawn A',
      type: 'zone',
      x: 310,
      y: 170,
      width: 380,
      height: 210,
      capacity: 3400,
      expectedAttendance: 3100,
      currentSimulatedOccupancy: 2890,
      currentMeasuredOccupancy: 2750,
      densityThreshold: 2.2,
      areaSquareMeters: 2100,
      operatingStatus: 'open',
      color: '#26342B',
      assignedStaff: ['stf_sec_01', 'stf_sec_02', 'stf_vol_01']
    },
    {
      id: 'zone_lawn_b',
      name: 'Secondary Lawn B (Meadow Greens)',
      type: 'zone',
      x: 720,
      y: 370,
      width: 230,
      height: 180,
      capacity: 1400,
      expectedAttendance: 1100,
      currentSimulatedOccupancy: 980,
      currentMeasuredOccupancy: 920,
      densityThreshold: 1.8,
      areaSquareMeters: 1100,
      operatingStatus: 'open',
      color: '#222F26'
    },
    {
      id: 'zone_quad_hub',
      name: 'Central Quad Transit Hub',
      type: 'zone',
      x: 350,
      y: 410,
      width: 300,
      height: 140,
      capacity: 1600,
      expectedAttendance: 1200,
      currentSimulatedOccupancy: 1140,
      currentMeasuredOccupancy: 1050,
      densityThreshold: 1.5,
      areaSquareMeters: 1400,
      operatingStatus: 'open',
      color: '#1E2922'
    },
    {
      id: 'zone_entry_plaza',
      name: 'North Ingress Plaza',
      type: 'zone',
      x: 80,
      y: 200,
      width: 180,
      height: 250,
      capacity: 1500,
      expectedAttendance: 1400,
      currentSimulatedOccupancy: 1320,
      currentMeasuredOccupancy: 1280,
      densityThreshold: 2.0,
      areaSquareMeters: 1200,
      operatingStatus: 'open',
      color: '#233027'
    },
    {
      id: 'zone_expo_terrace',
      name: 'Student Showcase & Tech Terrace',
      type: 'zone',
      x: 80,
      y: 480,
      width: 220,
      height: 140,
      capacity: 900,
      expectedAttendance: 650,
      currentSimulatedOccupancy: 580,
      currentMeasuredOccupancy: 540,
      densityThreshold: 1.4,
      areaSquareMeters: 800,
      operatingStatus: 'open',
      color: '#1E2822'
    },
    {
      id: 'zone_vip_terrace',
      name: 'Faculty & VIP Overlook Deck',
      type: 'zone',
      x: 230,
      y: 90,
      width: 100,
      height: 60,
      capacity: 250,
      expectedAttendance: 180,
      currentSimulatedOccupancy: 140,
      currentMeasuredOccupancy: 130,
      accessRestrictions: 'Tier 1 VIP Badge',
      operatingStatus: 'open',
      color: '#2E3D31'
    },

    // --- FOOD COURTS ---
    {
      id: 'zone_food_east',
      name: 'East Food Court & Refreshments',
      type: 'food_court',
      x: 720,
      y: 130,
      width: 210,
      height: 120,
      capacity: 850,
      expectedAttendance: 700,
      currentSimulatedOccupancy: 610,
      operatingStatus: 'open',
      color: '#2B3929'
    },
    {
      id: 'zone_food_west',
      name: 'West Food Truck Alley',
      type: 'food_court',
      x: 80,
      y: 70,
      width: 120,
      height: 100,
      capacity: 450,
      expectedAttendance: 350,
      currentSimulatedOccupancy: 280,
      operatingStatus: 'open',
      color: '#2B3929'
    },

    // --- GATES ---
    {
      id: 'gate_g01',
      name: 'Gate G01 (North Main Ingress)',
      type: 'gate',
      x: 40,
      y: 220,
      width: 30,
      height: 80,
      throughputPerHour: 1800,
      operatingStatus: 'open',
      assignedStaff: ['stf_gate_01', 'stf_gate_02'],
      connectedZoneId: 'zone_entry_plaza'
    },
    {
      id: 'gate_g02',
      name: 'Gate G02 (North-East Student Gate)',
      type: 'gate',
      x: 40,
      y: 330,
      width: 30,
      height: 70,
      throughputPerHour: 1400,
      operatingStatus: 'open',
      assignedStaff: ['stf_gate_03'],
      connectedZoneId: 'zone_entry_plaza'
    },
    {
      id: 'gate_g03',
      name: 'Gate G03 (South Campus Boulevard Gate)',
      type: 'gate',
      x: 450,
      y: 650,
      width: 90,
      height: 30,
      throughputPerHour: 1600,
      operatingStatus: 'open',
      assignedStaff: ['stf_gate_04'],
      connectedZoneId: 'zone_quad_hub'
    },
    {
      id: 'gate_g04',
      name: 'Gate G04 (West Library Avenue Gate)',
      type: 'gate',
      x: 40,
      y: 520,
      width: 30,
      height: 60,
      throughputPerHour: 1100,
      operatingStatus: 'open',
      assignedStaff: ['stf_gate_05'],
      connectedZoneId: 'zone_expo_terrace'
    },

    // --- EXITS ---
    {
      id: 'exit_e01',
      name: 'Exit E01 (North Perimeter Egress)',
      type: 'exit',
      x: 460,
      y: 20,
      width: 80,
      height: 25,
      throughputPerHour: 2200,
      operatingStatus: 'open',
      isEmergencyExit: true
    },
    {
      id: 'exit_e02',
      name: 'Exit E02 (East Avenue Egress)',
      type: 'exit',
      x: 955,
      y: 220,
      width: 25,
      height: 80,
      throughputPerHour: 1800,
      operatingStatus: 'open',
      isEmergencyExit: true
    },
    {
      id: 'exit_e03',
      name: 'Exit E03 (South Boulevard Egress)',
      type: 'exit',
      x: 580,
      y: 650,
      width: 90,
      height: 30,
      throughputPerHour: 2000,
      operatingStatus: 'open',
      isEmergencyExit: true
    },
    {
      id: 'exit_e04',
      name: 'Exit E04 (West Emergency Evacuation Lane)',
      type: 'exit',
      x: 40,
      y: 430,
      width: 30,
      height: 40,
      throughputPerHour: 1500,
      operatingStatus: 'open',
      isEmergencyExit: true
    },

    // --- MEDICAL STATIONS ---
    {
      id: 'med_m01',
      name: 'Alpha Medical Command Tent (Level 1 EMT)',
      type: 'medical',
      x: 320,
      y: 570,
      width: 90,
      height: 60,
      capacity: 35,
      operatingStatus: 'ready',
      color: '#64B58A',
      assignedStaff: ['stf_med_01', 'stf_med_02']
    },
    {
      id: 'med_m02',
      name: 'Bravo First-Aid Rapid Post',
      type: 'medical',
      x: 720,
      y: 60,
      width: 70,
      height: 50,
      capacity: 15,
      operatingStatus: 'ready',
      color: '#64B58A',
      assignedStaff: ['stf_med_03']
    },

    // --- SECURITY CHECKPOINTS ---
    {
      id: 'sec_s01',
      name: 'Security Checkpoint Alpha (Bag Screening)',
      type: 'security',
      x: 100,
      y: 310,
      width: 50,
      height: 40,
      operatingStatus: 'open',
      assignedStaff: ['stf_sec_03']
    },
    {
      id: 'sec_s02',
      name: 'Stage Front Mojo Pit Security',
      type: 'security',
      x: 440,
      y: 155,
      width: 120,
      height: 20,
      operatingStatus: 'open',
      assignedStaff: ['stf_sec_04']
    },
    {
      id: 'sec_s03',
      name: 'South Gate Screening Station',
      type: 'security',
      x: 470,
      y: 605,
      width: 50,
      height: 35,
      operatingStatus: 'open',
      assignedStaff: ['stf_sec_05']
    },

    // --- RESTROOMS ---
    {
      id: 'rest_r01',
      name: 'Sanitation Hub North (24 Stalls + ADA)',
      type: 'restroom',
      x: 720,
      y: 570,
      width: 80,
      height: 50,
      capacity: 60,
      operatingStatus: 'open'
    },
    {
      id: 'rest_r02',
      name: 'Sanitation Hub West (16 Stalls + ADA)',
      type: 'restroom',
      x: 180,
      y: 640,
      width: 70,
      height: 40,
      capacity: 40,
      operatingStatus: 'open'
    },

    // --- RESTRICTED AREAS ---
    {
      id: 'rest_backstage',
      name: 'Backstage Technical Compound & Green Room',
      type: 'restricted',
      x: 370,
      y: 10,
      width: 260,
      height: 45,
      capacity: 100,
      accessRestrictions: 'Artist, Production, Event Leadership Only',
      operatingStatus: 'restricted',
      color: '#E5AA52'
    },

    // --- EMERGENCY ASSEMBLY POINTS ---
    {
      id: 'assembly_a',
      name: 'Primary Assembly Field Alpha (North Lawn)',
      type: 'assembly',
      x: 400,
      y: 670,
      width: 40,
      height: 25,
      capacity: 4500,
      operatingStatus: 'ready'
    },
    {
      id: 'assembly_b',
      name: 'Secondary Assembly Track Bravo (East Oval)',
      type: 'assembly',
      x: 960,
      y: 420,
      width: 25,
      height: 60,
      capacity: 3500,
      operatingStatus: 'ready'
    },

    // --- BARRIERS / CROWD CONTROL LINES ---
    {
      id: 'barr_b01',
      name: 'Stage Perimeter Mojo Barricade',
      type: 'barrier',
      x: 350,
      y: 160,
      width: 300,
      height: 10,
      operatingStatus: 'closed'
    },
    {
      id: 'barr_b02',
      name: 'Quad Ingress Channel Divider',
      type: 'barrier',
      x: 270,
      y: 300,
      width: 10,
      height: 180,
      operatingStatus: 'closed'
    }
  ]
};

export const SEED_STAFF: StaffMember[] = [
  {
    id: 'stf_mgr_01',
    name: 'Elena Rostova',
    role: 'event_manager',
    team: 'Incident Command',
    contact: '+1 555-019-1100',
    assignedZoneId: 'zone_vip_terrace',
    shift: '12:00 - 23:30',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'ER'
  },
  {
    id: 'stf_ops_01',
    name: 'Kavita Patel',
    role: 'ops_coordinator',
    team: 'Operations Hub',
    contact: '+1 555-019-1101',
    assignedZoneId: 'zone_quad_hub',
    shift: '13:00 - 23:00',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'KP'
  },
  {
    id: 'stf_sec_01',
    name: 'Marcus Vance',
    role: 'security',
    team: 'Perimeter Security',
    contact: '+1 555-019-4822',
    assignedZoneId: 'zone_lawn_a',
    shift: '13:00 - 23:00',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'MV'
  },
  {
    id: 'stf_sec_02',
    name: 'Tariq Al-Mansoor',
    role: 'security',
    team: 'Pit & Mojo Response',
    contact: '+1 555-019-2244',
    assignedZoneId: 'zone_lawn_a',
    shift: '14:00 - 22:30',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'TM'
  },
  {
    id: 'stf_sec_03',
    name: 'Sarah Jenkins',
    role: 'security',
    team: 'North Screening Alpha',
    contact: '+1 555-019-3321',
    assignedZoneId: 'sec_s01',
    shift: '13:00 - 21:00',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'SJ'
  },
  {
    id: 'stf_sec_04',
    name: 'David O\'Connor',
    role: 'security',
    team: 'Pit & Mojo Response',
    contact: '+1 555-019-4412',
    assignedZoneId: 'sec_s02',
    shift: '14:00 - 23:00',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'DO'
  },
  {
    id: 'stf_sec_05',
    name: 'Lucas Sterling',
    role: 'security',
    team: 'South Gate Security',
    contact: '+1 555-019-5561',
    assignedZoneId: 'sec_s03',
    shift: '13:30 - 22:30',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'LS'
  },
  {
    id: 'stf_gate_01',
    name: 'Maya Lin',
    role: 'gate_staff',
    team: 'Ticketing & Ingress',
    contact: '+1 555-019-6120',
    assignedZoneId: 'gate_g01',
    shift: '13:00 - 19:30',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'ML'
  },
  {
    id: 'stf_gate_02',
    name: 'Jordan Bell',
    role: 'gate_staff',
    team: 'Ticketing & Ingress',
    contact: '+1 555-019-6121',
    assignedZoneId: 'gate_g01',
    shift: '13:00 - 19:30',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'JB'
  },
  {
    id: 'stf_gate_03',
    name: 'Samira Khan',
    role: 'gate_staff',
    team: 'Ticketing & Ingress',
    contact: '+1 555-019-6122',
    assignedZoneId: 'gate_g02',
    shift: '13:30 - 20:00',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'SK'
  },
  {
    id: 'stf_gate_04',
    name: 'Carlos Ruiz',
    role: 'gate_staff',
    team: 'Ticketing & Ingress',
    contact: '+1 555-019-6123',
    assignedZoneId: 'gate_g03',
    shift: '13:30 - 20:30',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'CR'
  },
  {
    id: 'stf_gate_05',
    name: 'Chloe Bennett',
    role: 'gate_staff',
    team: 'Ticketing & Ingress',
    contact: '+1 555-019-6124',
    assignedZoneId: 'gate_g04',
    shift: '14:00 - 20:00',
    status: 'standby',
    isConfirmed: true,
    avatarInitials: 'CB'
  },
  {
    id: 'stf_med_01',
    name: 'Dr. Aris Thorne',
    role: 'medical',
    team: 'EMS Alpha Unit',
    contact: '+1 555-019-8800',
    assignedZoneId: 'med_m01',
    shift: '13:00 - 23:30',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'AT'
  },
  {
    id: 'stf_med_02',
    name: 'Paramedic Jenna Wu',
    role: 'medical',
    team: 'EMS Alpha Unit',
    contact: '+1 555-019-8801',
    assignedZoneId: 'med_m01',
    shift: '13:00 - 23:00',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'JW'
  },
  {
    id: 'stf_med_03',
    name: 'Nurse Brad Foster',
    role: 'medical',
    team: 'EMS Bravo Unit',
    contact: '+1 555-019-8802',
    assignedZoneId: 'med_m02',
    shift: '14:00 - 22:30',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'BF'
  },
  {
    id: 'stf_tech_01',
    name: 'Devon Miller',
    role: 'tech',
    team: 'Campus Utilities & Power',
    contact: '+1 555-019-9911',
    assignedZoneId: 'stage_main',
    shift: '12:00 - 23:00',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'DM'
  },
  {
    id: 'stf_vol_01',
    name: 'Liam Zhang',
    role: 'volunteer',
    team: 'Student Guides Squad',
    contact: '+1 555-019-7710',
    assignedZoneId: 'zone_entry_plaza',
    shift: '13:30 - 18:30',
    status: 'on_duty',
    isConfirmed: true,
    avatarInitials: 'LZ'
  },
  {
    id: 'stf_vol_02',
    name: 'Zoe Morales',
    role: 'volunteer',
    team: 'Hydration & Accessibility',
    contact: '+1 555-019-7711',
    assignedZoneId: 'zone_lawn_b',
    shift: '14:00 - 19:00',
    status: 'on_duty',
    isConfirmed: false,
    avatarInitials: 'ZM'
  }
];

export const SEED_RESOURCES: ResourceItem[] = [
  {
    id: 'res_01',
    name: 'Automated External Defibrillator (AED) Units',
    category: 'Safety & First Aid',
    totalQuantity: 6,
    availableQuantity: 4,
    allocatedQuantity: 2,
    locationZoneId: 'med_m01',
    responsibleTeam: 'EMS Alpha Unit',
    inspectionStatus: 'passed',
    unit: 'devices',
    lastChecked: '2026-11-11 11:30'
  },
  {
    id: 'res_02',
    name: 'Heavy Duty Trauma First-Aid Backpacks',
    category: 'Safety & First Aid',
    totalQuantity: 12,
    availableQuantity: 8,
    allocatedQuantity: 4,
    locationZoneId: 'med_m01',
    responsibleTeam: 'EMS Alpha Unit',
    inspectionStatus: 'passed',
    unit: 'kits',
    lastChecked: '2026-11-11 11:30'
  },
  {
    id: 'res_03',
    name: 'Tactical Multi-Channel VHF Handheld Radios',
    category: 'Communications',
    totalQuantity: 36,
    availableQuantity: 4,
    allocatedQuantity: 32,
    locationZoneId: 'zone_quad_hub',
    responsibleTeam: 'Operations Hub',
    inspectionStatus: 'passed',
    unit: 'radios',
    lastChecked: '2026-11-11 14:00'
  },
  {
    id: 'res_04',
    name: 'Galvanized Steel Mojo Crowd Barricade Sections',
    category: 'Perimeter & Crowd',
    totalQuantity: 180,
    availableQuantity: 20,
    allocatedQuantity: 160,
    locationZoneId: 'zone_lawn_a',
    responsibleTeam: 'Facilities & Logistics',
    inspectionStatus: 'passed',
    unit: 'meters',
    lastChecked: '2026-11-10 16:00'
  },
  {
    id: 'res_05',
    name: 'Dry Chemical ABC Fire Extinguishers (10kg)',
    category: 'Fire Safety',
    totalQuantity: 24,
    availableQuantity: 6,
    allocatedQuantity: 18,
    locationZoneId: 'zone_food_east',
    responsibleTeam: 'Safety Operations',
    inspectionStatus: 'passed',
    unit: 'canisters',
    lastChecked: '2026-11-10 10:00'
  },
  {
    id: 'res_06',
    name: 'Collapsible Emergency Medical Wheelchairs',
    category: 'Mobility',
    totalQuantity: 8,
    availableQuantity: 3,
    allocatedQuantity: 5,
    locationZoneId: 'med_m01',
    responsibleTeam: 'Accessibility Team',
    inspectionStatus: 'passed',
    unit: 'chairs',
    lastChecked: '2026-11-11 09:30'
  },
  {
    id: 'res_07',
    name: 'High-Output LED Mobile Lighting Towers',
    category: 'Power & Utilities',
    totalQuantity: 8,
    availableQuantity: 1,
    allocatedQuantity: 7,
    locationZoneId: 'zone_entry_plaza',
    responsibleTeam: 'Campus Facilities',
    inspectionStatus: 'attention',
    unit: 'towers',
    lastChecked: '2026-11-11 17:00'
  },
  {
    id: 'res_08',
    name: 'Potable Free Water Hydration Refill Stations',
    category: 'Safety & First Aid',
    totalQuantity: 6,
    availableQuantity: 0,
    allocatedQuantity: 6,
    locationZoneId: 'zone_lawn_b',
    responsibleTeam: 'Facilities Logistics',
    inspectionStatus: 'passed',
    unit: 'stations',
    lastChecked: '2026-11-11 15:00'
  }
];

export const SEED_INCIDENTS: Incident[] = [
  {
    id: 'inc_2026_01',
    eventId: 'ev_nova_2026',
    category: 'crowd_congestion',
    severity: 'moderate',
    zoneId: 'zone_entry_plaza',
    description: 'High student queue build-up at Gate G01 turnstiles. Waiting time estimated at ~14 minutes.',
    reportedBy: 'Maya Lin (Gate Staff)',
    reportedAt: '2026-11-12T01:10:00Z',
    assignedTeam: 'Ticketing & Ingress',
    status: 'in_progress',
    notes: [
      {
        id: 'n1',
        text: 'Badge scanner QR codes timing out intermittently on University campus Wi-Fi.',
        timestamp: '2026-11-12T01:12:00Z',
        author: 'Maya Lin'
      },
      {
        id: 'n2',
        text: 'Dispatched 2 volunteers to switch to offline batch validation scanners.',
        timestamp: '2026-11-12T01:18:00Z',
        author: 'Elena Rostova'
      }
    ],
    mapCoordinates: { x: 75, y: 240 }
  },
  {
    id: 'inc_2026_02',
    eventId: 'ev_nova_2026',
    category: 'medical',
    severity: 'high',
    zoneId: 'zone_lawn_a',
    description: 'Dehydration and syncope reported in dense crowd sector near Main Stage Mojo barricade.',
    reportedBy: 'Tariq Al-Mansoor (Security)',
    reportedAt: '2026-11-12T01:25:00Z',
    assignedTeam: 'EMS Alpha Unit',
    status: 'in_progress',
    notes: [
      {
        id: 'n3',
        text: 'Patient conscious, seated with medic team. Intravenous fluids administered. Sterile perimeter maintained.',
        timestamp: '2026-11-12T01:29:00Z',
        author: 'Dr. Aris Thorne'
      }
    ],
    mapCoordinates: { x: 480, y: 210 }
  },
  {
    id: 'inc_2026_03',
    eventId: 'ev_nova_2026',
    category: 'infrastructure',
    severity: 'low',
    zoneId: 'zone_food_east',
    description: 'Minor grease overflow near concession stall 4. Slip hazard identified.',
    reportedBy: 'Kavita Patel (Operations Hub)',
    reportedAt: '2026-11-12T00:45:00Z',
    assignedTeam: 'Facilities & Logistics',
    status: 'resolved',
    resolvedAt: '2026-11-12T01:05:00Z',
    resolutionSummary: 'Eco-absorbent compound applied and non-skid rubber mats installed. Area cleared.',
    notes: [
      {
        id: 'n4',
        text: 'Facilities cleanup complete. Safety inspection signed off.',
        timestamp: '2026-11-12T01:05:00Z',
        author: 'Devon Miller'
      }
    ],
    mapCoordinates: { x: 800, y: 170 }
  }
];

export const SEED_EMERGENCY_PLAYBOOKS: EmergencyPlaybook[] = [
  {
    id: 'pb_med_01',
    eventId: 'ev_nova_2026',
    title: 'Mass Dehydration / Heat Distress Protocol',
    category: 'medical',
    triggerCondition: 'Ambient wet-bulb globe temp > 28°C OR > 5 heat collapse incidents within 20 mins.',
    responsibleRole: 'Lead Medical Officer & Logistics',
    commProcedure: 'Radio VHF Channel 2 ("EMS Direct"). Do not announce distress over public PA to prevent stampede.',
    approvedSteps: [
      'Dispatch roving 2-person medic pairs with electrolytes to Lawn A and Secondary Stage.',
      'Deploy auxiliary water misting stations at Quad Transit Hub.',
      'Open North First-Aid Post for low-acuity cooling triage.',
      'Request standby university transit shuttles for patient transport if required.'
    ],
    requiredResources: ['Automated External Defibrillator (AED)', 'Trauma First-Aid Backpacks', 'Water Refill Stations'],
    assemblyPoint: 'Alpha Medical Command Tent (Level 1 EMT)',
    escalationContacts: [
      { role: 'Chief Medical Officer', name: 'Dr. Aris Thorne', contact: '+1 555-019-8800' },
      { role: 'Campus EMS Liaison', name: 'Lt. Gary Simmons', contact: '+1 555-019-8899' }
    ],
    reviewDate: '2026-11-10',
    approvalStatus: 'approved',
    approvedBy: 'Dr. Aris Thorne'
  },
  {
    id: 'pb_crowd_01',
    eventId: 'ev_nova_2026',
    title: 'Surge Ingress & Gate Bottleneck Protocol',
    category: 'crowd_congestion',
    triggerCondition: 'Gate queue exceeds 400 attendees OR wait time > 18 mins OR physical surge against turnstiles.',
    responsibleRole: 'Ingress Operations Lead & Security Commander',
    commProcedure: 'Broadcast tactical alert to Ingress and Security channels.',
    approvedSteps: [
      'Transition ticket scanners to rapid wristband-only mode.',
      'Open auxiliary bypass lanes G01-B and G02-B.',
      'Station 4 security marshals 25 meters upstream to meter queue in 50-person pulses.',
      'Display holding instructions on North Plaza LED signage.'
    ],
    requiredResources: ['Galvanized Steel Mojo Crowd Barricade', 'Handheld Radios'],
    assemblyPoint: 'North Ingress Plaza Command Post',
    escalationContacts: [
      { role: 'Safety Director', name: 'Marcus Vance', contact: '+1 555-019-4822' },
      { role: 'Incident Commander', name: 'Elena Rostova', contact: '+1 555-019-1100' }
    ],
    reviewDate: '2026-11-09',
    approvalStatus: 'approved',
    approvedBy: 'Marcus Vance'
  },
  {
    id: 'pb_weather_01',
    eventId: 'ev_nova_2026',
    title: 'Severe Weather / High Wind Stand-Down Procedure',
    category: 'weather',
    triggerCondition: 'Sustained winds > 65 km/h OR lightning strike detected within 8 km radius.',
    responsibleRole: 'Incident Commander',
    commProcedure: 'All-Call PA broadcast with calm standardized evacuation message: Script Weather-Alpha.',
    approvedSteps: [
      'Main Stage audio engineer cuts line-array power and lowers lighting trusses.',
      'Open all four perimeter exits simultaneously (E01, E02, E03, E04).',
      'Direct attendees toward North Field Indoor Sports Complex & Student Union.',
      'Volunteers form human corridors along lit pathways.'
    ],
    requiredResources: ['Mobile Lighting Towers', 'VHF Radios', 'Collapsible Wheelchairs'],
    assemblyPoint: 'Primary Assembly Field Alpha & Indoor Complex',
    escalationContacts: [
      { role: 'Incident Commander', name: 'Elena Rostova', contact: '+1 555-019-1100' },
      { role: 'National Weather Bureau Desk', name: 'Met Service Liaison', contact: '+1 555-019-7000' }
    ],
    reviewDate: '2026-11-08',
    approvalStatus: 'approved',
    approvedBy: 'Elena Rostova'
  },
  {
    id: 'pb_evac_01',
    eventId: 'ev_nova_2026',
    title: 'Full Venue Phased Evacuation Protocol',
    category: 'evacuation',
    triggerCondition: 'Major structural incident, uncontained fire, or hazardous material release.',
    responsibleRole: 'Campus Incident Commander & Local Fire Marshall',
    commProcedure: 'Activate audible emergency tones followed by phased directional voice instructions.',
    approvedSteps: [
      'Sector 1 (Lawn A) exits via North E01 and West E04.',
      'Sector 2 (Central Quad & Expo) exits via South E03.',
      'Sector 3 (Lawn B & Food Court) exits via East E02.',
      'Emergency vehicles enter via West Access Service Gate.',
      'Complete physical sweep of restrooms and backstage zones.'
    ],
    requiredResources: ['Fire Extinguishers', 'Mojo Barricades', 'Emergency Lighting'],
    assemblyPoint: 'Primary Assembly Field Alpha (North Lawn)',
    escalationContacts: [
      { role: 'Fire Department Dispatch', name: 'Metro Fire Battalion 3', contact: '911 / Direct 555-019-9111' },
      { role: 'Campus Security', name: 'Marcus Vance', contact: '+1 555-019-4822' }
    ],
    reviewDate: '2026-11-10',
    approvalStatus: 'approved',
    approvedBy: 'Elena Rostova'
  }
];

export const SEED_READINESS_ITEMS: ReadinessItem[] = [
  // VENUE
  {
    id: 'rd_v01',
    section: 'venue',
    title: 'Venue layout reviewed & scale calibrated',
    description: 'Top-down layout verified against campus physical surveyor markers and CAD files.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Elena Rostova',
    verifiedAt: '2026-11-10 14:00'
  },
  {
    id: 'rd_v02',
    section: 'venue',
    title: 'Ingress and egress routes marked & unobstructed',
    description: 'All 4 gates and 4 emergency exits checked for minimum 4.5m clearance and zero construction scaffolding.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Marcus Vance',
    verifiedAt: '2026-11-11 09:30'
  },
  {
    id: 'rd_v03',
    section: 'venue',
    title: 'Restricted backstage & green room perimeters secure',
    description: 'Wristband access checkpoints and physical mojo barriers locked and tested.',
    isCritical: false,
    status: 'completed',
    verifiedBy: 'David O\'Connor',
    verifiedAt: '2026-11-11 11:00'
  },
  {
    id: 'rd_v04',
    section: 'venue',
    title: 'Emergency facility signage and lighting illuminated',
    description: 'Medical tents, assembly markers, and ADA ramps clearly visible from central quad.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Devon Miller',
    verifiedAt: '2026-11-11 15:45'
  },

  // CROWD PLANNING
  {
    id: 'rd_c01',
    section: 'crowd_planning',
    title: 'Attendance estimates verified against ticketing database',
    description: '8,000 baseline expected with 10,000 maximum capacity cap set in ticketing software.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Kavita Patel',
    verifiedAt: '2026-11-11 16:30'
  },
  {
    id: 'rd_c02',
    section: 'crowd_planning',
    title: 'Individual zone capacity limits configured',
    description: 'Lawn A set to 3,400 max, Quad Hub to 1,600 max, and Food Courts to 850 max.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Elena Rostova',
    verifiedAt: '2026-11-11 17:00'
  },
  {
    id: 'rd_c03',
    section: 'crowd_planning',
    title: 'Gate throughput simulations executed & validated',
    description: 'Baseline and surge arrival distribution curves simulated. Peak wait time assessed at acceptable tolerance.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Kavita Patel',
    verifiedAt: '2026-11-12 01:20'
  },
  {
    id: 'rd_c04',
    section: 'crowd_planning',
    title: 'Scenario Lab stress-test completed for exit closure',
    description: 'East Exit failure scenario simulated. Egress rerouting validated with secondary avenues.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Marcus Vance',
    verifiedAt: '2026-11-12 01:25'
  },

  // PERSONNEL
  {
    id: 'rd_p01',
    section: 'personnel',
    title: 'Security personnel deployed across all designated sectors',
    description: '18 security officers assigned across perimeter, bag screening, and pit mojo line.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Marcus Vance',
    verifiedAt: '2026-11-11 18:00'
  },
  {
    id: 'rd_p02',
    section: 'personnel',
    title: 'Medical response teams confirmed on-duty with EMT credentials',
    description: 'Dr. Thorne and EMS Alpha unit positioned at Alpha Command Tent with rapid-response golf cart.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Dr. Aris Thorne',
    verifiedAt: '2026-11-11 18:30'
  },
  {
    id: 'rd_p03',
    section: 'personnel',
    title: 'Volunteer student marshals briefed & shift schedule finalized',
    description: '35 student volunteers trained on emergency exit routes and accessibility assistance.',
    isCritical: false,
    status: 'completed',
    verifiedBy: 'Kavita Patel',
    verifiedAt: '2026-11-11 19:00'
  },
  {
    id: 'rd_p04',
    section: 'personnel',
    title: 'Tactical communications protocol & radio frequency map verified',
    description: 'All 36 VHF handhelds tested across channels 1 (Command), 2 (EMS), 3 (Security), 4 (Logistics).',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Devon Miller',
    verifiedAt: '2026-11-11 19:30'
  },

  // RESOURCES
  {
    id: 'rd_r01',
    section: 'resources',
    title: 'AED units and trauma kits inspected & batteries certified',
    description: '6 AED devices inspected; electrode pads unexpired; trauma bags fully stocked.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Dr. Aris Thorne',
    verifiedAt: '2026-11-11 11:30'
  },
  {
    id: 'rd_r02',
    section: 'resources',
    title: 'Fire extinguishers pressure-tested in food concessions',
    description: '24 dry powder canisters checked. Fire blankets confirmed at all 8 hot oil fryers.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Marcus Vance',
    verifiedAt: '2026-11-10 10:00'
  },
  {
    id: 'rd_r03',
    section: 'resources',
    title: 'Emergency lighting generators fueled & test-cranked',
    description: 'Tower 7 battery charger serviced; auxiliary diesel level at 100%.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Devon Miller',
    verifiedAt: '2026-11-11 17:30'
  },
  {
    id: 'rd_r04',
    section: 'resources',
    title: 'Water refill stations hooked to city potable supply & tested',
    description: 'Continuous pressure confirmed across all 6 hydration stations.',
    isCritical: false,
    status: 'completed',
    verifiedBy: 'Devon Miller',
    verifiedAt: '2026-11-11 15:00'
  },

  // RESPONSE
  {
    id: 'rd_s01',
    section: 'response',
    title: 'Emergency playbooks approved by Campus Safety & Chief Medical Officer',
    description: 'Playbooks covering heat distress, crowd surge, severe weather, and full evacuation signed off.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Elena Rostova',
    verifiedAt: '2026-11-10 16:00'
  },
  {
    id: 'rd_s02',
    section: 'response',
    title: 'Digital incident logging workflow and priority escalation verified',
    description: 'End-to-end incident dispatch tested from mobile gate staff to Command Center dashboard.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Kavita Patel',
    verifiedAt: '2026-11-11 20:00'
  },
  {
    id: 'rd_s03',
    section: 'response',
    title: 'Mutual aid standby notification dispatched to Municipal EMS & Police',
    description: 'Metro Police District 4 and University Hospital triage notified of 8,000 attendee event window.',
    isCritical: true,
    status: 'completed',
    verifiedBy: 'Marcus Vance',
    verifiedAt: '2026-11-11 10:00'
  }
];

export const SEED_DEFAULT_ASSUMPTIONS: SimulationAssumptions = {
  totalExpectedAttendees: 8000,
  arrivalDistribution: 'gradual',
  gateThroughputs: {
    gate_g01: 1800,
    gate_g02: 1400,
    gate_g03: 1600,
    gate_g04: 1100
  },
  zoneAttraction: {
    zone_lawn_a: 9,
    zone_lawn_b: 6,
    zone_quad_hub: 5,
    zone_entry_plaza: 3,
    zone_expo_terrace: 4,
    zone_food_east: 7,
    zone_food_west: 5
  },
  stageSchedules: [
    {
      stageId: 'stage_main',
      title: 'Headliner: Synthetic Horizons (Live Electronic Orchestra)',
      startMinute: 90,
      endMinute: 155,
      attractionWeight: 5
    },
    {
      stageId: 'stage_secondary',
      title: 'Indie Collective Showcase',
      startMinute: 40,
      endMinute: 85,
      attractionWeight: 3
    }
  ],
  walkingSpeedMps: 1.3,
  simulationDurationMinutes: 180,
  randomSeed: 42,
  disabledExits: [],
  disabledGates: [],
  weatherFactor: 1.0
};

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Queue Alert: Gate G01 Ingress Surge',
    message: 'North Main Gate processing wait time reached ~14 mins. Consider opening auxiliary scanning lanes.',
    type: 'gate',
    severity: 'warning',
    timestamp: '2026-11-12T01:10:00Z',
    eventId: 'ev_nova_2026',
    read: false,
    linkPage: 'gates'
  },
  {
    id: 'notif_2',
    title: 'Incident Logged: Heat Exhaustion on Lawn A',
    message: 'Medical incident reported in dense stage crowd. EMT Alpha unit dispatched with IV fluids.',
    type: 'incident',
    severity: 'critical',
    timestamp: '2026-11-12T01:25:00Z',
    eventId: 'ev_nova_2026',
    read: false,
    linkPage: 'incidents'
  },
  {
    id: 'notif_3',
    title: 'Simulation Complete: Baseline Plan Validated',
    message: 'Deterministic run finished with peak capacity 7,420 at T+114m. No critical egress blockages found.',
    type: 'simulation',
    severity: 'info',
    timestamp: '2026-11-12T01:20:00Z',
    eventId: 'ev_nova_2026',
    read: true,
    linkPage: 'simulation'
  },
  {
    id: 'notif_4',
    title: 'Emergency Playbook Review Signed Off',
    message: 'Chief Medical Officer approved Mass Dehydration Protocol v2.4.',
    type: 'playbook',
    severity: 'info',
    timestamp: '2026-11-11T16:00:00Z',
    eventId: 'ev_nova_2026',
    read: true,
    linkPage: 'emergency'
  }
];

export const SEED_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'act_1',
    eventId: 'ev_nova_2026',
    timestamp: '2026-11-12 01:26:00',
    user: 'Tariq Al-Mansoor',
    action: 'Logged Incident',
    details: 'Created incident inc_2026_02: Heat exhaustion reported on Main Stage Lawn A',
    category: 'incidents'
  },
  {
    id: 'act_2',
    eventId: 'ev_nova_2026',
    timestamp: '2026-11-12 01:20:15',
    user: 'Kavita Patel',
    action: 'Crowd Simulation Run',
    details: 'Executed deterministic simulation (Seed #42, 8,000 attendees, gradual arrival)',
    category: 'simulation'
  },
  {
    id: 'act_3',
    eventId: 'ev_nova_2026',
    timestamp: '2026-11-12 01:12:00',
    user: 'Maya Lin',
    action: 'Gate Status Update',
    details: 'Flagged Gate G01 badge scanner network delay warning',
    category: 'gates'
  },
  {
    id: 'act_4',
    eventId: 'ev_nova_2026',
    timestamp: '2026-11-11 20:00:00',
    user: 'Elena Rostova',
    action: 'Readiness Checklist Signed',
    details: 'Approved response readiness items for NOVA FEST 2026',
    category: 'readiness'
  },
  {
    id: 'act_5',
    eventId: 'ev_nova_2026',
    timestamp: '2026-11-11 18:30:00',
    user: 'Marcus Vance',
    action: 'Staff Deployment',
    details: 'Assigned 18 security personnel across perimeter and stage barricades',
    category: 'staff'
  }
];

