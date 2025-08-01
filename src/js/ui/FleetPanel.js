// FleetPanel.js - Fleet management and ship details

class FleetPanel {
  constructor(uiController) {
    this.ui = uiController;
    this.gameState = uiController.gameState;
  }
  
  render() {
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
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FleetPanel;
}
