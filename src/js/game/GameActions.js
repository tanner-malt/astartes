// GameActions.js - All game action methods and turn management

class GameActions {
  constructor(uiController) {
    this.ui = uiController;
    this.gameState = uiController.gameState;
  }
  
  // System Actions
  selectSystem(systemId) {
    this.ui.selectedSystemId = systemId;
    if (this.ui.currentPanel === 'galaxy') {
      const galaxyPanel = new GalaxyPanel(this.ui);
      galaxyPanel.render();
    }
  }
  
  invadeSystem() {
    if (this.ui.selectedSystemId !== null) {
      this.initiateInvasion(this.ui.selectedSystemId);
    }
  }
  
  moveFleet() {
    if (this.ui.selectedSystemId !== null && this.ui.selectedSystemId !== this.gameState.fleetLocation) {
      if (this.gameState.resources.promethium >= 10) {
        this.gameState.resources.promethium -= 10;
        this.gameState.fleetLocation = this.ui.selectedSystemId;
        this.ui.renderPanel(this.ui.currentPanel);
      }
    }
  }
  
  scanSector() {
    if (this.gameState.resources.promethium >= 5) {
      this.gameState.resources.promethium -= 5;
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
      this.ui.renderPanel(this.ui.currentPanel);
    }
  }
  
  requestSupplies() {
    if (this.gameState.resources.imperial_tithe >= 25) {
      this.gameState.resources.imperial_tithe -= 25;
      this.gameState.resources.provisions += 20;
      this.gameState.resources.ammunition += 15;
      this.gameState.resources.promethium += 10;
      this.ui.renderPanel(this.ui.currentPanel);
    }
  }
  
  initiateInvasion(systemId) {
    const system = this.gameState.galaxy.find(s => s.id === systemId);
    if (!system || system.status === 'Controlled') return;

    const fleetPower = this.gameState.fleet.ships.reduce((sum, ship) => 
      sum + (ship.firepower * (ship.hullIntegrity / 100) * (ship.crew / ship.maxCrew)), 0
    );
    
    const systemDefense = system.threatLevel === 'High' ? 150 : 
                         system.threatLevel === 'Medium' ? 100 : 50;
    
    const success = fleetPower > systemDefense;
    
    if (success) {
      system.status = 'Controlled';
      this.gameState.fleet.ships.forEach(ship => {
        ship.hullIntegrity = Math.max(20, ship.hullIntegrity - Math.random() * 20);
        ship.supplyLevel = Math.max(10, ship.supplyLevel - 15);
      });
      this.gameState.resources.morale += 10;
    } else {
      this.gameState.fleet.ships.forEach(ship => {
        ship.hullIntegrity = Math.max(10, ship.hullIntegrity - Math.random() * 40);
        ship.crew = Math.max(ship.maxCrew * 0.5, ship.crew - Math.random() * ship.maxCrew * 0.3);
      });
      this.gameState.resources.morale -= 15;
    }
    
    this.ui.renderPanel(this.ui.currentPanel);
  }
  
  // Fleet Management Actions
  repairFleet() {
    if (this.gameState.resources.mechanicum >= 50) {
      this.gameState.resources.mechanicum -= 50;
      this.gameState.fleet.ships.forEach(ship => {
        ship.hullIntegrity = Math.min(100, ship.hullIntegrity + 25);
      });
      this.ui.renderPanel(this.ui.currentPanel);
    }
  }

  resupplyFleet() {
    if (this.gameState.resources.provisions >= 30 && this.gameState.resources.ammunition >= 20) {
      this.gameState.resources.provisions -= 30;
      this.gameState.resources.ammunition -= 20;
      this.gameState.fleet.ships.forEach(ship => {
        ship.supplyLevel = Math.min(100, ship.supplyLevel + 30);
      });
      this.ui.renderPanel(this.ui.currentPanel);
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
      this.ui.renderPanel(this.ui.currentPanel);
    }
  }

  improveLogistics() {
    if (this.gameState.resources.mechanicum >= 40) {
      this.gameState.resources.mechanicum -= 40;
      this.gameState.fleet.supplyEfficiency = Math.min(100, this.gameState.fleet.supplyEfficiency + 10);
      this.ui.renderPanel(this.ui.currentPanel);
    }
  }

  boostMorale() {
    if (this.gameState.resources.provisions >= 20) {
      this.gameState.resources.provisions -= 20;
      this.gameState.resources.morale = Math.min(100, this.gameState.resources.morale + 15);
      this.ui.renderPanel(this.ui.currentPanel);
    }
  }

  requestReinforcements() {
    if (this.gameState.resources.imperial_tithe >= 100) {
      this.gameState.resources.imperial_tithe -= 100;
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
      this.ui.renderPanel(this.ui.currentPanel);
    }
  }
  
  // Research Actions
  researchTechnology(tech) {
    const cost = this.ui.getResearchCost(tech);
    if (this.gameState.research.points >= cost) {
      this.gameState.research.points -= cost;
      this.gameState.research.completed.push(tech);
      this.gameState.research.available = this.gameState.research.available.filter(t => t !== tech);
      this.ui.renderPanel('research');
    }
  }
  
  // Turn Management
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
    
    // Check achievements
    this.checkAchievements();
    
    // Random event chance
    if (Math.random() < 0.3) {
      this.generateRandomEvent();
    }
    
    // Save and refresh display
    this.gameState.save();
    this.ui.renderPanel(this.ui.currentPanel);
  }
  
  // Achievement System
  checkAchievements() {
    this.gameState.achievements.available.forEach(achievement => {
      if (!this.gameState.achievements.unlocked.includes(achievement.id)) {
        let currentProgress = 0;
        
        switch (achievement.id) {
          case "first_conquest":
            currentProgress = this.gameState.campaignObjectives.systemsControlled - 1;
            break;
          case "fleet_commander":
            currentProgress = this.gameState.fleet.ships.length;
            break;
          case "tech_master":
            currentProgress = this.gameState.research.completed.length;
            break;
          case "crusade_veteran":
            currentProgress = this.gameState.turn;
            break;
          case "emperor_champion":
            currentProgress = this.gameState.campaignObjectives.systemsControlled;
            break;
          case "relic_hunter":
            currentProgress = this.gameState.narrative.artifacts.length;
            break;
          case "logistics_master":
            // Check if supplies have been full for consecutive turns
            currentProgress = achievement.progress;
            break;
        }
        
        achievement.progress = currentProgress;
        
        if (currentProgress >= achievement.target) {
          this.unlockAchievement(achievement.id);
        }
      }
    });
  }
  
  unlockAchievement(achievementId) {
    if (!this.gameState.achievements.unlocked.includes(achievementId)) {
      this.gameState.achievements.unlocked.push(achievementId);
      const achievement = this.gameState.achievements.available.find(a => a.id === achievementId);
      
      // Show achievement notification
      this.gameState.events.push({
        id: Date.now(),
        title: "Achievement Unlocked!",
        description: `${achievement.name}: ${achievement.description}`,
        type: "achievement",
        timestamp: new Date().toISOString()
      });
      
      // Grant achievement rewards
      this.grantAchievementReward(achievementId);
    }
  }
  
  grantAchievementReward(achievementId) {
    const rewards = {
      "first_conquest": { experience: 100, influence: 50 },
      "fleet_commander": { requisition: 1000, influence: 100 },
      "tech_master": { research_points: 500, influence: 75 },
      "crusade_veteran": { morale: 20, requisition: 2000 },
      "emperor_champion": { influence: 200, morale: 30 },
      "relic_hunter": { research_points: 1000, influence: 150 },
      "logistics_master": { requisition: 1500, supplies: 1000 }
    };
    
    const reward = rewards[achievementId];
    if (reward) {
      Object.keys(reward).forEach(key => {
        if (this.gameState.resources[key] !== undefined) {
          this.gameState.resources[key] += reward[key];
        } else if (key === 'research_points') {
          this.gameState.research.points += reward[key];
        }
      });
    }
  }
  
  // Advanced Research System
  researchTechnology(treeType, techId) {
    const tree = this.gameState.researchTrees[treeType];
    const tech = tree.technologies[techId];
    
    if (!tech || tech.unlocked || this.gameState.research.points < tech.cost) {
      return false;
    }
    
    // Check prerequisites
    const prerequisitesMet = tech.prerequisites.every(prereq => 
      tree.technologies[prereq] && tree.technologies[prereq].unlocked
    );
    
    if (!prerequisitesMet) {
      return false;
    }
    
    // Research the technology
    this.gameState.research.points -= tech.cost;
    tech.unlocked = true;
    this.gameState.research.completed.push(`${treeType}_${techId}`);
    
    // Unlock dependent technologies
    Object.keys(tree.technologies).forEach(key => {
      const dependentTech = tree.technologies[key];
      if (dependentTech.prerequisites.includes(techId)) {
        // Make visible in research tree (but still requires research)
        tree.unlocked.push(key);
      }
    });
    
    // Apply technology effects
    this.applyTechnologyEffects(treeType, techId);
    
    this.gameState.events.push({
      id: Date.now(),
      title: "Research Complete",
      description: `Successfully researched ${tech.name}`,
      type: "research",
      timestamp: new Date().toISOString()
    });
    
    return true;
  }
  
  applyTechnologyEffects(treeType, techId) {
    const effects = {
      military: {
        advanced_weapons: () => {
          this.gameState.fleet.ships.forEach(ship => {
            ship.firepower = Math.floor(ship.firepower * 1.2);
          });
        },
        plasma_technology: () => {
          this.gameState.fleet.ships.forEach(ship => {
            ship.firepower = Math.floor(ship.firepower * 1.5);
            ship.condition = Math.max(80, ship.condition); // Improved reliability
          });
        },
        void_shields: () => {
          this.gameState.fleet.ships.forEach(ship => {
            ship.armor = Math.floor(ship.armor * 1.3);
          });
        }
      },
      infrastructure: {
        advanced_mining: () => {
          // Increase resource production from controlled systems
          this.gameState.galaxy.forEach(system => {
            if (system.status === 'Imperial') {
              system.planets.forEach(planet => {
                Object.keys(planet.resources).forEach(resource => {
                  planet.resources[resource] = Math.floor(planet.resources[resource] * 1.25);
                });
              });
            }
          });
        },
        orbital_platforms: () => {
          // Reduce invasion costs and improve system defense
          this.gameState.galaxy.forEach(system => {
            if (system.status === 'Imperial') {
              system.defenseBonus = (system.defenseBonus || 0) + 2;
            }
          });
        }
      },
      xenoarchaeology: {
        artifact_analysis: () => {
          this.gameState.research.points += 200;
        },
        stc_recovery: () => {
          // Unlock ability to find STC patterns
          this.gameState.narrative.stcHunting = true;
        },
        archaeotech: () => {
          // Major fleet improvements
          this.gameState.fleet.ships.forEach(ship => {
            ship.firepower = Math.floor(ship.firepower * 1.4);
            ship.armor = Math.floor(ship.armor * 1.3);
            ship.speed = Math.floor(ship.speed * 1.2);
          });
        }
      }
    };
    
    const treeEffects = effects[treeType];
    if (treeEffects && treeEffects[techId]) {
      treeEffects[techId]();
    }
  }
  
  // Enhanced Narrative System
  triggerNarrativeEvent(eventId) {
    const event = this.gameState.eventSystem.availableEvents.find(e => e.id === eventId);
    if (event && !event.triggered) {
      event.triggered = true;
      this.gameState.eventSystem.activeEvents.push({
        ...event,
        triggeredTurn: this.gameState.turn
      });
      
      this.gameState.events.push({
        id: Date.now(),
        title: event.name,
        description: event.description,
        type: "narrative",
        choices: event.choices,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  makeNarrativeChoice(eventId, choiceId) {
    const activeEvent = this.gameState.eventSystem.activeEvents.find(e => e.id === eventId);
    if (!activeEvent) return;
    
    const choice = activeEvent.choices.find(c => c.id === choiceId);
    if (!choice) return;
    
    // Apply choice effects
    Object.keys(choice.effects).forEach(key => {
      if (this.gameState.resources[key] !== undefined) {
        this.gameState.resources[key] += choice.effects[key];
      } else if (key === 'research_points') {
        this.gameState.research.points += choice.effects[key];
      } else if (key === 'archaeotech_artifact') {
        this.gameState.narrative.artifacts.push({
          id: Date.now(),
          name: "Ancient Archaeotech",
          description: "A relic from the Dark Age of Technology",
          effects: { research_bonus: 50 }
        });
      }
    });
    
    // Record the decision
    this.gameState.narrative.decisions.push({
      eventId: eventId,
      choiceId: choiceId,
      turn: this.gameState.turn,
      description: `${activeEvent.name}: ${choice.text}`
    });
    
    // Remove from active events
    this.gameState.eventSystem.activeEvents = this.gameState.eventSystem.activeEvents.filter(e => e.id !== eventId);
    
    // Add to history
    this.gameState.eventSystem.eventHistory.push({
      ...activeEvent,
      choiceMade: choice,
      resolvedTurn: this.gameState.turn
    });
  }
  
  // Officer Development
  promoteOfficer(officerType, officerId) {
    let officer;
    if (officerType === 'captain') {
      officer = this.gameState.officers.captains.find(c => c.name === officerId);
    } else if (officerType === 'admiral') {
      officer = this.gameState.officers.admirals.find(a => a.name === officerId);
    }
    
    if (officer && officer.experience >= officer.level * 100) {
      officer.level += 1;
      officer.experience -= officer.level * 100;
      
      // Improve skills
      Object.keys(officer.skills).forEach(skill => {
        officer.skills[skill] = Math.min(10, officer.skills[skill] + 1);
      });
      
      // Possibly gain new traits
      if (Math.random() < 0.3) {
        const availableTraits = ["Veteran", "Inspiring", "Tactical Genius", "Logistical Master"];
        const newTrait = availableTraits[Math.floor(Math.random() * availableTraits.length)];
        if (!officer.traits.includes(newTrait)) {
          officer.traits.push(newTrait);
        }
      }
    }
  }
  
  // Event Generation
  generateRandomEvent() {
    const events = [
      {
        id: Date.now(),
        title: "Distress Signal",
        description: "An Imperial transport is under attack by pirates.",
        type: "combat",
        choices: [
          { text: "Intervene", effect: { morale: 5, requisition: -10 } },
          { text: "Ignore", effect: { morale: -3 } }
        ]
      }
    ];
    this.gameState.events.push(events[0]);
    this.ui.renderPanel('events');
  }
  
  // Planet Management Actions
  developPlanet(systemId, planetId) {
    const system = this.gameState.galaxy.find(s => s.id == systemId);
    if (!system) return;
    
    const planet = system.planets.find(p => p.id === planetId);
    if (!planet) return;
    
    const cost = 200; // Mechanicum cost for development
    if (this.gameState.resources.mechanicum >= cost) {
      this.gameState.resources.mechanicum -= cost;
      
      // Improve planet resources
      Object.keys(planet.resources).forEach(resource => {
        planet.resources[resource] = Math.floor(planet.resources[resource] * 1.1);
      });
      
      // Reduce rebellion risk
      planet.rebellion = Math.max(0, planet.rebellion - 10);
      
      this.gameState.events.push({
        id: Date.now(),
        title: "Development Complete",
        description: `Infrastructure improvements on ${planet.name} have increased productivity.`,
        type: "development",
        timestamp: new Date().toISOString()
      });
      
      this.ui.renderPanel(this.ui.currentPanel);
    }
  }
  
  fortifyPlanet(systemId, planetId) {
    const system = this.gameState.galaxy.find(s => s.id == systemId);
    if (!system) return;
    
    const planet = system.planets.find(p => p.id === planetId);
    if (!planet) return;
    
    const cost = 150; // Ammunition and materials cost
    if (this.gameState.resources.ammunition >= cost) {
      this.gameState.resources.ammunition -= cost;
      
      // Improve defense level
      planet.defenseLevel = Math.min(10, planet.defenseLevel + 1);
      
      this.gameState.events.push({
        id: Date.now(),
        title: "Fortifications Complete",
        description: `Defense installations on ${planet.name} have been strengthened.`,
        type: "military",
        timestamp: new Date().toISOString()
      });
      
      this.ui.renderPanel(this.ui.currentPanel);
    }
  }
  
  suppressRebellion(systemId, planetId) {
    const system = this.gameState.galaxy.find(s => s.id == systemId);
    if (!system) return;
    
    const planet = system.planets.find(p => p.id === planetId);
    if (!planet) return;
    
    const cost = 100; // Imperial Guard deployment cost
    if (this.gameState.resources.imperial_guard >= cost) {
      this.gameState.resources.imperial_guard -= cost;
      
      // Reduce rebellion significantly
      planet.rebellion = Math.max(0, planet.rebellion - 25);
      
      // Small morale impact from harsh measures
      this.gameState.resources.morale = Math.max(0, this.gameState.resources.morale - 2);
      
      this.gameState.events.push({
        id: Date.now(),
        title: "Rebellion Suppressed",
        description: `Imperial Guard forces have restored order on ${planet.name}.`,
        type: "military",
        timestamp: new Date().toISOString()
      });
      
      this.ui.renderPanel(this.ui.currentPanel);
    }
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameActions;
}
