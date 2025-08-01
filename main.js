// main.js - Complete game logic for Astartes

// Game State Management
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
    if (this.imperialTithe.accumulated >= cost) {
      this.imperialTithe.accumulated -= cost;
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

// UI Controllers
class UIController {
  constructor(gameState) {
    this.gameState = gameState;
    this.currentPanel = 'galaxy';
    this.initializePanelSwitching();
    this.selectedShip = null;
    this.selectedPlanet = null;
  }
  
  initializePanelSwitching() {
    const buttons = document.querySelectorAll('nav button');
    const panels = document.querySelectorAll('.panel');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        btn.classList.add('active');
        const panelType = btn.getAttribute('data-panel');
        this.currentPanel = panelType;
        
        const panel = document.getElementById(`panel-${panelType}`);
        if (panel) {
          panel.classList.add('active');
          this.renderPanel(panelType);
        }
      });
    });
    
    // Initialize with galaxy panel
    this.renderPanel('galaxy');
  }
  
  renderPanel(panelType) {
    switch (panelType) {
      case 'galaxy':
        this.renderGalaxyMap();
        break;
      case 'fleet':
        this.renderFleetView();
        break;
      case 'ship':
        this.renderShipDetail();
        break;
      case 'planet':
        this.renderPlanetManagement();
        break;
      case 'resources':
        this.renderResourceOverview();
        break;
      case 'events':
        this.renderEventLog();
        break;
      case 'research':
        this.renderResearchPanel();
        break;
      case 'diplomacy':
        this.renderDiplomacyPanel();
        break;
    }
  }
  
  renderGalaxyMap() {
    const panel = document.getElementById('panel-galaxy');
    const currentSystem = this.gameState.galaxy.find(s => s.id === this.gameState.fleetLocation);
    const controlledSystems = this.gameState.galaxy.filter(s => s.status === 'Controlled').length;
    
    panel.innerHTML = `
      <h2>Galaxy Map View</h2>
      <div class="galaxy-info">
        <div class="current-location">
          <h3>Fleet Location: ${currentSystem ? currentSystem.name : 'Unknown'}</h3>
          <p>Systems Controlled: ${controlledSystems}/${this.gameState.victoryConditions.totalSystems}</p>
          <p>Turn: ${this.gameState.turn}</p>
        </div>
        <div class="threat-indicators">
          ${this.renderMajorThreats()}
        </div>
      </div>
      <div class="galaxy-map">
        <div class="map-container">
          <!-- Background stars -->
          ${Array.from({length: 100}, (_, i) => {
            const x = Math.random() * 800;
            const y = Math.random() * 500;
            const size = Math.random() * 2 + 1;
            return `<div class="star" style="left: ${x}px; top: ${y}px; width: ${size}px; height: ${size}px;"></div>`;
          }).join('')}
          
          <!-- Hyperspace routes -->
          ${this.generateHyperspaceRoutes()}
          
          <!-- Star systems -->
          ${this.gameState.galaxy.map(system => `
            <div class="system ${system.status.toLowerCase()} ${system.id === this.gameState.fleetLocation ? 'fleet-present' : ''} threat-${system.threatLevel.toLowerCase()}" 
                 style="left: ${system.x}px; top: ${system.y}px;"
                 onclick="ui.selectSystem(${system.id})"
                 data-system-id="${system.id}"
                 title="${system.name} - ${system.planets.length} planets - Threat: ${system.threatLevel}">
              <div class="system-icon">
                <div class="system-core"></div>
                <div class="planet-count">${system.planets.length}</div>
                ${system.enemyFleets.length > 0 ? `<div class="enemy-fleet-indicator">⚡</div>` : ''}
              </div>
              <div class="system-info">
                <div class="system-name">${system.name}</div>
                <div class="system-status">${system.status}</div>
                ${system.threatLevel !== 'Low' ? `<div class="system-threat">${system.threatLevel}</div>` : ''}
              </div>
              ${system.id === this.gameState.fleetLocation ? '<div class="fleet-indicator">⚔️</div>' : ''}
            </div>
          `).join('')}
        </div>
        <div class="system-detail">
          ${this.selectedSystemId !== null ? this.renderSystemDetail(this.selectedSystemId) : '<p>Select a system to view details</p>'}
        </div>
        <div class="map-controls">
          <button onclick="ui.invadeSystem()" ${this.selectedSystemId === null || this.selectedSystemId === this.gameState.fleetLocation ? 'disabled' : ''}>
            Invade Selected System
          </button>
          <button onclick="ui.moveFleet()" ${this.selectedSystemId === null || this.selectedSystemId === this.gameState.fleetLocation ? 'disabled' : ''}>
            Move Fleet to Selected System
          </button>
          <button onclick="ui.scanSector()">Scan Sector</button>
          <button onclick="ui.requestSupplies()">Request Supply Convoy</button>
        </div>
        <div class="map-legend">
          <div class="legend-item"><div class="legend-color controlled"></div> Controlled</div>
          <div class="legend-item"><div class="legend-color explored"></div> Explored</div>
          <div class="legend-item"><div class="legend-color unexplored"></div> Unexplored</div>
          <div class="legend-item">⚔️ Fleet Location</div>
          <div class="legend-item">⚡ Enemy Fleets</div>
        </div>
      </div>
    `;
    
    this.selectedSystemId = null;
  }

  generateHyperspaceRoutes() {
    // Generate visual connections between nearby systems
    const routes = [];
    this.gameState.galaxy.forEach(system1 => {
      this.gameState.galaxy.forEach(system2 => {
        if (system1.id !== system2.id) {
          const distance = Math.sqrt(
            Math.pow(system1.x - system2.x, 2) + 
            Math.pow(system1.y - system2.y, 2)
          );
          if (distance < 120) { // Close systems have hyperspace routes
            routes.push(`
              <svg class="hyperspace-route" style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none;">
                <line x1="${system1.x + 15}" y1="${system1.y + 15}" 
                      x2="${system2.x + 15}" y2="${system2.y + 15}" 
                      stroke="rgba(0, 150, 255, 0.3)" 
                      stroke-width="1" 
                      stroke-dasharray="3,3"/>
              </svg>
            `);
          }
        }
      });
    });
    return routes.join('');
  }

  renderMajorThreats() {
    const threats = [];
    
    // Check for emerging major threats
    if (this.gameState.turn > 10) {
      const controlledSystems = this.gameState.galaxy.filter(s => s.status === 'Controlled').length;
      if (controlledSystems > 5) {
        threats.push('<div class="threat-alert">⚠️ Ork Waaagh! Activity Detected</div>');
      }
      if (controlledSystems > 10) {
        threats.push('<div class="threat-alert">💀 Chaos Counter-Crusade Forming</div>');
      }
      if (controlledSystems > 15) {
        threats.push('<div class="threat-alert">👁️ Tyranid Hive Fleet Approaching</div>');
      }
    }
    
    return threats.join('');
  }

  renderSystemDetail(systemId) {
    const system = this.gameState.galaxy.find(s => s.id === systemId);
    if (!system) return '';
    
    return `
      <div class="system-detail-panel">
        <h3>${system.name}</h3>
        <div class="system-stats">
          <p><strong>Status:</strong> ${system.status}</p>
          <p><strong>Threat Level:</strong> ${system.threatLevel}</p>
          <p><strong>Planets:</strong> ${system.planets.length}</p>
          ${system.enemyFleets.length > 0 ? `<p><strong>Enemy Fleets:</strong> ${system.enemyFleets.length}</p>` : ''}
        </div>
        <div class="planet-list">
          <h4>Planetary Bodies:</h4>
          ${system.planets.map(planet => `
            <div class="planet-item ${planet.archetype ? planet.archetype.toLowerCase().replace(' ', '-') : 'unknown'}">
              <div class="planet-name">${planet.name}</div>
              <div class="planet-type">${planet.archetype || planet.type}</div>
              <div class="planet-pop">Pop: ${(planet.population / 1000000).toFixed(0)}M</div>
              ${planet.archetype === 'Forge World' ? '<div class="planet-bonus">+Mechanicum Production</div>' : ''}
              ${planet.archetype === 'Hive World' ? '<div class="planet-bonus">+Imperial Guard Recruitment</div>' : ''}
              ${planet.archetype === 'Space Marine Recruitment World' ? '<div class="planet-bonus">+Astartes Recruitment</div>' : ''}
            </div>
          `).join('')}
        </div>
        ${system.status === 'Controlled' ? this.renderSystemProduction(system) : ''}
      </div>
    `;
  }

  renderSystemProduction(system) {
    const production = {
      promethium: 0,
      ammunition: 0,
      provisions: 0,
      mechanicum: 0,
      astartes: 0,
      imperial_guard: 0,
      imperial_tithe: 0
    };
    
    // Calculate production based on planet archetypes
    system.planets.forEach(planet => {
      switch(planet.archetype) {
        case 'Forge World':
          production.mechanicum += 2;
          production.ammunition += 3;
          break;
        case 'Hive World':
          production.imperial_guard += 3;
          production.imperial_tithe += 2;
          break;
        case 'Agri World':
          production.provisions += 4;
          break;
        case 'Mining World':
          production.promethium += 3;
          production.ammunition += 1;
          break;
        case 'Space Marine Recruitment World':
          production.astartes += 1;
          break;
        default:
          production.imperial_tithe += 1;
      }
    });
    
    return `
      <div class="system-production">
        <h4>System Production (per turn):</h4>
        <div class="production-grid">
          ${Object.entries(production).map(([resource, amount]) => 
            amount > 0 ? `<div class="production-item">+${amount} ${resource.replace('_', ' ')}</div>` : ''
          ).filter(Boolean).join('')}
        </div>
      </div>
    `;
  }
  
  renderFleetView() {
    const panel = document.getElementById('panel-fleet');
    const currentSystem = this.gameState.galaxy.find(s => s.id === this.gameState.fleetLocation);
    
    panel.innerHTML = `
      <h2>Fleet Management</h2>
      <div class="fleet-overview">
        <div class="fleet-status">
          <h3>Fleet Status</h3>
          <p><strong>Location:</strong> ${currentSystem ? currentSystem.name : 'Unknown'}</p>
          <p><strong>Fleet Size:</strong> ${this.gameState.fleet.ships.length} vessels</p>
          <p><strong>Total Crew:</strong> ${this.gameState.fleet.ships.reduce((sum, ship) => sum + ship.crew, 0).toLocaleString()}</p>
          <p><strong>Fleet Morale:</strong> <span class="morale-${this.gameState.resources.morale >= 80 ? 'high' : this.gameState.resources.morale >= 50 ? 'medium' : 'low'}">${this.gameState.resources.morale}%</span></p>
        </div>
        <div class="logistics-status">
          <h3>Logistics Status</h3>
          <div class="logistics-grid">
            <div class="logistics-item">
              <span class="resource-label">Promethium Reserves:</span>
              <span class="resource-value">${this.gameState.resources.promethium}</span>
            </div>
            <div class="logistics-item">
              <span class="resource-label">Ammunition Stocks:</span>
              <span class="resource-value">${this.gameState.resources.ammunition}</span>
            </div>
            <div class="logistics-item">
              <span class="resource-label">Provision Stores:</span>
              <span class="resource-value">${this.gameState.resources.provisions}</span>
            </div>
            <div class="logistics-item">
              <span class="resource-label">Supply Efficiency:</span>
              <span class="resource-value">${this.gameState.fleet.supplyEfficiency}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="fleet-roster">
        <h3>Fleet Roster</h3>
        <div class="ship-grid">
          ${this.gameState.fleet.ships.map(ship => `
            <div class="ship-card ${ship.class.toLowerCase().replace(' ', '-')}">
              <div class="ship-header">
                <h4>${ship.name}</h4>
                <span class="ship-class">${ship.class}</span>
              </div>
              <div class="ship-stats">
                <div class="stat-row">
                  <span>Hull Integrity:</span>
                  <div class="stat-bar">
                    <div class="stat-fill" style="width: ${ship.hullIntegrity}%; background-color: ${ship.hullIntegrity > 75 ? '#4CAF50' : ship.hullIntegrity > 50 ? '#FF9800' : '#F44336'}"></div>
                    <span class="stat-text">${ship.hullIntegrity}%</span>
                  </div>
                </div>
                <div class="stat-row">
                  <span>Crew:</span>
                  <span>${ship.crew.toLocaleString()}</span>
                </div>
                <div class="stat-row">
                  <span>Firepower:</span>
                  <span>${ship.firepower}</span>
                </div>
                <div class="stat-row">
                  <span>Armor:</span>
                  <span>${ship.armor}</span>
                </div>
                <div class="stat-row">
                  <span>Speed:</span>
                  <span>${ship.speed}</span>
                </div>
              </div>
              <div class="ship-officers">
                <h5>Command Staff</h5>
                ${ship.officers.map(officer => `
                  <div class="officer-card">
                    <div class="officer-info">
                      <span class="officer-name">${officer.name}</span>
                      <span class="officer-rank">${officer.rank}</span>
                    </div>
                    <div class="officer-skills">
                      ${officer.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                    <div class="officer-specialty">
                      <em>${officer.specialty}</em>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="ship-status">
                <div class="status-indicators">
                  ${ship.supplyLevel < 50 ? '<span class="status-warning">⚠️ Low Supplies</span>' : ''}
                  ${ship.hullIntegrity < 75 ? '<span class="status-warning">🔧 Needs Repairs</span>' : ''}
                  ${ship.crew < ship.maxCrew * 0.8 ? '<span class="status-warning">👥 Understaffed</span>' : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="fleet-actions">
        <h3>Fleet Commands</h3>
        <div class="action-grid">
          <button onclick="ui.repairFleet()" class="action-button repair">
            <span class="button-icon">🔧</span>
            <span class="button-text">Repair Fleet</span>
            <span class="button-cost">Cost: 50 Mechanicum</span>
          </button>
          <button onclick="ui.resupplyFleet()" class="action-button resupply">
            <span class="button-icon">📦</span>
            <span class="button-text">Resupply Fleet</span>
            <span class="button-cost">Cost: 30 Provisions, 20 Ammunition</span>
          </button>
          <button onclick="ui.recruitCrew()" class="action-button recruit">
            <span class="button-icon">👥</span>
            <span class="button-text">Recruit Crew</span>
            <span class="button-cost">Cost: 25 Imperial Guard</span>
          </button>
          <button onclick="ui.improveLogistics()" class="action-button logistics">
            <span class="button-icon">⚙️</span>
            <span class="button-text">Improve Logistics</span>
            <span class="button-cost">Cost: 40 Mechanicum</span>
          </button>
          <button onclick="ui.boostMorale()" class="action-button morale">
            <span class="button-icon">🎖️</span>
            <span class="button-text">Boost Morale</span>
            <span class="button-cost">Cost: 20 Provisions</span>
          </button>
          <button onclick="ui.requestReinforcements()" class="action-button reinforcements">
            <span class="button-icon">🚀</span>
            <span class="button-text">Request Reinforcements</span>
            <span class="button-cost">Cost: 100 Imperial Tithe</span>
          </button>
        </div>
      </div>
    `;
  }
  
  renderShipDetail() {
    const ship = this.selectedShip || this.gameState.fleet[0];
    const panel = document.getElementById('panel-ship');
    panel.innerHTML = `
      <h2>Ship Detail View</h2>
      <div class="ship-detail">
        <div class="ship-header">
          <h3>${ship.name}</h3>
          <div class="ship-type">${ship.type}</div>
          <div class="ship-class">${ship.class || ship.type}</div>
        </div>
        <div class="ship-systems">
          <div class="system-bar">
            <label>Hull Integrity:</label>
            <div class="progress-bar">
              <div class="progress" style="width: ${ship.health}%"></div>
            </div>
            <span>${ship.health}%</span>
          </div>
          <div class="system-bar">
            <label>Armor Rating:</label>
            <div class="progress-bar">
              <div class="progress" style="width: ${ship.armor}%"></div>
            </div>
            <span>${ship.armor}</span>
          </div>
          <div class="system-bar">
            <label>Weapon Systems:</label>
            <div class="progress-bar">
              <div class="progress" style="width: ${ship.weapons}%"></div>
            </div>
            <span>${ship.weapons}</span>
          </div>
        </div>
        <div class="ship-crew">
          <h4>Crew: ${ship.crew.toLocaleString()}</h4>
          <div>Status: ${ship.status}</div>
        </div>
        <div class="ship-actions">
          <button onclick="ui.repairShip(${ship.id})">Repair Ship</button>
          <button onclick="ui.upgradeShip(${ship.id})">Upgrade Systems</button>
          <button onclick="ui.reassignCrew(${ship.id})">Reassign Crew</button>
        </div>
      </div>
    `;
  }
  
  renderPlanetManagement() {
    const panel = document.getElementById('panel-planet');
    panel.innerHTML = `
      <h2>Planet Management View</h2>
      <div class="planet-overview">
        ${this.gameState.planets.map(planet => `
          <div class="planet-card" onclick="ui.selectPlanet(${planet.id})">
            <h3>${planet.name}</h3>
            <div class="planet-info">
              <div>System: ${planet.system}</div>
              <div>Status: ${planet.status}</div>
              <div>Population: ${planet.population.toLocaleString()}</div>
            </div>
            <div class="planet-stats">
              <div class="stat-bar">
                <label>Development:</label>
                <div class="progress-bar">
                  <div class="progress" style="width: ${planet.development}%"></div>
                </div>
                <span>${planet.development}%</span>
              </div>
              <div class="stat-bar">
                <label>Defenses:</label>
                <div class="progress-bar">
                  <div class="progress" style="width: ${planet.defenses}%"></div>
                </div>
                <span>${planet.defenses}%</span>
              </div>
            </div>
            <div class="planet-resources">
              <div>Requisition: +${planet.resources.requisition}/turn</div>
              <div>Supplies: +${planet.resources.supplies}/turn</div>
            </div>
            <div class="planet-actions">
              <button onclick="ui.developPlanet(${planet.id})">Develop</button>
              <button onclick="ui.fortifyPlanet(${planet.id})">Fortify</button>
            </div>
          </div>
        `).join('')}
        <div class="planet-management-actions">
          <button onclick="ui.colonizeNewPlanet()">Colonize New World</button>
          <button onclick="ui.globalDevelopment()">Global Development</button>
        </div>
      </div>
    `;
  }
  
  renderResourceOverview() {
    const panel = document.getElementById('panel-resources');
    panel.innerHTML = `
      <h2>Resource Overview</h2>
      <div class="resource-dashboard">
        <div class="resource-cards">
          <div class="resource-card">
            <h3>Requisition</h3>
            <div class="resource-amount">${this.gameState.resources.requisition}</div>
            <div class="resource-change">+${this.calculateResourceIncome('requisition')}/turn</div>
          </div>
          <div class="resource-card">
            <h3>Supplies</h3>
            <div class="resource-amount">${this.gameState.resources.supplies}</div>
            <div class="resource-change">+${this.calculateResourceIncome('supplies')}/turn</div>
          </div>
          <div class="resource-card">
            <h3>Morale</h3>
            <div class="resource-amount">${this.gameState.resources.morale}%</div>
            <div class="resource-status">${this.getMoraleStatus()}</div>
          </div>
          <div class="resource-card">
            <h3>Influence</h3>
            <div class="resource-amount">${this.gameState.resources.influence}</div>
            <div class="resource-change">+${this.calculateResourceIncome('influence')}/turn</div>
          </div>
        </div>
        <div class="resource-breakdown">
          <h3>Resource Breakdown</h3>
          <div class="breakdown-section">
            <h4>Income Sources</h4>
            <ul>
              ${this.gameState.planets.map(planet => 
                `<li>${planet.name}: +${planet.resources.requisition} Req, +${planet.resources.supplies} Sup</li>`
              ).join('')}
            </ul>
          </div>
          <div class="breakdown-section">
            <h4>Expenses</h4>
            <ul>
              <li>Fleet Maintenance: -${this.calculateFleetMaintenance()} Req/turn</li>
              <li>Planetary Upkeep: -${this.calculatePlanetaryUpkeep()} Supplies/turn</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }
  
  renderEventLog() {
    const panel = document.getElementById('panel-events');
    panel.innerHTML = `
      <h2>Event/Story Log</h2>
      <div class="event-log">
        <div class="current-events">
          <h3>Current Events</h3>
          ${this.gameState.events.length === 0 ? 
            '<p>No current events. The galaxy awaits your next move...</p>' :
            this.gameState.events.map(event => `
              <div class="event-card ${event.type}">
                <h4>${event.title}</h4>
                <p>${event.description}</p>
                <div class="event-choices">
                  ${event.choices.map((choice, index) => 
                    `<button onclick="ui.makeChoice(${event.id}, ${index})">${choice.text}</button>`
                  ).join('')}
                </div>
              </div>
            `).join('')
          }
        </div>
        <div class="story-progress">
          <h3>Campaign Progress</h3>
          <div class="progress-tracker">
            <div class="milestone completed">Crusade Begins</div>
            <div class="milestone current">First System Secured</div>
            <div class="milestone locked">Establish Forward Base</div>
            <div class="milestone locked">Major Enemy Encounter</div>
            <div class="milestone locked">Crusade's End</div>
          </div>
        </div>
        <div class="event-actions">
          <button onclick="ui.generateRandomEvent()">Generate Event</button>
          <button onclick="ui.advanceTurn()">Advance Turn</button>
        </div>
      </div>
    `;
  }
  
  renderResearchPanel() {
    const panel = document.getElementById('panel-research');
    panel.innerHTML = `
      <h2>Research/Upgrades Panel</h2>
      <div class="research-overview">
        <div class="research-points">
          <h3>Research Points: ${this.gameState.research.points}</h3>
        </div>
        <div class="available-research">
          <h3>Available Technologies</h3>
          ${this.gameState.research.available.map((tech, index) => `
            <div class="research-card">
              <h4>${tech}</h4>
              <p>${this.getResearchDescription(tech)}</p>
              <div class="research-cost">Cost: ${this.getResearchCost(tech)} RP</div>
              <button onclick="ui.researchTechnology('${tech}')" 
                      ${this.gameState.research.points >= this.getResearchCost(tech) ? '' : 'disabled'}>
                Research
              </button>
            </div>
          `).join('')}
        </div>
        <div class="completed-research">
          <h3>Completed Research</h3>
          ${this.gameState.research.completed.length === 0 ? 
            '<p>No research completed yet.</p>' :
            this.gameState.research.completed.map(tech => `
              <div class="completed-tech">${tech}</div>
            `).join('')
          }
        </div>
      </div>
    `;
  }
  
  renderDiplomacyPanel() {
    const panel = document.getElementById('panel-diplomacy');
    panel.innerHTML = `
      <h2>Diplomacy/Intel Panel</h2>
      <div class="diplomacy-overview">
        <div class="faction-relations">
          <h3>Faction Relations</h3>
          ${this.gameState.diplomacy.factions.map(faction => `
            <div class="faction-card">
              <h4>${faction.name}</h4>
              <div class="relationship-bar">
                <label>Relationship:</label>
                <div class="progress-bar ${faction.relationship < 0 ? 'hostile' : 'friendly'}">
                  <div class="progress" style="width: ${Math.abs(faction.relationship)}%"></div>
                </div>
                <span>${faction.relationship}</span>
              </div>
              <div class="threat-level">Threat Level: ${faction.threat}</div>
              <div class="faction-actions">
                <button onclick="ui.negotiateWithFaction('${faction.name}')">Negotiate</button>
                <button onclick="ui.gatherIntel('${faction.name}')">Gather Intel</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="intel-reports">
          <h3>Intelligence Reports</h3>
          <div class="intel-list">
            <div class="intel-item">
              <h4>Enemy Fleet Movements</h4>
              <p>Ork fleet spotted in System C. Estimated 5 ships.</p>
            </div>
            <div class="intel-item">
              <h4>Rebellion Activity</h4>
              <p>Chaos cult activity detected on Throne's Gate. Recommend investigation.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  
  generateHyperspaceRoutes() {
    let routes = '';
    for (let i = 0; i < this.gameState.galaxy.length - 1; i++) {
      const system1 = this.gameState.galaxy[i];
      const system2 = this.gameState.galaxy[i + 1];
      
      // Only show routes between nearby systems
      const distance = Math.sqrt(Math.pow(system2.x - system1.x, 2) + Math.pow(system2.y - system1.y, 2));
      if (distance < 200) {
        routes += `<div class="hyperspace-route" style="
          left: ${Math.min(system1.x, system2.x) + 40}px; 
          top: ${Math.min(system1.y, system2.y) + 40}px;
          width: ${Math.abs(system2.x - system1.x)}px;
          height: 2px;
          transform: rotate(${Math.atan2(system2.y - system1.y, system2.x - system1.x) * 180 / Math.PI}deg);
          transform-origin: 0 0;
        "></div>`;
      }
    }
    return routes;
  }
  
  // Helper methods
  calculateFleetStrength() {
    return this.gameState.fleet.reduce((total, ship) => 
      total + (ship.health + ship.armor + ship.weapons) / 3, 0).toFixed(0);
  }
  
  calculateResourceIncome(type) {
    return this.gameState.planets.reduce((total, planet) => 
      total + (planet.resources[type] || 0), 0);
  }
  
  calculateFleetMaintenance() {
    return this.gameState.fleet.length * 10;
  }
  
  calculatePlanetaryUpkeep() {
    return this.gameState.planets.length * 5;
  }
  
  getMoraleStatus() {
    const morale = this.gameState.resources.morale;
    if (morale >= 80) return "Excellent";
    if (morale >= 60) return "Good";
    if (morale >= 40) return "Fair";
    if (morale >= 20) return "Poor";
    return "Critical";
  }
  
  getResearchDescription(tech) {
    const descriptions = {
      "Improved Armor": "Increases ship armor rating by 10%",
      "Enhanced Weapons": "Increases weapon damage by 15%",
      "Faster Engines": "Reduces movement time between systems"
    };
    return descriptions[tech] || "Advanced Imperial technology";
  }
  
  getResearchCost(tech) {
    const costs = {
      "Improved Armor": 50,
      "Enhanced Weapons": 75,
      "Faster Engines": 60
    };
    return costs[tech] || 50;
  }
  
  // Action methods
  selectSystem(systemId) {
    this.selectedSystemId = systemId;
    // Update visual selection
    document.querySelectorAll('.system').forEach(s => s.classList.remove('selected'));
    document.querySelector(`[data-system-id="${systemId}"]`).classList.add('selected');
    console.log(`Selected system ${systemId}`);
  }
  
  exploreSystem() {
    if (this.selectedSystemId !== null && this.selectedSystemId === this.gameState.fleetLocation) {
      const system = this.gameState.galaxy.find(s => s.id === this.selectedSystemId);
      if (system.status === 'Unexplored') {
        system.status = 'Explored';
        this.gameState.resources.requisition += 50;
        this.generateRandomEvent();
      }
      this.renderGalaxyMap();
    }
  }
  
  moveFleet() {
    if (this.selectedSystemId !== null && this.selectedSystemId !== this.gameState.fleetLocation) {
      this.gameState.fleetLocation = this.selectedSystemId;
      this.gameState.resources.supplies -= 25; // Movement cost
      this.renderGalaxyMap();
      this.generateRandomEvent();
    }
  }
  
  scanSector() {
    // Reveal nearby systems
    const currentSystem = this.gameState.galaxy.find(s => s.id === this.gameState.fleetLocation);
    this.gameState.galaxy.forEach(system => {
      const distance = Math.sqrt(Math.pow(system.x - currentSystem.x, 2) + Math.pow(system.y - currentSystem.y, 2));
      if (distance < 150 && system.status === 'Unexplored') {
        system.status = 'Scanned';
      }
    });
    this.gameState.resources.influence += 5;
    this.renderGalaxyMap();
  }
  
  selectShip(shipId) {
    this.selectedShip = this.gameState.fleet.find(s => s.id === shipId);
    this.renderShipDetail();
  }
  
  selectPlanet(planetId) {
    this.selectedPlanet = this.gameState.planets.find(p => p.id === planetId);
  }
  
  generateRandomEvent() {
    const events = [
      {
        id: Date.now(),
        title: "Distress Signal",
        description: "A Imperial transport is under attack by pirates.",
        type: "combat",
        choices: [
          { text: "Intervene", effect: { morale: 5, requisition: -10 } },
          { text: "Ignore", effect: { morale: -3 } }
        ]
      }
    ];
    this.gameState.events.push(events[0]);
    this.renderEventLog();
  }
  
  advanceTurn() {
    this.gameState.turn += 1;
    
    // Process resource production from controlled systems
    this.gameState.galaxy.filter(s => s.status === 'Controlled').forEach(system => {
      system.planets.forEach(planet => {
        switch(planet.archetype) {
          case 'Forge World':
            this.gameState.resources.mechanicum += 2;
            this.gameState.resources.ammunition += 3;
            break;
          case 'Hive World':
            this.gameState.resources.imperial_guard += 3;
            this.gameState.resources.imperial_tithe += 2;
            break;
          case 'Agri World':
            this.gameState.resources.provisions += 4;
            break;
          case 'Mining World':
            this.gameState.resources.promethium += 3;
            this.gameState.resources.ammunition += 1;
            break;
          case 'Space Marine Recruitment World':
            this.gameState.resources.astartes += 1;
            break;
          default:
            this.gameState.resources.imperial_tithe += 1;
        }
      });
    });
    
    // Fleet maintenance costs
    const fleetSize = this.gameState.fleet.ships.length;
    this.gameState.resources.promethium = Math.max(0, this.gameState.resources.promethium - Math.floor(fleetSize * 1.5));
    this.gameState.resources.provisions = Math.max(0, this.gameState.resources.provisions - Math.floor(fleetSize * 2));
    
    // Fleet degradation if insufficient supplies
    if (this.gameState.resources.provisions < fleetSize || this.gameState.resources.promethium < fleetSize) {
      this.gameState.resources.morale = Math.max(0, this.gameState.resources.morale - 5);
      this.gameState.fleet.ships.forEach(ship => {
        ship.supplyLevel = Math.max(0, ship.supplyLevel - 10);
      });
    }
    
    // Research points generation
    this.gameState.research.points += 10;
    
    // Check for victory condition
    const controlledSystems = this.gameState.galaxy.filter(s => s.status === 'Controlled').length;
    if (controlledSystems >= this.gameState.victoryConditions.totalSystems) {
      alert('Victory! You have conquered the galaxy for the Emperor!');
    }
    
    // Save and refresh display
    this.gameState.save();
    this.renderPanel(this.currentPanel);
  }
  
  researchTechnology(tech) {
    const cost = this.getResearchCost(tech);
    if (this.gameState.research.points >= cost) {
      this.gameState.research.points -= cost;
      this.gameState.research.completed.push(tech);
      this.gameState.research.available = this.gameState.research.available.filter(t => t !== tech);
      this.renderResearchPanel();
    }
  }

  // Fleet Management Actions
  repairFleet() {
    if (this.gameState.resources.mechanicum >= 50) {
      this.gameState.resources.mechanicum -= 50;
      this.gameState.fleet.ships.forEach(ship => {
        ship.hullIntegrity = Math.min(100, ship.hullIntegrity + 25);
      });
      this.renderFleetView();
      this.renderResourceOverview();
    }
  }

  resupplyFleet() {
    if (this.gameState.resources.provisions >= 30 && this.gameState.resources.ammunition >= 20) {
      this.gameState.resources.provisions -= 30;
      this.gameState.resources.ammunition -= 20;
      this.gameState.fleet.ships.forEach(ship => {
        ship.supplyLevel = Math.min(100, ship.supplyLevel + 30);
      });
      this.renderFleetView();
      this.renderResourceOverview();
    }
  }

  recruitCrew() {
    if (this.gameState.resources.imperial_guard >= 25) {
      this.gameState.resources.imperial_guard -= 25;
      this.gameState.fleet.ships.forEach(ship => {
        if (ship.crew < ship.maxCrew) {
          ship.crew = Math.min(ship.maxCrew, ship.crew + Math.floor(ship.maxCrew * 0.1));
        }
      });
      this.renderFleetView();
      this.renderResourceOverview();
    }
  }

  improveLogistics() {
    if (this.gameState.resources.mechanicum >= 40) {
      this.gameState.resources.mechanicum -= 40;
      this.gameState.fleet.supplyEfficiency = Math.min(100, this.gameState.fleet.supplyEfficiency + 10);
      this.renderFleetView();
      this.renderResourceOverview();
    }
  }

  boostMorale() {
    if (this.gameState.resources.provisions >= 20) {
      this.gameState.resources.provisions -= 20;
      this.gameState.resources.morale = Math.min(100, this.gameState.resources.morale + 15);
      this.renderFleetView();
      this.renderResourceOverview();
    }
  }

  requestReinforcements() {
    if (this.gameState.resources.imperial_tithe >= 100) {
      this.gameState.resources.imperial_tithe -= 100;
      // Add a new ship to the fleet
      const reinforcementShips = [
        {
          name: "Sword of Retribution",
          class: "Sword Class Frigate",
          crew: 26000,
          maxCrew: 26000,
          firepower: 45,
          armor: 30,
          speed: 85,
          hullIntegrity: 100,
          supplyLevel: 80,
          officers: [
            {
              name: "Captain Valerius Thorne",
              rank: "Captain",
              skills: ["Navigation", "Void Warfare"],
              specialty: "Fast Attack Tactics"
            }
          ]
        }
      ];
      this.gameState.fleet.ships.push(reinforcementShips[0]);
      this.renderFleetView();
      this.renderResourceOverview();
    }
  }

  // Galaxy Map Actions
  invadeSystem() {
    if (this.selectedSystemId !== null) {
      this.initiateInvasion(this.selectedSystemId);
    }
  }

  moveFleet() {
    if (this.selectedSystemId !== null && this.selectedSystemId !== this.gameState.fleetLocation) {
      // Check if fleet has enough promethium for warp travel
      if (this.gameState.resources.promethium >= 10) {
        this.gameState.resources.promethium -= 10;
        this.gameState.fleetLocation = this.selectedSystemId;
        this.renderGalaxyMap();
        this.renderResourceOverview();
      }
    }
  }

  scanSector() {
    if (this.gameState.resources.promethium >= 5) {
      this.gameState.resources.promethium -= 5;
      // Reveal information about nearby systems
      this.gameState.galaxy.forEach(system => {
        if (system.status === 'Unexplored') {
          const distance = Math.sqrt(
            Math.pow(system.x - this.gameState.galaxy.find(s => s.id === this.gameState.fleetLocation).x, 2) +
            Math.pow(system.y - this.gameState.galaxy.find(s => s.id === this.gameState.fleetLocation).y, 2)
          );
          if (distance < 150) {
            system.status = 'Explored';
          }
        }
      });
      this.renderGalaxyMap();
    }
  }

  requestSupplies() {
    if (this.gameState.resources.imperial_tithe >= 25) {
      this.gameState.resources.imperial_tithe -= 25;
      this.gameState.resources.provisions += 20;
      this.gameState.resources.ammunition += 15;
      this.gameState.resources.promethium += 10;
      this.renderResourceOverview();
    }
  }

  initiateInvasion(systemId) {
    const system = this.gameState.galaxy.find(s => s.id === systemId);
    if (!system || system.status === 'Controlled') return;

    // Calculate combat odds based on fleet strength vs system defenses
    const fleetPower = this.gameState.fleet.ships.reduce((sum, ship) => 
      sum + (ship.firepower * (ship.hullIntegrity / 100) * (ship.crew / ship.maxCrew)), 0
    );
    
    const systemDefense = system.threatLevel === 'High' ? 150 : 
                         system.threatLevel === 'Medium' ? 100 : 50;
    
    const success = fleetPower > systemDefense;
    
    if (success) {
      system.status = 'Controlled';
      // Damage fleet based on resistance
      this.gameState.fleet.ships.forEach(ship => {
        ship.hullIntegrity = Math.max(20, ship.hullIntegrity - Math.random() * 20);
        ship.supplyLevel = Math.max(10, ship.supplyLevel - 15);
      });
      this.gameState.resources.morale += 10;
    } else {
      // Heavy losses on failed invasion
      this.gameState.fleet.ships.forEach(ship => {
        ship.hullIntegrity = Math.max(10, ship.hullIntegrity - Math.random() * 40);
        ship.crew = Math.max(ship.maxCrew * 0.5, ship.crew - Math.random() * ship.maxCrew * 0.3);
      });
      this.gameState.resources.morale -= 15;
    }
    
    this.renderGalaxyMap();
    this.renderFleetView();
    this.renderResourceOverview();
  }

  selectSystem(systemId) {
    this.selectedSystemId = systemId;
    this.renderGalaxyMap();
  }
}

// Initialize the game
let gameState, ui;

document.addEventListener('DOMContentLoaded', () => {
  gameState = new GameState();
  gameState.load();
  ui = new UIController(gameState);
  
  // Auto-save every 30 seconds
  setInterval(() => gameState.save(), 30000);
});
