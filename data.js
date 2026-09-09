// ============================================================
// DATA — extracted from user's C172S NAV III G1000 POH (2020)
// Emergency memory items = bold-faced items per POH Section 3 note:
// "Procedures ... shown in bold faced type are immediate action
// items which should be committed to memory."
// ============================================================

const CATEGORY_LABELS = {
  'ENGINE FAILURES': 'Motor Arızaları',
  'FORCED LANDINGS': 'Zorunlu İnişler',
  'FIRES': 'Yangınlar',
  'ICING': 'Buzlanma',
  'OTHER': 'Diğer'
};

const EMERGENCY = [
  {
    id: 'eng-fail-takeoff-roll',
    category: 'ENGINE FAILURES',
    title: 'Engine Failure During Takeoff Roll',
    steps: [
      { t: 'Throttle Control - IDLE (pull full out)', m: true },
      { t: 'Brakes - APPLY', m: true },
      { t: 'Wing Flaps - RETRACT', m: false },
      { t: 'Mixture Control - IDLE CUTOFF (pull full out)', m: false },
      { t: 'MAGNETOS Switch - OFF', m: false },
      { t: 'STBY BATT Switch - OFF', m: false },
      { t: 'MASTER Switch (ALT and BAT) - OFF', m: false }
    ]
  },
  {
    id: 'eng-fail-after-takeoff',
    category: 'ENGINE FAILURES',
    title: 'Engine Failure Immediately After Takeoff',
    steps: [
      { t: 'Airspeed - 70 KIAS (Flaps UP) / 65 KIAS (Flaps 10°-FULL)', m: true },
      { t: 'Mixture Control - IDLE CUTOFF (pull full out)', m: false },
      { t: 'FUEL SHUTOFF Valve - OFF (pull full out)', m: false },
      { t: 'MAGNETOS Switch - OFF', m: false },
      { t: 'Wing Flaps - AS REQUIRED (FULL recommended)', m: false },
      { t: 'STBY BATT Switch - OFF', m: false },
      { t: 'MASTER Switch (ALT and BAT) - OFF', m: false },
      { t: 'Cabin Door - UNLATCH', m: false },
      { t: 'Land - STRAIGHT AHEAD', m: false }
    ]
  },
  {
    id: 'eng-fail-flight-restart',
    category: 'ENGINE FAILURES',
    title: 'Engine Failure During Flight (Restart Procedures)',
    steps: [
      { t: 'Airspeed - 68 KIAS (best glide speed)', m: true },
      { t: 'FUEL SHUTOFF Valve - ON (push full in)', m: true },
      { t: 'FUEL SELECTOR Valve - BOTH', m: true },
      { t: 'FUEL PUMP Switch - ON', m: true },
      { t: 'Mixture Control - RICH (if restart has not occurred)', m: true },
      { t: 'MAGNETOS Switch - BOTH (or START if propeller is stopped)', m: false },
      { t: 'FUEL PUMP Switch - OFF', m: false }
    ]
  },
  {
    id: 'forced-landing-no-power',
    category: 'FORCED LANDINGS',
    title: 'Emergency Landing Without Engine Power',
    steps: [
      { t: 'Pilot and Passenger Seat Backs - MOST UPRIGHT POSITION', m: false },
      { t: 'Seats and Seat Belts - SECURE', m: false },
      { t: 'Airspeed - 70 KIAS (Flaps UP) / 65 KIAS (Flaps 10°-FULL)', m: false },
      { t: 'Mixture Control - IDLE CUTOFF (pull full out)', m: false },
      { t: 'FUEL SHUTOFF Valve - OFF (pull full out)', m: false },
      { t: 'MAGNETOS Switch - OFF', m: false },
      { t: 'Wing Flaps - AS REQUIRED (FULL recommended)', m: false },
      { t: 'STBY BATT Switch - OFF', m: false },
      { t: 'MASTER Switch (ALT and BAT) - OFF (when landing is assured)', m: false },
      { t: 'Doors - UNLATCH PRIOR TO TOUCHDOWN', m: false },
      { t: 'Touchdown - SLIGHTLY TAIL LOW', m: false },
      { t: 'Brakes - APPLY HEAVILY', m: false }
    ]
  },
  {
    id: 'precautionary-landing',
    category: 'FORCED LANDINGS',
    title: 'Precautionary Landing With Engine Power',
    steps: [
      { t: 'Pilot and Passenger Seat Backs - MOST UPRIGHT POSITION', m: false },
      { t: 'Seats and Seat Belts - SECURE', m: false },
      { t: 'Airspeed - 65 KIAS', m: false },
      { t: 'Wing Flaps - 20°', m: false },
      { t: 'Selected Field - FLY OVER (noting terrain and obstructions)', m: false },
      { t: 'Wing Flaps - FULL (on final approach)', m: false },
      { t: 'Airspeed - 65 KIAS', m: false },
      { t: 'STBY BATT Switch - OFF', m: false },
      { t: 'MASTER Switch (ALT and BAT) - OFF (when landing assured)', m: false },
      { t: 'Doors - UNLATCH PRIOR TO TOUCHDOWN', m: false },
      { t: 'Touchdown - SLIGHTLY TAIL LOW', m: false },
      { t: 'Mixture Control - IDLE CUTOFF (pull full out)', m: false },
      { t: 'MAGNETOS Switch - OFF', m: false },
      { t: 'Brakes - APPLY HEAVILY', m: false }
    ]
  },
  {
    id: 'ditching',
    category: 'FORCED LANDINGS',
    title: 'Ditching',
    steps: [
      { t: 'Radio - TRANSMIT MAYDAY on 121.5 MHz (location, intentions, SQUAWK 7700)', m: false },
      { t: 'Heavy Objects (in baggage area) - SECURE OR JETTISON', m: false },
      { t: 'Pilot and Passenger Seat Backs - MOST UPRIGHT POSITION', m: false },
      { t: 'Seats and Seat Belts - SECURE', m: false },
      { t: 'Wing Flaps - 20° - FULL', m: false },
      { t: 'Power - ESTABLISH 300 FT/MIN DESCENT AT 55 KIAS', m: false },
      { t: 'Approach - INTO THE WIND (high winds/heavy seas) or PARALLEL TO SWELLS (light winds/heavy swells)', m: false },
      { t: 'Cabin Doors - UNLATCH', m: false },
      { t: 'Touchdown - LEVEL ATTITUDE AT ESTABLISHED RATE OF DESCENT', m: false },
      { t: 'Face - CUSHION AT TOUCHDOWN (with folded coat)', m: false },
      { t: 'ELT - ACTIVATE', m: false },
      { t: 'Airplane - EVACUATE THROUGH CABIN DOORS', m: false },
      { t: 'Life Vests and Raft - INFLATE WHEN CLEAR OF AIRPLANE', m: false }
    ]
  },
  {
    id: 'fire-start-ground',
    category: 'FIRES',
    title: 'During Start On Ground (Engine Fails To Start)',
    steps: [
      { t: 'MAGNETOS Switch - START (continue cranking to start the engine)', m: true },
      { t: 'Throttle Control - FULL (push full in)', m: true },
      { t: 'Mixture Control - IDLE CUTOFF (pull full out)', m: true },
      { t: 'MAGNETOS Switch - START (continue cranking)', m: true },
      { t: 'FUEL SHUTOFF Valve - OFF (pull full out)', m: true },
      { t: 'FUEL PUMP Switch - OFF', m: true },
      { t: 'MAGNETOS Switch - OFF', m: true },
      { t: 'STBY BATT Switch - OFF', m: true },
      { t: 'MASTER Switch (ALT and BAT) - OFF', m: true },
      { t: 'Engine - SECURE', m: false },
      { t: 'Parking Brake - RELEASE', m: false },
      { t: 'Fire Extinguisher - OBTAIN', m: false },
      { t: 'Airplane - EVACUATE', m: false },
      { t: 'Fire - EXTINGUISH', m: false },
      { t: 'Fire Damage - INSPECT', m: false }
    ]
  },
  {
    id: 'engine-fire-flight',
    category: 'FIRES',
    title: 'Engine Fire In Flight',
    steps: [
      { t: 'Mixture Control - IDLE CUTOFF (pull full out)', m: true },
      { t: 'FUEL SHUTOFF Valve - OFF (pull full out)', m: true },
      { t: 'FUEL PUMP Switch - OFF', m: true },
      { t: 'MASTER Switch (ALT and BAT) - OFF', m: true },
      { t: 'Cabin Vents - OPEN (as needed)', m: false },
      { t: 'CABIN HT and CABIN AIR Control Knobs - OFF (push full in)', m: false },
      { t: 'Airspeed - 100 KIAS (increase if needed to find incombustible mixture)', m: false },
      { t: 'Forced Landing - EXECUTE', m: false }
    ]
  },
  {
    id: 'electrical-fire-flight',
    category: 'FIRES',
    title: 'Electrical Fire In Flight',
    steps: [
      { t: 'STBY BATT Switch - OFF', m: true },
      { t: 'MASTER Switch (ALT and BAT) - OFF', m: true },
      { t: 'Cabin Vents - CLOSED (to avoid drafts)', m: true },
      { t: 'CABIN HT and CABIN AIR Control Knobs - OFF (push full in)', m: true },
      { t: 'Fire Extinguisher - ACTIVATE (if available)', m: true },
      { t: 'AVIONICS Switch (BUS 1 and BUS 2) - OFF', m: false },
      { t: 'All Other Switches (except MAGNETOS switch) - OFF', m: false }
    ]
  },
  {
    id: 'cabin-fire',
    category: 'FIRES',
    title: 'Cabin Fire',
    steps: [
      { t: 'STBY BATT Switch - OFF', m: true },
      { t: 'MASTER Switch (ALT and BAT) - OFF', m: true },
      { t: 'Cabin Vents - CLOSED (to avoid drafts)', m: true },
      { t: 'CABIN HT and CABIN AIR Control Knobs - OFF (push full in)', m: true },
      { t: 'Fire Extinguisher - ACTIVATE (if available)', m: true },
      { t: 'Cabin Vents - OPEN (when sure fire is completely extinguished)', m: false },
      { t: 'CABIN HT and CABIN AIR Control Knobs - ON (pull full out)', m: false },
      { t: 'Land the airplane as soon as possible to inspect for damage', m: false }
    ]
  },
  {
    id: 'wing-fire',
    category: 'FIRES',
    title: 'Wing Fire',
    steps: [
      { t: 'LAND and TAXI Light Switches - OFF', m: true },
      { t: 'NAV Light Switch - OFF', m: true },
      { t: 'STROBE Light Switch - OFF', m: true },
      { t: 'PITOT HEAT Switch - OFF', m: true }
    ]
  },
  {
    id: 'icing',
    category: 'ICING',
    title: 'Inadvertent Icing Encounter During Flight',
    steps: [
      { t: 'PITOT HEAT Switch - ON', m: true },
      { t: 'Turn back or change altitude (less conducive to icing)', m: true },
      { t: 'CABIN HT Control Knob - ON (pull full out)', m: true },
      { t: 'Defroster Control Outlets - OPEN', m: true },
      { t: 'CABIN AIR Control Knob - ADJUST (max defroster heat/airflow)', m: true },
      { t: 'Watch for induction air filter icing; adjust throttle/mixture', m: false },
      { t: 'Plan a landing at the nearest airport', m: false },
      { t: 'With 0.25in+ ice: expect higher power/approach/stall speeds', m: false },
      { t: 'Leave wing flaps retracted', m: false },
      { t: 'Open left window; scrape ice from windshield if practical', m: false },
      { t: 'Perform landing approach using a forward slip if necessary', m: false },
      { t: 'Approach at 65-75 KIAS depending on ice accumulation', m: false },
      { t: 'Perform landing in level attitude', m: false },
      { t: 'Avoid missed approaches (severely reduced climb capability)', m: false }
    ]
  },
  {
    id: 'static-source',
    category: 'OTHER',
    title: 'Static Source Blockage (Erroneous Instrument Reading Suspected)',
    steps: [
      { t: 'ALT STATIC AIR Valve - ON (pull full out)', m: true },
      { t: 'Cabin Vents - CLOSED', m: false },
      { t: 'CABIN HT and CABIN AIR Control Knobs - ON (pull full out)', m: false },
      { t: 'Airspeed - refer to Alternate Static Source correction chart', m: false }
    ]
  },
  {
    id: 'fuel-vapor',
    category: 'OTHER',
    title: 'Excessive Fuel Vapor - Fuel Flow Stabilization',
    steps: [
      { t: 'FUEL PUMP Switch - ON', m: false },
      { t: 'Mixture Control - ADJUST (for smooth engine operation)', m: false },
      { t: 'Fuel Selector Valve - SELECT OPPOSITE TANK (if vapor continues)', m: false },
      { t: 'FUEL PUMP Switch - OFF (after fuel flow has stabilized)', m: false }
    ]
  },
  {
    id: 'autopilot-failure',
    category: 'OTHER',
    title: 'Autopilot or Electric Trim Failure - AP/PTRM Annunciator(s) Come On',
    steps: [
      { t: 'Control Wheel - GRASP FIRMLY (regain control of airplane)', m: true },
      { t: 'A/P TRIM DISC Button - PRESS and HOLD (throughout recovery)', m: true },
      { t: 'Elevator Trim Control - ADJUST MANUALLY (as necessary)', m: true },
      { t: 'AUTO PILOT Circuit Breaker - OPEN (pull out)', m: true },
      { t: 'A/P TRIM DISC Button - RELEASE', m: false }
    ]
  },
  {
    id: 'vacuum-failure',
    category: 'OTHER',
    title: 'Vacuum System Failure - LOW VACUUM Annunciator Comes On',
    steps: [
      { t: 'Vacuum Indicator (VAC) - CHECK EIS ENGINE PAGE (green band limits)', m: true }
    ]
  },
  {
    id: 'co-level',
    category: 'OTHER',
    title: 'High CO Level Advisory - CO LVL HIGH Annunciator Comes On',
    steps: [
      { t: 'CABIN HT Control Knob - OFF (push full in)', m: true },
      { t: 'CABIN AIR Control Knob - ON (pull full out)', m: true },
      { t: 'Cabin Vents - OPEN', m: true },
      { t: 'Cabin Windows - OPEN (163 KIAS max)', m: false }
    ]
  }
];

const NORMAL = [
  {
    id: 'before-starting-engine',
    title: 'Before Starting Engine',
    items: [
      'Preflight Inspection - COMPLETE',
      'Passenger Briefing - COMPLETE',
      'Seats and Seat Belts - ADJUST and LOCK',
      'Brakes - TEST and SET',
      'Circuit Breakers - CHECK IN',
      'Electrical Equipment - OFF',
      'AVIONICS Switch (BUS 1 and BUS 2) - OFF',
      'FUEL SELECTOR Valve - BOTH',
      'FUEL SHUTOFF Valve - ON (push full in)'
    ]
  },
  {
    id: 'starting-engine-battery',
    title: 'Starting Engine (With Battery)',
    items: [
      'Throttle Control - OPEN 1/4 INCH',
      'Mixture Control - IDLE CUTOFF (pull full out)',
      'STBY BATT Switch - TEST (20 sec) then ARM',
      'Engine Indicating System - CHECK PARAMETERS',
      'BUS E Volts - CHECK (24 VOLTS minimum)',
      'M BUS Volts - CHECK (1.5 VOLTS or less)',
      'BATT S Amps - CHECK (discharge shown)',
      'STBY BATT Annunciator - CHECK (shown)',
      'Propeller Area - CLEAR',
      'MASTER Switch (ALT and BAT) - ON',
      'BEACON Light Switch - ON',
      'FUEL PUMP Switch - ON',
      'Mixture Control - FULL RICH then IDLE CUTOFF',
      'FUEL PUMP Switch - OFF',
      'MAGNETOS Switch - START (release when engine starts)',
      'Mixture Control - ADVANCE SMOOTHLY TO RICH',
      'Oil Pressure - CHECK (green band in 30-60 sec)',
      'AMPS (M BATT and BATT S) - CHECK (charge shown)',
      'LOW VOLTS Annunciator - CHECK (not shown)',
      'NAV Light Switch - ON as required',
      'AVIONICS Switch (BUS 1 and BUS 2) - ON'
    ]
  },
  {
    id: 'before-takeoff',
    title: 'Before Takeoff',
    items: [
      'Parking Brake - SET',
      'Pilot and Passenger Seat Backs - MOST UPRIGHT POSITION',
      'Seats and Seat Belts - CHECK SECURE',
      'Cabin Doors - CLOSED and LOCKED',
      'Flight Controls - FREE and CORRECT',
      'Flight Instruments (PFD) - CHECK',
      'Altimeters - SET',
      'ALT SEL - SET',
      'Standby Flight Instruments - CHECK',
      'Fuel Quantity - CHECK',
      'Mixture Control - RICH',
      'FUEL SELECTOR Valve - SET BOTH',
      'Autopilot - ENGAGE (if installed)',
      'Flight Controls - CHECK (autopilot overpower in pitch/roll)',
      'A/P TRIM DISC Button - PRESS (if installed)',
      'Flight Director - OFF (if installed)',
      'Elevator Trim Control - SET FOR TAKEOFF',
      'Throttle Control - 1800 RPM (mag check, VAC, engine, amm/volt)',
      'Annunciators - CHECK (none shown)',
      'Throttle Control - CHECK IDLE',
      'Throttle Control - 1000 RPM or LESS',
      'Throttle Control Friction Lock - ADJUST',
      'COM Frequency(s) - SET',
      'NAV Frequency(s) - SET',
      'FMS/GPS Flight Plan - AS DESIRED',
      'XPDR - SET',
      'CDI Softkey - SELECT NAV SOURCE',
      'CABIN PWR 12V Switch - OFF',
      'Wing Flaps - UP - 10° (10° preferred)',
      'Cabin Windows - CLOSED and LOCKED',
      'STROBE Light Switch - ON',
      'Brakes - RELEASE'
    ]
  },
  {
    id: 'normal-takeoff',
    title: 'Takeoff - Normal',
    items: [
      'Wing Flaps - UP - 10° (10° preferred)',
      'Throttle Control - FULL (push full in)',
      'Mixture Control - RICH (lean above 3000 ft)',
      'Elevator Control - LIFT NOSEWHEEL AT 55 KIAS',
      'Climb Airspeed - 70-80 KIAS',
      'Wing Flaps - RETRACT (at safe altitude)'
    ]
  },
  {
    id: 'short-field-takeoff',
    title: 'Takeoff - Short Field',
    items: [
      'Wing Flaps - 10°',
      'Brakes - APPLY',
      'Throttle Control - FULL (push full in)',
      'Mixture Control - RICH (lean above 3000 ft)',
      'Brakes - RELEASE',
      'Elevator Control - SLIGHTLY TAIL LOW',
      'Climb Airspeed - 56 KIAS (until obstacles cleared)',
      'Wing Flaps - RETRACT SLOWLY (above 60 KIAS)'
    ]
  },
  {
    id: 'enroute-climb',
    title: 'Enroute Climb',
    items: [
      'Airspeed - 70-85 KIAS',
      'Throttle Control - FULL (push full in)',
      'Mixture Control - RICH (lean above 3000 ft)'
    ]
  },
  {
    id: 'cruise',
    title: 'Cruise',
    items: [
      'Power - 2100-2700 RPM (max 75% recommended)',
      'Elevator Trim Control - ADJUST',
      'Mixture Control - LEAN',
      'FMS/GPS - REVIEW and BRIEF'
    ]
  },
  {
    id: 'descent',
    title: 'Descent',
    items: [
      'Power - AS DESIRED',
      'Mixture - ADJUST',
      'Altimeters - SET',
      'ALT SEL - SET',
      'CDI Softkey - SELECT NAV SOURCE',
      'FMS/GPS - REVIEW and BRIEF',
      'FUEL SELECTOR Valve - BOTH',
      'Wing Flaps - AS DESIRED (UP-10° below 110 KIAS; 10°-FULL below 85 KIAS)'
    ]
  },
  {
    id: 'before-landing',
    title: 'Before Landing',
    items: [
      'Pilot and Passenger Seat Backs - MOST UPRIGHT POSITION',
      'Seats and Seat Belts - SECURED and LOCKED',
      'FUEL SELECTOR Valve - BOTH',
      'Mixture Control - RICH',
      'LAND and TAXI Light Switches - ON',
      'Autopilot - OFF (if installed)',
      'CABIN PWR 12V Switch - OFF'
    ]
  },
  {
    id: 'normal-landing',
    title: 'Landing - Normal',
    items: [
      'Airspeed - 65-75 KIAS (Flaps UP)',
      'Wing Flaps - AS DESIRED (UP-10° below 110 KIAS; 10°-FULL below 85 KIAS)',
      'Airspeed - 60-70 KIAS (Flaps FULL)',
      'Elevator Trim Control - ADJUST',
      'Touchdown - MAIN WHEELS FIRST',
      'Landing Roll - LOWER NOSEWHEEL GENTLY',
      'Braking - MINIMUM REQUIRED'
    ]
  },
  {
    id: 'short-field-landing',
    title: 'Landing - Short Field',
    items: [
      'Airspeed - 65-75 KIAS (Flaps UP)',
      'Wing Flaps - FULL',
      'Airspeed - 61 KIAS (until flare)',
      'Elevator Trim Control - ADJUST',
      'Power - REDUCE TO IDLE (as obstacle cleared)',
      'Touchdown - MAIN WHEELS FIRST',
      'Brakes - APPLY HEAVILY',
      'Wing Flaps - UP'
    ]
  },
  {
    id: 'balked-landing',
    title: 'Balked Landing',
    items: [
      'Throttle Control - FULL (push full in)',
      'Wing Flaps - RETRACT to 20°',
      'Climb Speed - 60 KIAS',
      'Wing Flaps - 10° (obstacle cleared), then UP (safe altitude & 65 KIAS)'
    ]
  },
  {
    id: 'securing-airplane',
    title: 'Securing Airplane (Engine Shutdown)',
    items: [
      'Parking Brake - SET',
      'Throttle Control - IDLE (pull full out)',
      'Electrical Equipment - OFF',
      'AVIONICS Switch (BUS 1 and BUS 2) - OFF',
      'Mixture Control - IDLE CUTOFF (pull full out)',
      'MAGNETOS Switch - OFF',
      'MASTER Switch (ALT and BAT) - OFF',
      'STBY BATT Switch - OFF',
      'Control Lock - INSTALL',
      'FUEL SELECTOR Valve - LEFT or RIGHT (prevent crossfeed)'
    ]
  }
];

const SPEEDS = [
  { q: 'VNE - Never Exceed Speed', a: '163 KIAS' },
  { q: 'VNO - Maximum Structural Cruising Speed', a: '129 KIAS' },
  { q: 'VA - Maneuvering Speed @ 2550 lbs', a: '105 KIAS' },
  { q: 'VA - Maneuvering Speed @ 2200 lbs', a: '98 KIAS' },
  { q: 'VA - Maneuvering Speed @ 1900 lbs', a: '90 KIAS' },
  { q: 'VFE - Max Flap Extended Speed, Flaps 10°', a: '110 KIAS' },
  { q: 'VFE - Max Flap Extended Speed, Flaps 10°-FULL', a: '85 KIAS' },
  { q: 'Maximum Window Open Speed', a: '163 KIAS' },
  { q: 'Engine Failure After Takeoff Speed - Flaps UP', a: '70 KIAS' },
  { q: 'Engine Failure After Takeoff Speed - Flaps 10°-FULL', a: '65 KIAS' },
  { q: 'Best Glide Speed (Maximum Glide)', a: '68 KIAS' },
  { q: 'Precautionary Landing With Engine Power Speed', a: '65 KIAS' },
  { q: 'Normal Climb Speed (Takeoff)', a: '75-85 KIAS' },
  { q: 'Short Field Takeoff Speed at 50 ft (Flaps 10°)', a: '56 KIAS' },
  { q: 'Best Rate of Climb, Sea Level (Vy)', a: '74 KIAS' },
  { q: 'Best Rate of Climb, 10,000 ft', a: '72 KIAS' },
  { q: 'Best Angle of Climb, Sea Level (Vx)', a: '62 KIAS' },
  { q: 'Best Angle of Climb, 10,000 ft', a: '67 KIAS' },
  { q: 'Normal Approach Speed - Flaps UP', a: '65-75 KIAS' },
  { q: 'Normal Approach Speed - Flaps FULL', a: '60-70 KIAS' },
  { q: 'Short Field Approach Speed - Flaps FULL', a: '61 KIAS' },
  { q: 'Balked Landing Climb Speed', a: '60 KIAS' },
  { q: 'Maximum Demonstrated Crosswind Velocity', a: '15 KNOTS' },
  { q: 'Max Turbulent Air Penetration Speed @ 2550 lbs', a: '105 KIAS' },
  { q: 'Approved Flap Range - Takeoff', a: 'UP to 10°' },
  { q: 'Approved Flap Range - Landing', a: 'UP to FULL' },
  { q: 'Maximum Engine Speed (RPM)', a: '2700 RPM' },
  { q: 'Maximum Oil Temperature', a: '245°F (118°C)' },
  { q: 'Oil Pressure - Minimum', a: '20 PSI' },
  { q: 'Oil Pressure - Maximum', a: '115 PSI' },
  { q: 'Maximum Ramp Weight (Normal Category)', a: '2558 LBS' },
  { q: 'Maximum Takeoff Weight (Normal Category)', a: '2550 LBS' },
  { q: 'Maximum Landing Weight (Normal Category)', a: '2550 LBS' },
  { q: 'Max Baggage - Area A+B combined', a: '120 LBS' },
  { q: 'Total Fuel Capacity', a: '56.0 US GAL' },
  { q: 'Usable Fuel (total, both tanks)', a: '53.0 US GAL' },
  { q: 'Unusable Fuel (total, both tanks)', a: '3.0 US GAL' },
  { q: 'Autopilot Maximum Engagement Speed', a: '150 KIAS' },
  { q: 'Autopilot Minimum Engagement Speed', a: '70 KIAS' },
  { q: 'Airspeed Indicator - White Arc (Full Flap Operating Range)', a: '40 - 85 KIAS' },
  { q: 'Airspeed Indicator - Green Arc (Normal Operating Range)', a: '48 - 129 KIAS' },
  { q: 'Airspeed Indicator - Yellow Arc (Caution Range)', a: '129 - 163 KIAS' },
  { q: 'Airspeed Indicator - Red Line', a: '163 KIAS' },
  { q: 'Cylinder Head Temperature - Green Arc', a: '200 - 500 °F' },
  { q: 'Oil Temperature - Green Arc', a: '100 - 245 °F' },
  { q: 'Oil Pressure - Green Arc', a: '50 - 90 PSI' },
  { q: 'Fuel Quantity - Green Arc', a: '5 - 24 GALLONS' },
  { q: 'Fuel Flow - Green Arc', a: '0 - 12 GPH' },
  { q: 'Vacuum Indicator - Green Arc', a: '4.5 - 5.5 in.Hg' },
  { q: 'Tachometer - Green Arc, Sea Level', a: '2100 - 2500 RPM' },
  { q: 'Enroute Climb Speed, 10,000 ft (Normal)', a: '70 - 80 KIAS' },
  { q: 'Max Baggage - Area B (Station 108 to 142)', a: '50 LBS' },
  { q: 'Maximum Takeoff Weight (Utility Category)', a: '2200 LBS' }
];

// ============================================================
// GERÇEK SINAV KAĞIDI — "CESSNA 172S NORMAL USÜLLER SINAVI"
// Sorular sınav kağıdının birebir sırası; cevaplar POH 2020'den
// (Bölüm 2 limitler / Bölüm 4 normal usüller) doğrulanarak yazıldı.
// ============================================================
const EXAM_PAPER = {
  title: 'CESSNA 172S NORMAL USÜLLER SINAVI',
  sections: [
    {
      items: [
        { n: '1', parts: [{ q: 'MAXIMUM TAKEOFF WEIGHT', a: '2550 LBS' }] },
        { n: '2', parts: [
          { q: 'TOTAL FUEL CAPACITY', a: '56.0 U.S. GALLONS' },
          { q: 'USABLE FUEL', a: '53.0 U.S. GALLONS' }
        ] }
      ]
    },
    {
      head: 'SPEED LIMITATIONS',
      items: [
        { n: '3', parts: [{ q: 'VNE', a: '163 KIAS' }] },
        { n: '4', parts: [{ q: 'VNO', a: '129 KIAS' }] },
        { n: '5', parts: [
          { q: 'VFE FLAP 10°', a: '110 KIAS' },
          { q: '10°-FULL', a: '85 KIAS' }
        ] },
        { n: '6', parts: [{ q: 'WHITE ARC', a: '40 - 85 KIAS' }] },
        { n: '7', parts: [{ q: 'GREEN ARC', a: '48 - 129 KIAS' }] },
        { n: '8', parts: [{ q: 'CYLINDER HEAD TEMPERATURE GREEN ARC', a: '200 - 500 °F' }] },
        { n: '9', parts: [{ q: 'OIL TEMPERATURE GREEN ARC', a: '100 - 245 °F' }] },
        { n: '10', parts: [{ q: 'OIL PRESSURE GREEN ARC', a: '50 - 90 PSI' }] },
        { n: '11', parts: [{ q: 'FUEL QUANTITY GREEN ARC', a: '5 - 24 GALLONS' }] },
        { n: '12', parts: [
          { q: 'AUTOPILOT MAX. ENGAGEMENT SPEED', a: '150 KIAS' },
          { q: 'MIN. ENGAGEMENT SPEED', a: '70 KIAS' }
        ] }
      ]
    },
    {
      head: 'BALKED LANDING',
      items: [
        { parts: [{ q: 'THROTTLE CONTROL', a: 'FULL (push full in)' }] },
        { parts: [{ q: 'WING FLAPS', a: 'RETRACT to 20°' }] },
        { parts: [{ q: 'CLIMB SPEED', a: '60 KIAS' }] },
        { parts: [{ q: 'WING FLAPS', a: '10° (as obstacle is cleared), then UP (after reaching a safe altitude and 65 KIAS)' }] }
      ]
    },
    {
      head: 'NORMAL TAKEOFF',
      items: [
        { parts: [{ q: 'WING FLAPS', a: 'UP - 10° (10° preferred)' }] },
        { parts: [{ q: 'THROTTLE CONTROL', a: 'FULL (push full in)' }] },
        { parts: [{ q: 'MIXTURE CONTROL', a: 'RICH (above 3000 feet pressure altitude, lean for maximum RPM)' }] },
        { parts: [{ q: 'ELEVATOR CONTROL LIFT NOSE WHEEL AT', a: '55 KIAS' }] },
        { parts: [{ q: 'CLIMB AIRSPEED', a: '70 - 80 KIAS' }] },
        { parts: [{ q: 'WING FLAPS', a: 'RETRACT (at safe altitude)' }] }
      ]
    },
    {
      head: 'AIRSPEEDS FOR NORMAL OPERATION',
      items: [
        { parts: [{ q: 'NORMAL APPROACH FLAPS UP', a: '65 - 75 KIAS' }] },
        { parts: [{ q: 'NORMAL APPROACH FLAPS FULL', a: '60 - 70 KIAS' }] },
        { parts: [{ q: 'SHORT FIELD APPROACH FLAPS FULL', a: '61 KIAS' }] }
      ]
    },
    {
      head: 'MAXIMUM DEMONSTRATED CROSSWIND VELOCITY',
      note: 'POH tek değer veriyor: "Takeoff or Landing . . . 15 KNOTS" (Bölüm 4, sayfa 4-3). Sınav kağıdı iki satıra ayırmış ama ikisinin de cevabı aynı.',
      items: [
        { parts: [{ q: 'TAKEOFF FLAPS 10°', a: '15 KNOTS' }] },
        { parts: [{ q: 'LANDING FLAPS FULL', a: '15 KNOTS' }] }
      ]
    }
  ]
};
