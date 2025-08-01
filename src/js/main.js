// main.js - Entry point that ties everything together

// Game initialization
let gameState, ui, actions;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize game state
  gameState = new GameState();
  gameState.load();
  
  // Initialize UI controller
  ui = new UIController(gameState);
  
  // Initialize game actions
  actions = new GameActions(ui);
  ui.actions = actions;
  
  // Make actions globally accessible for onclick handlers
  window.gameActions = actions;
  
  // Add panels to UI controller
  ui.galaxyPanel = new GalaxyPanel(ui);
  ui.fleetPanel = new FleetPanel(ui);
  ui.resourcePanel = new ResourcePanel(ui);
  ui.achievementPanel = new AchievementPanel(ui);
  
  // Override render methods to use new panel classes
  const originalRenderPanel = ui.renderPanel.bind(ui);
  ui.renderPanel = function(panelType) {
    switch (panelType) {
      case 'galaxy':
        ui.galaxyPanel.render();
        break;
      case 'fleet':
        ui.fleetPanel.render();
        break;
      case 'resources':
        ui.resourcePanel.render();
        break;
      case 'achievements':
        ui.achievementPanel.render();
        break;
      case 'ship':
        ui.renderShipDetail();
        break;
      case 'planet':
        ui.renderPlanetManagement();
        break;
      case 'events':
        ui.renderEventLog();
        break;
      case 'research':
        ui.renderResearchPanel();
        break;
      default:
        originalRenderPanel(panelType);
    }
  };
  
  // Add action methods to global UI object for onclick handlers
  ui.selectSystem = (systemId) => actions.selectSystem(systemId);
  ui.invadeSystem = () => actions.invadeSystem();
  ui.moveFleet = () => actions.moveFleet();
  ui.scanSector = () => actions.scanSector();
  ui.requestSupplies = () => actions.requestSupplies();
  ui.repairFleet = () => actions.repairFleet();
  ui.resupplyFleet = () => actions.resupplyFleet();
  ui.recruitCrew = () => actions.recruitCrew();
  ui.improveLogistics = () => actions.improveLogistics();
  ui.boostMorale = () => actions.boostMorale();
  ui.requestReinforcements = () => actions.requestReinforcements();
  ui.researchTechnology = (tech) => actions.researchTechnology(tech);
  ui.advanceTurn = () => actions.advanceTurn();
  ui.generateRandomEvent = () => actions.generateRandomEvent();
  
  // Planet management actions
  ui.developPlanet = (systemId, planetId) => actions.developPlanet(systemId, planetId);
  ui.fortifyPlanet = (systemId, planetId) => actions.fortifyPlanet(systemId, planetId);
  ui.suppressRebellion = (systemId, planetId) => actions.suppressRebellion(systemId, planetId);
  
  // Auto-save every 30 seconds
  setInterval(() => gameState.save(), 30000);
  
  console.log('Astartes Crusade Game initialized successfully!');
});

// Add remaining render methods that weren't moved to separate panels yet
UIController.prototype.renderShipDetail = function() {
  const ship = this.selectedShip || this.gameState.fleet.ships[0];
  const panel = document.getElementById('panel-ship');
  panel.innerHTML = `
    <h2>Ship Detail View</h2>
    <div class="ship-detail">
      <div class="ship-header">
        <h3>${ship.name}</h3>
        <div class="ship-class">${ship.class}</div>
      </div>
      <div class="ship-systems">
        <div class="system-bar">
          <label>Hull Integrity:</label>
          <div class="progress-bar">
            <div class="progress" style="width: ${ship.hullIntegrity}%"></div>
          </div>
          <span>${ship.hullIntegrity}%</span>
        </div>
        <div class="system-bar">
          <label>Armor Rating:</label>
          <div class="progress-bar">
            <div class="progress" style="width: ${ship.armor}%"></div>
          </div>
          <span>${ship.armor}</span>
        </div>
        <div class="system-bar">
          <label>Firepower:</label>
          <div class="progress-bar">
            <div class="progress" style="width: ${ship.firepower}%"></div>
          </div>
          <span>${ship.firepower}</span>
        </div>
      </div>
      <div class="ship-crew">
        <h4>Crew: ${ship.crew.toLocaleString()}/${ship.maxCrew.toLocaleString()}</h4>
      </div>
    </div>
  `;
};

UIController.prototype.renderPlanetManagement = function() {
  const controlledSystems = this.gameState.galaxy.filter(s => s.status === 'Controlled' || s.status === 'Imperial');
  const panel = document.getElementById('panel-planet');
  
  panel.innerHTML = `
    <h2>🌍 Planet Management</h2>
    
    <div class="empire-overview">
      <div class="empire-stats">
        <div class="stat-card">
          <h3>${controlledSystems.length}</h3>
          <p>Controlled Systems</p>
        </div>
        <div class="stat-card">
          <h3>${controlledSystems.reduce((total, sys) => total + sys.planets.length, 0)}</h3>
          <p>Total Worlds</p>
        </div>
        <div class="stat-card">
          <h3>${Math.round(controlledSystems.reduce((total, sys) => total + sys.planets.reduce((p, planet) => p + planet.population, 0), 0) / 1000000)}</h3>
          <p>Population (Millions)</p>
        </div>
      </div>
    </div>
    
    <div class="controlled-systems">
      <h3>🏛️ Imperial Worlds</h3>
      <div class="system-grid">
        ${controlledSystems.map(system => `
          <div class="system-card">
            <div class="system-header">
              <h4>📍 System ${String.fromCharCode(65 + system.id)}</h4>
              <span class="system-status">${system.status}</span>
            </div>
            <div class="planet-list">
              ${system.planets.map(planet => `
                <div class="planet-item">
                  <div class="planet-info">
                    <strong>${planet.name}</strong>
                    <span class="planet-type">${planet.type}</span>
                  </div>
                  <div class="planet-stats">
                    <span class="population">👥 ${(planet.population / 1000000).toFixed(1)}M</span>
                    <span class="defense">🛡️ Defense: ${planet.defenseLevel}</span>
                  </div>
                  <div class="planet-resources">
                    ${Object.entries(planet.resources).map(([resource, amount]) => 
                      `<span class="resource-badge">${resource}: ${amount}</span>`
                    ).join('')}
                  </div>
                  ${planet.rebellion > 0 ? `
                    <div class="rebellion-warning">
                      ⚠️ Rebellion Risk: ${planet.rebellion}%
                      <button class="action-btn" onclick="ui.suppressRebellion('${system.id}', '${planet.id}')">
                        Suppress Unrest
                      </button>
                    </div>
                  ` : ''}
                  <div class="planet-actions">
                    <button class="develop-btn" onclick="ui.developPlanet('${system.id}', '${planet.id}')">
                      Develop Infrastructure
                    </button>
                    <button class="fortify-btn" onclick="ui.fortifyPlanet('${system.id}', '${planet.id}')">
                      Build Fortifications
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="development-queue">
      <h3>🏗️ Development Projects</h3>
      <div class="project-list">
        <div class="project-item">
          <strong>📡 Orbital Defense Grid</strong>
          <p>Constructing defensive satellites around key worlds</p>
          <div class="progress-bar">
            <div class="progress" style="width: 65%"></div>
          </div>
          <span>65% Complete</span>
        </div>
        <div class="project-item">
          <strong>⚙️ Forge Complex Expansion</strong>
          <p>Increasing manufacturing capacity on Forge Worlds</p>
          <div class="progress-bar">
            <div class="progress" style="width: 30%"></div>
          </div>
          <span>30% Complete</span>
        </div>
      </div>
    </div>
  `;
};

UIController.prototype.renderEventLog = function() {
  const panel = document.getElementById('panel-events');
  const activeEvents = this.gameState.eventSystem.activeEvents || [];
  const eventHistory = this.gameState.eventSystem.eventHistory || [];
  const narrativeDecisions = this.gameState.narrative.decisions || [];
  
  panel.innerHTML = `
    <h2>📖 Event/Story Log</h2>
    
    <div class="event-overview">
      <div class="event-stats">
        <div class="stat-card">
          <h3>${activeEvents.length}</h3>
          <p>Active Events</p>
        </div>
        <div class="stat-card">
          <h3>${narrativeDecisions.length}</h3>
          <p>Decisions Made</p>
        </div>
        <div class="stat-card">
          <h3>${this.gameState.turn}</h3>
          <p>Current Turn</p>
        </div>
      </div>
    </div>
    
    ${activeEvents.length > 0 ? `
      <div class="active-events">
        <h3>⚡ Active Events</h3>
        <div class="event-list">
          ${activeEvents.map(event => `
            <div class="event-card active">
              <div class="event-header">
                <h4>${event.name}</h4>
                <span class="event-turn">Turn ${event.triggeredTurn}</span>
              </div>
              <p class="event-description">${event.description}</p>
              <div class="event-choices">
                ${event.choices.map(choice => `
                  <button class="choice-btn" onclick="window.gameActions.makeNarrativeChoice('${event.id}', '${choice.id}')">
                    ${choice.text}
                  </button>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
    
    <div class="recent-events">
      <h3>📜 Recent Events</h3>
      <div class="event-list">
        ${this.gameState.events.length === 0 ? 
          '<p class="no-events">No recent events. Use the action buttons below to generate events...</p>' :
          this.gameState.events.slice(-5).reverse().map(event => `
            <div class="event-card ${event.type || 'general'}">
              <div class="event-header">
                <h4>${event.title}</h4>
                <span class="event-type">${event.type || 'Event'}</span>
              </div>
              <p class="event-description">${event.description}</p>
              ${event.timestamp ? `<small class="event-time">Turn ${this.gameState.turn}</small>` : ''}
            </div>
          `).join('')
        }
      </div>
    </div>
    
    <div class="campaign-progress">
      <h3>🏛️ Campaign Chronicle</h3>
      <div class="campaign-chapters">
        ${this.gameState.narrative.campaigns.map(campaign => `
          <div class="campaign-milestone ${campaign.completed ? 'completed' : 'active'}">
            <div class="milestone-icon">${campaign.completed ? '✅' : '⏳'}</div>
            <div class="milestone-info">
              <h4>${campaign.name}</h4>
              <div class="progress-bar">
                <div class="progress" style="width: ${campaign.progress}%"></div>
              </div>
              <span>${campaign.progress}% Complete</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="decision-history">
      <h3>🎯 Key Decisions</h3>
      <div class="decision-list">
        ${narrativeDecisions.length === 0 ? 
          '<p class="no-decisions">No major decisions made yet...</p>' :
          narrativeDecisions.slice(-3).map(decision => `
            <div class="decision-card">
              <div class="decision-turn">Turn ${decision.turn}</div>
              <p class="decision-text">${decision.description}</p>
            </div>
          `).join('')
        }
      </div>
    </div>
    
    <div class="event-actions">
      <button class="action-button" onclick="window.gameActions.generateRandomEvent()">
        🎲 Generate Random Event
      </button>
      <button class="action-button" onclick="window.gameActions.triggerNarrativeEvent('rogue_trader_encounter')">
        🚢 Rogue Trader Encounter
      </button>
      <button class="action-button" onclick="window.gameActions.triggerNarrativeEvent('archaeotech_discovery')">
      <button class="action-button" onclick="window.gameActions.triggerNarrativeEvent('archaeotech_discovery')">
        🏺 Archaeological Discovery
      </button>
      <button class="action-button primary" onclick="window.gameActions.advanceTurn()">
        ⏭️ Advance Turn
      </button>
    </div>
  `;
};

UIController.prototype.renderResearchPanel = function() {
  const panel = document.getElementById('panel-research');
  const researchTrees = this.gameState.researchTrees;
  
  panel.innerHTML = `
    <h2>🔬 Research & Development</h2>
    
    <div class="research-overview">
      <div class="research-stats">
        <div class="stat-card">
          <h3>${this.gameState.research.points}</h3>
          <p>Research Points</p>
        </div>
        <div class="stat-card">
          <h3>${this.gameState.research.completed.length}</h3>
          <p>Technologies</p>
        </div>
        <div class="stat-card">
          <h3>+${10 + Math.floor(this.gameState.galaxy.filter(s => s.status === 'Imperial').length * 2)}</h3>
          <p>Points/Turn</p>
        </div>
      </div>
    </div>
    
    <div class="research-trees">
      ${Object.entries(researchTrees).map(([treeKey, tree]) => `
        <div class="research-tree">
          <h3>${tree.name}</h3>
          <div class="technology-grid">
            ${Object.entries(tree.technologies).map(([techKey, tech]) => {
              const isAvailable = tree.unlocked.includes(techKey) || tech.unlocked;
              const canAfford = this.gameState.research.points >= tech.cost;
              const prerequisitesMet = tech.prerequisites.every(prereq => 
                tree.technologies[prereq] && tree.technologies[prereq].unlocked
              );
              
              return `
                <div class="tech-card ${tech.unlocked ? 'completed' : ''} ${isAvailable ? 'available' : 'locked'}">
                  <div class="tech-header">
                    <h4>${tech.name}</h4>
                    <span class="tech-cost">${tech.cost} RP</span>
                  </div>
                  <div class="tech-description">
                    ${this.getTechDescription(treeKey, techKey)}
                  </div>
                  ${tech.prerequisites.length > 0 ? `
                    <div class="prerequisites">
                      <small>Requires: ${tech.prerequisites.map(prereq => 
                        tree.technologies[prereq].name
                      ).join(', ')}</small>
                    </div>
                  ` : ''}
                  ${isAvailable && !tech.unlocked ? `
                    <button class="research-btn ${canAfford && prerequisitesMet ? 'enabled' : 'disabled'}" 
                            onclick="window.gameActions.researchTechnology('${treeKey}', '${techKey}')"
                            ${canAfford && prerequisitesMet ? '' : 'disabled'}>
                      ${canAfford && prerequisitesMet ? 'Research' : (prerequisitesMet ? 'Insufficient RP' : 'Prerequisites Required')}
                    </button>  
                  ` : ''}
                  ${tech.unlocked ? '<div class="completed-badge">✅ Completed</div>' : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="research-completed">
      <h3>🎓 Completed Research</h3>
      <div class="completed-list">
        ${this.gameState.research.completed.length === 0 ? 
          '<p class="no-research">No research completed yet. Begin your scientific endeavors above!</p>' :
          this.gameState.research.completed.map(completedTech => {
            const [treeKey, techKey] = completedTech.split('_');
            const tree = researchTrees[treeKey];
            const tech = tree ? tree.technologies[techKey] : null;
            return tech ? `
              <div class="completed-tech-item">
                <strong>${tech.name}</strong>
                <span class="tech-tree">${tree.name}</span>
              </div>
            ` : `<div class="completed-tech-item">${completedTech}</div>`;
          }).join('')
        }
      </div>
    </div>
  `;
};

UIController.prototype.getTechDescription = function(treeKey, techKey) {
  const descriptions = {
    military: {
      basic_weapons: "Standard Imperial weaponry patterns",
      advanced_weapons: "Improved targeting systems and firepower (+20% weapon damage)",
      plasma_technology: "Dangerous but powerful plasma weapons (+50% damage, improved reliability)",
      void_shields: "Energy shields that deflect incoming attacks (+30% armor)"
    },
    infrastructure: {
      basic_construction: "Standard construction techniques and materials",
      advanced_mining: "Improved resource extraction methods (+25% resource production)",
      orbital_platforms: "Space-based defensive and logistical installations"
    },
    xenoarchaeology: {
      artifact_analysis: "Study ancient xenos and human artifacts (+200 research points)",
      stc_recovery: "Recover Standard Template Constructs from the Dark Age",
      archaeotech: "Integrate ancient technology into Imperial systems (+40% all ship stats)"
    }
  };
  
  return descriptions[treeKey] && descriptions[treeKey][techKey] 
    ? descriptions[treeKey][techKey] 
    : "Advanced Imperial technology";
};


