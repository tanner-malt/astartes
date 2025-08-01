// UIController.js - Main UI management and panel switching

class UIController {
  constructor(gameState) {
    this.gameState = gameState;
    this.currentPanel = 'galaxy';
    this.selectedSystemId = null;
    this.selectedShip = null;
    this.selectedPlanet = null;
    
    this.initializePanelSwitching();
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
    }
  }
  
  // Helper methods
  calculateFleetStrength() {
    return this.gameState.fleet.ships.reduce((total, ship) => 
      total + (ship.hullIntegrity + ship.armor + ship.firepower) / 3, 0).toFixed(0);
  }
  
  calculateResourceIncome(type) {
    return this.gameState.planets.reduce((total, planet) => 
      total + (planet.resources[type] || 0), 0);
  }
  
  calculateFleetMaintenance() {
    return this.gameState.fleet.ships.length * 10;
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
      "Faster Engines": "Reduces movement time between systems",
      "Advanced Sensors": "Improves scanning and detection range",
      "Void Shields": "Provides additional protection against energy weapons"
    };
    return descriptions[tech] || "Advanced Imperial technology";
  }
  
  getResearchCost(tech) {
    const costs = {
      "Improved Armor": 50,
      "Enhanced Weapons": 75,
      "Faster Engines": 60,
      "Advanced Sensors": 40,
      "Void Shields": 80
    };
    return costs[tech] || 50;
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIController;
}
