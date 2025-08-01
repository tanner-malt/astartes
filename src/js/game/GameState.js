// GameState.js - Core game state management and data structures

class GameState {
  constructor() {
    this.warmaster = {
      name: "Warmaster Aurelius",
      rank: "Warmaster",
      experience: 0,
      abilities: ["Strategic Genius", "Fleet Commander"]
    };
    
    // Resources - simplified structure for UI compatibility
    this.resources = {
      promethium: 10000,      // Fuel for ships and vehicles
      ammunition: 8000,       // Ship weapons, ground forces
      provisions: 12000,      // Food, water, medical supplies
      mechanicum: 500,        // Tech-priests, repair materials
      astartes: 15000,        // Space Marine personnel
      imperial_guard: 50000,  // Regular human forces
      imperial_tithe: 1000,   // Imperial tithe collected
      morale: 85,             // Fleet-wide morale
      requisition: 5000,      // Legacy compatibility
      supplies: 3000,         // Legacy compatibility
      influence: 100          // Legacy compatibility
    };
    
    this.galaxy = this.generateGalaxy();
    this.fleet = this.initializeFleet();
    this.planets = this.initializePlanets();
    this.fleetLocation = 0; // Currently at System A (id: 0)
    this.events = [];
    this.turn = 1;
    this.campaignObjectives = {
      systemsControlled: 1,
      enemiesDefeated: 0,
      planetsColonized: 1,
      technologiesResearched: 0
    };
    this.research = {
      available: ["Improved Armor", "Enhanced Weapons", "Faster Engines", "Advanced Sensors", "Void Shields"],
      completed: [],
      points: 100
    };
    
    // Simple diplomacy system
    this.diplomacy = {
      factions: [
        { name: "Ork Clans", relationship: -50, threat: "High" },
        { name: "Chaos Cults", relationship: -80, threat: "Extreme" },
        { name: "Eldar Corsairs", relationship: -30, threat: "Medium" }
      ]
    };
    
    // Achievement System
    this.achievements = {
      unlocked: [],
      available: [
        { id: "first_conquest", name: "First Conquest", description: "Conquer your first enemy system", progress: 0, target: 1 },
        { id: "fleet_commander", name: "Fleet Commander", description: "Command 10 ships simultaneously", progress: 0, target: 10 },
        { id: "tech_master", name: "Tech Master", description: "Complete 5 research projects", progress: 0, target: 5 },
        { id: "crusade_veteran", name: "Crusade Veteran", description: "Survive 50 turns", progress: 0, target: 50 },
        { id: "emperor_champion", name: "Emperor's Champion", description: "Control 15 systems", progress: 0, target: 15 },
        { id: "relic_hunter", name: "Relic Hunter", description: "Discover 3 ancient artifacts", progress: 0, target: 3 },
        { id: "logistics_master", name: "Logistics Master", description: "Maintain full supplies for 20 turns", progress: 0, target: 20 }
      ]
    };
    
    // Advanced Research Trees
    this.researchTrees = {
      military: {
        name: "Military Engineering",
        unlocked: ["basic_weapons"],
        technologies: {
          basic_weapons: { name: "Basic Weapons", cost: 100, prerequisites: [], unlocked: true },
          advanced_weapons: { name: "Advanced Weapons", cost: 300, prerequisites: ["basic_weapons"], unlocked: false },
          plasma_technology: { name: "Plasma Technology", cost: 500, prerequisites: ["advanced_weapons"], unlocked: false },
          void_shields: { name: "Void Shields", cost: 200, prerequisites: ["basic_weapons"], unlocked: false }
        }
      },
      infrastructure: {
        name: "Infrastructure",
        unlocked: ["basic_construction"],
        technologies: {
          basic_construction: { name: "Basic Construction", cost: 150, prerequisites: [], unlocked: true },
          advanced_mining: { name: "Advanced Mining", cost: 250, prerequisites: ["basic_construction"], unlocked: false },
          orbital_platforms: { name: "Orbital Platforms", cost: 400, prerequisites: ["advanced_mining"], unlocked: false }
        }
      },
      xenoarchaeology: {
        name: "Xenoarchaeology",
        unlocked: [],
        technologies: {
          artifact_analysis: { name: "Artifact Analysis", cost: 200, prerequisites: [], unlocked: false },
          stc_recovery: { name: "STC Recovery", cost: 350, prerequisites: ["artifact_analysis"], unlocked: false },
          archaeotech: { name: "Archaeotech Integration", cost: 600, prerequisites: ["stc_recovery"], unlocked: false }
        }
      }
    };
    
    // Enhanced Narrative System
    this.narrative = {
      currentChapter: 1,
      decisions: [],
      relationships: {
        techpriests: 50,
        astartes_captains: 70,
        imperial_guard_officers: 60,
        navigator_houses: 40,
        inquisition: 30
      },
      artifacts: [],
      campaigns: [
        { id: "opening_gambit", name: "Opening Gambit", completed: false, progress: 0 },
        { id: "forge_alliance", name: "Forge World Alliance", completed: false, progress: 0 },
        { id: "the_waaagh", name: "The Green Tide", completed: false, progress: 0 }
      ]
    };
    
    // Officer Development System
    this.officers = {
      warmaster: {
        name: "Warmaster Aurelius",
        rank: "Warmaster",
        experience: 0,
        level: 1,
        skills: {
          strategy: 8,
          leadership: 9,
          tactics: 7,
          logistics: 6
        },
        traits: ["Strategic Genius", "Inspiring Presence"],
        biography: "A veteran of countless campaigns, chosen to lead this Great Crusade."
      },
      captains: [
        {
          name: "Captain Thaddeus",
          chapter: "Imperial Fists",
          specialization: "Siege Warfare",
          experience: 150,
          level: 2,
          skills: { tactics: 7, courage: 9, engineering: 8 },
          traits: ["Fortress Breaker", "Unwavering"]
        }
      ],
      admirals: [
        {
          name: "Admiral Voss",
          fleet: "Battlefleet Crusade",
          specialization: "Naval Combat",
          experience: 200,
          level: 3,
          skills: { navigation: 9, gunnery: 8, command: 7 },
          traits: ["Void Master", "Fleet Coordinator"]
        }
      ]
    };
    
    // Enhanced Event System
    this.eventSystem = {
      activeEvents: [],
      availableEvents: [
        {
          id: "rogue_trader_encounter",
          name: "Rogue Trader Proposition",
          description: "A Rogue Trader offers rare supplies in exchange for safe passage",
          choices: [
            { id: "accept", text: "Accept the deal", effects: { supplies: 500, influence: 10 } },
            { id: "decline", text: "Decline politely", effects: { morale: 5 } },
            { id: "demand", text: "Demand tribute", effects: { supplies: 300, influence: -5 } }
          ],
          triggered: false
        },
        {
          id: "archaeotech_discovery",
          name: "Ancient Technology Cache",
          description: "Scout teams have discovered pre-Age of Strife technology",
          choices: [
            { id: "investigate", text: "Investigate thoroughly", effects: { research_points: 200, archaeotech_artifact: 1 } },
            { id: "quarantine", text: "Quarantine the site", effects: { morale: 10 } },
            { id: "exploit", text: "Exploit immediately", effects: { supplies: 300, research_points: 50 } }
          ],
          triggered: false
        }
      ],
      eventHistory: []
    };
    
    // Major Threat System - escalates based on player progress
    this.majorThreats = {
      orkWaaagh: { activated: false, strength: 0, location: null },
      chaosBlackCrusade: { activated: false, strength: 0, location: null },
      tyranidHiveFleet: { activated: false, strength: 0, location: null },
      eldarWarhost: { activated: false, strength: 0, location: null }
    };
    
    // Victory Conditions
    this.victoryConditions = {
      systemsControlled: 1,
      totalSystems: 20,
      majorThreatsDefeated: 0,
      keyRelicsSecured: 0,
      crusadeComplete: false
    };
  }
  
  generateGalaxy() {
    const systemTypes = ['Hive World', 'Forge World', 'Agri World', 'Death World', 'Feral World', 'Mining World', 'Naval Base'];
    const enemyFactions = ['Ork Clans', 'Chaos Cults', 'Eldar Corsairs', 'Tau Empire', 'Tyranid Splinter'];
    
    const systems = [];
    for (let i = 0; i < 20; i++) {
      const planets = Math.floor(Math.random() * 4) + 1;
      const systemPlanets = [];
      
      for (let p = 0; p < planets; p++) {
        const planetType = systemTypes[Math.floor(Math.random() * systemTypes.length)];
        const enemyPresence = Math.random() < 0.7 ? enemyFactions[Math.floor(Math.random() * enemyFactions.length)] : null;
        
        systemPlanets.push({
          id: `${i}-${p}`,
          name: `${String.fromCharCode(65 + i)}-${p + 1}`,
          type: planetType,
          archetype: planetType, // Add archetype for UI compatibility
          population: this.generatePopulationByType(planetType),
          enemy: enemyPresence,
          defenseLevel: Math.floor(Math.random() * 5) + 1,
          resources: this.generateResourcesByType(planetType),
          rebellion: Math.floor(Math.random() * 20), // 0-100 rebellion indicator
          keyStructures: this.generateStructuresByType(planetType)
        });
      }
      
      systems.push({
        id: i,
        name: `System ${String.fromCharCode(65 + i)}`,
        status: i === 0 ? "Controlled" : "Unexplored",
        planets: systemPlanets,
        threatLevel: this.calculateSystemThreat(systemPlanets),
        x: Math.random() * 700 + 50,
        y: Math.random() * 350 + 50,
        enemyFleets: i === 0 ? [] : this.generateEnemyFleets(systemPlanets)
      });
    }
    return systems;
  }
  
  generatePopulationByType(type) {
    const populations = {
      'Hive World': Math.floor(Math.random() * 50000000000) + 10000000000, // 10-60 billion
      'Forge World': Math.floor(Math.random() * 5000000000) + 1000000000,  // 1-6 billion
      'Agri World': Math.floor(Math.random() * 2000000000) + 500000000,    // 0.5-2.5 billion
      'Death World': Math.floor(Math.random() * 100000000) + 10000000,     // 10-110 million
      'Feral World': Math.floor(Math.random() * 50000000) + 5000000,       // 5-55 million
      'Mining World': Math.floor(Math.random() * 500000000) + 100000000,   // 100-600 million
      'Naval Base': Math.floor(Math.random() * 1000000) + 500000           // 0.5-1.5 million
    };
    return populations[type] || 1000000;
  }
  
  generateResourcesByType(type) {
    const resources = {
      'Hive World': { manpower: 1000, materials: 200, food: 50 },
      'Forge World': { materials: 800, tech: 300, manpower: 400 },
      'Agri World': { food: 1200, manpower: 300, materials: 100 },
      'Death World': { manpower: 600, materials: 150, food: 80 },
      'Feral World': { manpower: 400, food: 200, materials: 50 },
      'Mining World': { materials: 1000, manpower: 200, food: 100 },
      'Naval Base': { tech: 200, materials: 300, manpower: 150 }
    };
    return resources[type] || { manpower: 100, materials: 100, food: 100 };
  }
  
  generateStructuresByType(type) {
    const structures = {
      'Hive World': ['Manufactorums', 'Hab-blocks', 'Underhive Networks', 'Spaceports'],
      'Forge World': ['Forge Complexes', 'Tech-Shrines', 'Titan Manufactorums', 'STC Vaults'],
      'Agri World': ['Agricultural Zones', 'Food Processing Plants', 'Grain Silos', 'Livestock Pens'],
      'Death World': ['Fortress Monasteries', 'Training Grounds', 'Survivor Settlements', 'Wild Zones'],
      'Feral World': ['Tribal Settlements', 'Recruitment Camps', 'Sacred Groves', 'Beast Lairs'],
      'Mining World': ['Mining Complexes', 'Ore Processing', 'Deep Shafts', 'Refinery Stations'],
      'Naval Base': ['Orbital Docks', 'Fleet Command', 'Shipyards', 'Defense Platforms']
    };
    return structures[type] || ['Generic Facilities'];
  }
  
  calculateSystemThreat(planets) {
    let totalThreat = 0;
    planets.forEach(planet => {
      if (planet.enemy) totalThreat += planet.defenseLevel * 20;
      totalThreat += planet.rebellion;
    });
    
    if (totalThreat < 50) return "Low";
    if (totalThreat < 150) return "Medium";
    if (totalThreat < 300) return "High";
    return "Extreme";
  }
  
  generateEnemyFleets(planets) {
    const fleets = [];
    planets.forEach(planet => {
      if (planet.enemy && Math.random() < 0.4) {
        fleets.push({
          faction: planet.enemy,
          strength: planet.defenseLevel * 100 + Math.floor(Math.random() * 200),
          ships: Math.floor(Math.random() * 8) + 2
        });
      }
    });
    return fleets;
  }
  
  initializeFleet() {
    return {
      ships: [
        {
          id: 1,
          name: "Emperor's Wrath",
          class: "Astartes Battle Barge",
          crew: 5000,
          maxCrew: 5000,
          firepower: 90,
          armor: 85,
          speed: 45,
          hullIntegrity: 100,
          supplyLevel: 90,
          officers: [
            {
              name: "Captain Thaddeus",
              rank: "Captain",
              skills: ["Boarding Actions", "Fleet Command"],
              specialty: "Boarding Actions"
            }
          ]
        },
        {
          id: 2,
          name: "Iron Resolve", 
          class: "Astartes Strike Cruiser",
          crew: 2000,
          maxCrew: 2000,
          firepower: 75,
          armor: 70,
          speed: 65,
          hullIntegrity: 85,
          supplyLevel: 80,
          officers: [
            {
              name: "Captain Lucius",
              rank: "Captain", 
              skills: ["Fleet Tactics", "Navigation"],
              specialty: "Fleet Tactics"
            }
          ]
        },
        {
          id: 3,
          name: "Swift Justice",
          class: "Sword Class Frigate", 
          crew: 600,
          maxCrew: 800,
          firepower: 60,
          armor: 50,
          speed: 85,
          hullIntegrity: 40,
          supplyLevel: 60,
          officers: [
            {
              name: "Lt. Commander Voss",
              rank: "Lieutenant Commander",
              skills: ["Escort Tactics", "Speed"],
              specialty: "Escort Tactics"
            }
          ]
        }
      ],
      supplyEfficiency: 75
    };
  }
  
  initializePlanets() {
    // Start with home system controlled planets
    const homeSystem = this.galaxy.find(s => s.id === 0);
    const controlledPlanets = [];
    
    homeSystem.planets.forEach(planet => {
      planet.status = "Controlled";
      planet.rebellion = 0;
      planet.enemy = null;
      controlledPlanets.push(planet);
    });
    
    return controlledPlanets;
  }
  
  // Imperial Tithe and Supply System
  calculateImperialTithe() {
    let tithe = 0;
    this.galaxy.forEach(system => {
      if (system.status === 'Controlled') {
        system.planets.forEach(planet => {
          if (planet.status === 'Controlled') {
            // Base tithe based on planet type and population
            const populationTier = Math.floor(Math.log10(planet.population));
            tithe += populationTier * 10;
            
            // Additional tithe from productive worlds
            if (planet.type === 'Hive World') tithe += 50;
            if (planet.type === 'Forge World') tithe += 75;
            if (planet.type === 'Agri World') tithe += 30;
          }
        });
      }
    });
    return tithe;
  }
  
  // Private Sector Supply Management
  requestSupplyConvoy(targetSystem, resources) {
    const cost = this.calculateConvoyCost(targetSystem, resources);
    if (this.resources.imperial_tithe >= cost) {
      this.resources.imperial_tithe -= cost;
      // Convoy will arrive in 2-3 turns
      this.scheduleSupplyDelivery(targetSystem, resources, 2 + Math.floor(Math.random() * 2));
      return true;
    }
    return false;
  }
  
  save() {
    localStorage.setItem('astartes_save', JSON.stringify(this));
  }
  
  load() {
    const saved = localStorage.getItem('astartes_save');
    if (saved) {
      Object.assign(this, JSON.parse(saved));
    }
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameState;
}
