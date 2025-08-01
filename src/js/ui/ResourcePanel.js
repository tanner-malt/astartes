// ResourcePanel.js - Resource management and overview

class ResourcePanel {
  constructor(uiController) {
    this.ui = uiController;
    this.gameState = uiController.gameState;
  }
  
  render() {
    const panel = document.getElementById('panel-resources');
    panel.innerHTML = `
      <h2>Resource Overview</h2>
      <div class="resource-dashboard">
        <div class="resource-cards">
          <div class="resource-card promethium">
            <h3>Promethium</h3>
            <div class="resource-amount">${this.gameState.resources.promethium}</div>
            <div class="resource-description">Fuel for ships and vehicles</div>
          </div>
          <div class="resource-card ammunition">
            <h3>Ammunition</h3>
            <div class="resource-amount">${this.gameState.resources.ammunition}</div>
            <div class="resource-description">Ship weapons and ground forces</div>
          </div>
          <div class="resource-card provisions">
            <h3>Provisions</h3>
            <div class="resource-amount">${this.gameState.resources.provisions}</div>
            <div class="resource-description">Food, water, medical supplies</div>
          </div>
          <div class="resource-card mechanicum">
            <h3>Mechanicum</h3>
            <div class="resource-amount">${this.gameState.resources.mechanicum}</div>
            <div class="resource-description">Tech-priests and repair materials</div>
          </div>
          <div class="resource-card astartes">
            <h3>Astartes</h3>
            <div class="resource-amount">${this.gameState.resources.astartes}</div>
            <div class="resource-description">Space Marine personnel</div>
          </div>
          <div class="resource-card imperial-guard">
            <h3>Imperial Guard</h3>
            <div class="resource-amount">${this.gameState.resources.imperial_guard}</div>
            <div class="resource-description">Regular human forces</div>
          </div>
          <div class="resource-card imperial-tithe">
            <h3>Imperial Tithe</h3>
            <div class="resource-amount">${this.gameState.resources.imperial_tithe}</div>
            <div class="resource-description">Collected from controlled worlds</div>
          </div>
          <div class="resource-card morale">
            <h3>Fleet Morale</h3>
            <div class="resource-amount">${this.gameState.resources.morale}%</div>
            <div class="resource-status">${this.ui.getMoraleStatus()}</div>
          </div>
        </div>
        <div class="resource-breakdown">
          <h3>Resource Production</h3>
          <div class="breakdown-section">
            <h4>Controlled Systems Production</h4>
            <div class="production-summary">
              ${this.calculateTotalProduction()}
            </div>
          </div>
          <div class="breakdown-section">
            <h4>Fleet Maintenance Costs</h4>
            <ul>
              <li>Promethium: -${Math.floor(this.gameState.fleet.ships.length * 1.5)}/turn</li>
              <li>Provisions: -${Math.floor(this.gameState.fleet.ships.length * 2)}/turn</li>
            </ul>
          </div>
        </div>
        <div class="resource-actions">
          <h3>Resource Management</h3>
          <div class="action-grid">
            <button onclick="ui.actions.requestSupplies()" class="action-button">
              <span class="button-icon">📦</span>
              <span class="button-text">Request Supply Convoy</span>
              <span class="button-cost">Cost: 25 Imperial Tithe</span>
            </button>
            <button onclick="ui.actions.advanceTurn()" class="action-button advance-turn">
              <span class="button-icon">⏭️</span>
              <span class="button-text">Advance Turn</span>
              <span class="button-cost">Process resource generation</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  calculateTotalProduction() {
    const production = {
      promethium: 0,
      ammunition: 0,
      provisions: 0,
      mechanicum: 0,
      astartes: 0,
      imperial_guard: 0,
      imperial_tithe: 0
    };
    
    this.gameState.galaxy.filter(s => s.status === 'Controlled').forEach(system => {
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
    });
    
    return Object.entries(production)
      .filter(([_, amount]) => amount > 0)
      .map(([resource, amount]) => `<div class="production-item">+${amount} ${resource.replace('_', ' ')}/turn</div>`)
      .join('');
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResourcePanel;
}
