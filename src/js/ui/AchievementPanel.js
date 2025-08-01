// AchievementPanel.js - Achievement and progression tracking interface

class AchievementPanel {
  constructor(uiController) {
    this.ui = uiController;
    this.gameState = uiController.gameState;
  }
  
  render() {
    const panel = document.getElementById('panel-achievements');
    if (!panel) return;
    
    panel.innerHTML = `
      <div class="achievement-overview">
        <h2>🏆 Crusade Achievements</h2>
        <div class="achievement-stats">
          <div class="stat-card">
            <h3>${this.gameState.achievements.unlocked.length}</h3>
            <p>Unlocked</p>
          </div>
          <div class="stat-card">
            <h3>${this.gameState.achievements.available.length}</h3>
            <p>Total</p>
          </div>
          <div class="stat-card">
            <h3>${Math.round((this.gameState.achievements.unlocked.length / this.gameState.achievements.available.length) * 100)}%</h3>
            <p>Complete</p>
          </div>
        </div>
      </div>
      
      <div class="achievement-categories">
        <div class="achievement-section">
          <h3>🎖️ Combat Achievements</h3>
          <div class="achievement-list">
            ${this.renderAchievementsByCategory(['first_conquest', 'fleet_commander', 'emperor_champion'])}
          </div>
        </div>
        
        <div class="achievement-section">
          <h3>🔬 Research Achievements</h3>
          <div class="achievement-list">
            ${this.renderAchievementsByCategory(['tech_master', 'relic_hunter'])}
          </div>
        </div>
        
        <div class="achievement-section">
          <h3>⚙️ Management Achievements</h3>
          <div class="achievement-list">
            ${this.renderAchievementsByCategory(['crusade_veteran', 'logistics_master'])}
          </div>
        </div>
      </div>
      
      <div class="officer-development">
        <h3>👨‍✈️ Officer Corps</h3>
        <div class="officer-panels">
          ${this.renderWarmasterPanel()}
          ${this.renderOfficerCards()}
        </div>
      </div>
      
      <div class="narrative-progress">
        <h3>📚 Campaign Progress</h3>
        <div class="campaign-chapters">
          ${this.renderCampaignProgress()}
        </div>
      </div>
    `;
    
    this.bindEventHandlers();
  }
  
  renderAchievementsByCategory(achievementIds) {
    return achievementIds.map(id => {
      const achievement = this.gameState.achievements.available.find(a => a.id === id);
      if (!achievement) return '';
      
      const isUnlocked = this.gameState.achievements.unlocked.includes(id);
      const progressPercent = Math.min(100, (achievement.progress / achievement.target) * 100);
      
      return `
        <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon">${isUnlocked ? '🏆' : '🔒'}</div>
          <div class="achievement-info">
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercent}%"></div>
              <span class="progress-text">${achievement.progress}/${achievement.target}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  renderWarmasterPanel() {
    const warmaster = this.gameState.officers.warmaster;
    const nextLevelXP = warmaster.level * 100;
    const progressPercent = (warmaster.experience / nextLevelXP) * 100;
    
    return `
      <div class="warmaster-panel">
        <div class="officer-header">
          <h4>⭐ ${warmaster.name}</h4>
          <span class="rank">${warmaster.rank} - Level ${warmaster.level}</span>
        </div>
        <div class="experience-bar">
          <div class="exp-fill" style="width: ${progressPercent}%"></div>
          <span class="exp-text">${warmaster.experience}/${nextLevelXP} XP</span>
        </div>
        <div class="skills-grid">
          ${Object.entries(warmaster.skills).map(([skill, value]) => `
            <div class="skill-item">
              <span class="skill-name">${skill.charAt(0).toUpperCase() + skill.slice(1)}</span>
              <div class="skill-bar">
                <div class="skill-fill" style="width: ${(value / 10) * 100}%"></div>
                <span class="skill-value">${value}</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="traits">
          <strong>Traits:</strong> ${warmaster.traits.join(', ')}
        </div>
        <div class="biography">
          <p><em>${warmaster.biography}</em></p>
        </div>
      </div>
    `;
  }
  
  renderOfficerCards() {
    let html = '';
    
    // Render Captains
    this.gameState.officers.captains.forEach(captain => {
      html += this.renderOfficerCard(captain, 'captain');
    });
    
    // Render Admirals
    this.gameState.officers.admirals.forEach(admiral => {
      html += this.renderOfficerCard(admiral, 'admiral');
    });
    
    return html;
  }
  
  renderOfficerCard(officer, type) {
    const nextLevelXP = officer.level * 100;
    const progressPercent = (officer.experience / nextLevelXP) * 100;
    const canPromote = officer.experience >= nextLevelXP;
    
    return `
      <div class="officer-card">
        <div class="officer-header">
          <h4>${type === 'captain' ? '⚔️' : '🚢'} ${officer.name}</h4>
          <span class="specialization">${officer.specialization} - Level ${officer.level}</span>
        </div>
        <div class="experience-bar">
          <div class="exp-fill" style="width: ${progressPercent}%"></div>
          <span class="exp-text">${officer.experience}/${nextLevelXP} XP</span>
        </div>
        <div class="skills-compact">
          ${Object.entries(officer.skills).map(([skill, value]) => `
            <span class="skill-badge">${skill}: ${value}</span>
          `).join('')}
        </div>
        <div class="traits-compact">
          ${officer.traits.map(trait => `<span class="trait-badge">${trait}</span>`).join('')}
        </div>
        ${canPromote ? `
          <button class="promote-btn" onclick="window.gameActions.promoteOfficer('${type}', '${officer.name}')">
            Promote to Level ${officer.level + 1}
          </button>
        ` : ''}
      </div>
    `;
  }
  
  renderCampaignProgress() {
    return this.gameState.narrative.campaigns.map(campaign => {
      const progressPercent = campaign.progress;
      const isCompleted = campaign.completed;
      
      return `
        <div class="campaign-card ${isCompleted ? 'completed' : 'active'}">
          <div class="campaign-header">
            <h4>${isCompleted ? '✅' : '⏳'} ${campaign.name}</h4>
          </div>
          <div class="campaign-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercent}%"></div>
              <span class="progress-text">${progressPercent}% Complete</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  bindEventHandlers() {
    // Event handlers for interactive elements would go here
    // For now, promotion buttons are handled via onclick attributes
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AchievementPanel;
}
