// GalaxyPanel.js - Galaxy map rendering and interaction

class GalaxyPanel {
  constructor(uiController) {
    this.ui = uiController;
    this.gameState = uiController.gameState;
  }
  
  render() {
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
          ${this.ui.selectedSystemId !== null ? this.renderSystemDetail(this.ui.selectedSystemId) : '<p>Select a system to view details</p>'}
        </div>
        <div class="map-controls">
          <button onclick="ui.invadeSystem()" ${this.ui.selectedSystemId === null || this.ui.selectedSystemId === this.gameState.fleetLocation ? 'disabled' : ''}>
            Invade Selected System
          </button>
          <button onclick="ui.moveFleet()" ${this.ui.selectedSystemId === null || this.ui.selectedSystemId === this.gameState.fleetLocation ? 'disabled' : ''}>
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
  }

  generateHyperspaceRoutes() {
    const routes = [];
    this.gameState.galaxy.forEach(system1 => {
      this.gameState.galaxy.forEach(system2 => {
        if (system1.id !== system2.id) {
          const distance = Math.sqrt(
            Math.pow(system1.x - system2.x, 2) + 
            Math.pow(system1.y - system2.y, 2)
          );
          if (distance < 120) {
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
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GalaxyPanel;
}
