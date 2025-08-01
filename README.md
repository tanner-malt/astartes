# Astartes: Warmaster's Crusade

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-ready-red.svg)](https://html.spec.whatwg.org/)

## 🎮 Overview

**Astartes: Warmaster's Crusade** is an immersive turn-based strategy game inspired by the Warhammer 40,000 universe. Command a mighty crusade fleet as a legendary Warmaster, conquering star systems and expanding the Imperium's dominion across a procedurally generated galaxy.

Experience the grim darkness of the far future through strategic fleet management, planetary conquest, resource optimization, and narrative-driven campaigns with persistent progression.

## ⭐ Core Features

### 🌌 **Galaxy Exploration**
- **Procedurally Generated Universe**: Every playthrough features a unique galaxy with diverse star systems
- **Hyperspace Navigation**: Plan strategic routes through hyperspace lanes
- **System Scanning**: Discover hidden resources, ancient artifacts, and enemy strongholds
- **Threat Assessment**: Dynamic threat levels that respond to your crusade's progress

### ⚔️ **Fleet Command**
- **Ship Management**: Command various vessel classes from nimble Frigates to mighty Battleships
- **Officer Corps**: Elite officers with unique abilities and specializations
- **Fleet Composition**: Balance logistics, firepower, and specialized capabilities
- **Maintenance & Repairs**: Realistic ship condition tracking and repair mechanics

### 🏭 **Resource Management**
- **Multi-Resource Economy**: Manage Requisition, Fuel, Materials, and Intel
- **Production Chains**: Establish efficient resource extraction and processing
- **Trade Networks**: Develop inter-system commerce and supply lines
- **Strategic Reserves**: Build stockpiles for extended campaigns

### 🌍 **Planetary Conquest**
- **World Classification**: Conquer Forge Worlds, Agri Worlds, Hive Cities, and more
- **Invasion Mechanics**: Plan and execute planetary assaults
- **Garrison Management**: Maintain control through strategic troop deployment
- **Infrastructure Development**: Build facilities to enhance planetary output

### 🔬 **Research & Development**
- **Technology Trees**: Unlock advanced weaponry, ship designs, and tactical doctrines
- **Archaeological Expeditions**: Recover lost STC patterns and ancient knowledge
- **Innovation Projects**: Develop custom solutions for unique challenges
- **Knowledge Preservation**: Build libraries and research stations

### 📚 **Narrative Campaign**
- **Branching Storylines**: Your decisions shape the fate of the crusade
- **Dynamic Events**: Respond to crises, opportunities, and moral dilemmas
- **Character Development**: Build relationships with key figures in your crusade
- **Multiple Endings**: Experience different conclusions based on your choices

## 🎯 Game Concept

**🎖️ Role**: Command a Great Crusade as a legendary Warmaster of the Imperium  
**🎯 Objective**: Unite the galaxy under Imperial rule through conquest and diplomacy  
**⚙️ Core Loop**: Explore → Conquer → Develop → Research → Expand

### Gameplay Pillars
1. **Strategic Planning**: Long-term fleet positioning and resource allocation
2. **Tactical Combat**: Turn-based battles with environmental factors
3. **Resource Optimization**: Balance immediate needs with long-term growth  
4. **Narrative Choices**: Shape your crusade's legacy through key decisions
5. **Persistent Progress**: Unlock new capabilities across multiple campaigns

## 🚀 Quick Start Guide

### Installation
```bash
# Clone the repository
git clone https://github.com/tanner-malt/astartes.git
cd astartes

# Start local server (Python 3)
python -m http.server 8000

# Or with Node.js
npx http-server -p 8000

# Open browser
open http://localhost:8000
```

### First Campaign
1. **Galaxy Generation**: Your first galaxy will be procedurally created
2. **Fleet Selection**: Choose your starting fleet composition
3. **Target Selection**: Identify your first conquest objectives
4. **Resource Planning**: Establish supply lines for sustained operations
5. **Begin Crusade**: Launch your first planetary assault!

## 🎮 Game Panels & Interface

### 🌌 Galaxy Map
- **Interactive Star Map**: Click systems to view details and plan movements
- **Hyperspace Routes**: Visualize travel lanes and journey times
- **Threat Indicators**: See enemy strength and system defenses
- **Resource Overlays**: Toggle views for different resource types

### ⚓ Fleet Management  
- **Ship Roster**: Complete fleet overview with ship status
- **Officer Assignments**: Manage your command staff and specialists
- **Logistics Dashboard**: Monitor fuel, supplies, and maintenance needs
- **Fleet Actions**: Organize task forces and assign missions

### 🌍 Planetary Operations
- **World Overview**: Detailed planetary information and statistics
- **Invasion Planning**: Prepare and execute planetary assaults
- **Development Projects**: Build infrastructure and improvements
- **Garrison Control**: Manage planetary defense forces

### 📊 Resource Command
- **Economic Dashboard**: Real-time resource production and consumption
- **Trade Networks**: Manage inter-system commerce and supply routes
- **Strategic Reserves**: Monitor stockpiles and emergency supplies
- **Production Queues**: Plan and prioritize resource allocation

### 📖 Campaign Chronicle
- **Mission Log**: Track objectives, victories, and setbacks
- **Event Archive**: Review important decisions and their consequences
- **Character Profiles**: Information on key figures and relationships
- **Achievement Gallery**: Unlock and display campaign milestones

### 🔬 Research Sanctum
- **Technology Trees**: Browse available research paths
- **Active Projects**: Monitor ongoing research and development
- **Archaeological Sites**: Investigate ancient ruins and artifacts
- **Innovation Workshop**: Develop custom solutions and upgrades

## 🏗️ Architecture & Codebase

### 📁 Project Structure
```
astartes/
├── src/
│   ├── js/
│   │   ├── game/
│   │   │   ├── GameState.js      # Core game state management
│   │   │   └── GameActions.js    # Game actions and mechanics
│   │   ├── ui/
│   │   │   ├── UIController.js   # Main UI coordination
│   │   │   ├── GalaxyPanel.js    # Galaxy map interface
│   │   │   ├── FleetPanel.js     # Fleet management UI
│   │   │   └── ResourcePanel.js  # Resource dashboard
│   │   └── main.js               # Application entry point
│   └── css/
│       └── main.css              # Styles and visual themes
├── index.html                    # Main application file
└── README.md                     # This documentation
```

### 🔧 Module System
- **GameState.js**: Manages all game data, save/load, and state persistence
- **GameActions.js**: Handles player actions, combat resolution, and turn processing  
- **UIController.js**: Coordinates panel switching and UI state management
- **Panel Classes**: Specialized renderers for each game interface
- **main.js**: Integration layer that connects all modules

### 💾 Data Persistence
- **Local Storage**: Game saves stored in browser localStorage
- **Auto-save**: Automatic saves on important game events
- **Export/Import**: Backup and share campaign saves
- **Version Compatibility**: Handles save migration between game versions

## 🎨 Visual Design

### Art Style
- **CSS-based Graphics**: Clean, performant visuals using modern CSS
- **Warhammer 40k Aesthetic**: Dark, gothic imperial themes
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: High contrast modes and keyboard navigation

### UI/UX Principles
- **Information Density**: Rich data presentation without clutter
- **Quick Actions**: One-click access to common operations
- **Visual Feedback**: Clear indicators for game state changes
- **Progressive Disclosure**: Complex features revealed as needed

## 🗺️ Development Roadmap

### Phase 1: Foundation ✅
- [x] Modular architecture implementation
- [x] Core game state management
- [x] Basic UI panel system
- [x] Galaxy generation algorithm
- [x] Fleet and resource management
- [x] Local storage persistence

### Phase 2: Core Gameplay 🚧
- [ ] Enhanced combat mechanics with tactical depth
- [ ] Advanced planetary management systems  
- [ ] Research tree implementation
- [ ] Dynamic event system
- [ ] Campaign progression tracking
- [ ] Achievement and unlock system

### Phase 3: Content Expansion 📋
- [ ] Extended ship classes and customization
- [ ] Advanced enemy AI and faction variety
- [ ] Expanded narrative branching
- [ ] Archaeological expedition mechanics
- [ ] Trade and economy simulation
- [ ] Multiplayer foundation (optional)

### Phase 4: Polish & Features 🎯
- [ ] Enhanced visual effects and animations
- [ ] Sound design and audio integration
- [ ] Performance optimization
- [ ] Mobile device compatibility
- [ ] Modding support framework
- [ ] Community features

## 🎮 Advanced Gameplay Systems

### ⚔️ Combat Mechanics
- **Initiative System**: Speed-based turn order with tactical positioning
- **Weapon Classifications**: Energy, kinetic, and exotic damage types
- **Shield & Armor**: Layered defense systems with degradation
- **Critical Hits**: Subsystem damage affecting ship performance
- **Environmental Hazards**: Asteroid fields, stellar phenomena effects

### 🏭 Economic Simulation
- **Supply Chain Management**: Complex resource interdependencies
- **Market Dynamics**: Fluctuating prices based on galactic events
- **Infrastructure Investment**: Long-term development projects
- **Trade Route Security**: Protect commerce from raiders and pirates
- **Emergency Reserves**: Stockpile management for crisis situations

### 🧬 Research Trees
```
Technology Branches:
├── Military Engineering
│   ├── Weapon Systems
│   ├── Defensive Technology
│   └── Ship Design
├── Infrastructure
│   ├── Resource Extraction
│   ├── Construction Methods
│   └── Logistics Networks
└── Xenoarchaeology
    ├── Ancient Technologies
    ├── Artifact Analysis
    └── Lost Knowledge Recovery
```

### 🎭 Narrative Framework
- **Character Arcs**: Personal stories of key crusade members
- **Moral Complexity**: No purely "good" or "evil" choices
- **Consequence System**: Long-term effects of strategic decisions
- **Branching Campaigns**: Multiple paths through the galaxy
- **Legacy Effects**: Previous campaign choices affect new games

## 🛠️ Technical Implementation

### Performance Optimization
- **Lazy Loading**: Panels load content only when visible
- **Data Caching**: Smart caching of computed values
- **DOM Manipulation**: Efficient updates using document fragments
- **Memory Management**: Proper cleanup of event listeners and timers

### Browser Compatibility
- **Modern Standards**: ES6+ with graceful degradation
- **Progressive Enhancement**: Core functionality works without advanced features
- **Cross-Platform**: Tested on Chrome, Firefox, Safari, and Edge
- **Mobile Support**: Touch-friendly interface and responsive design

### Save System Architecture
```javascript
SaveData Structure:
{
  version: "1.0.0",
  timestamp: "2025-08-01T12:00:00Z",
  gameState: {
    turn: 42,
    galaxy: { /* procedural galaxy data */ },
    fleet: { /* ship and officer data */ },
    resources: { /* economic state */ },
    research: { /* technology progress */ },
    narrative: { /* story progression */ }
  },
  settings: { /* user preferences */ },
  achievements: [ /* unlocked achievements */ ]
}
```

## 🤝 Contributing

### Development Setup
```bash
# Fork and clone the repository
git clone https://github.com/yourusername/astartes.git
cd astartes

# Create a feature branch
git checkout -b feature/amazing-new-feature

# Make your changes and test locally
python -m http.server 8000

# Submit a pull request
git push origin feature/amazing-new-feature
```

### Code Style Guidelines
- **ES6+ JavaScript**: Use modern syntax and features
- **Modular Architecture**: Keep functions and classes focused
- **Documentation**: Comment complex algorithms and game logic
- **Testing**: Include test cases for new gameplay mechanics
- **CSS Organization**: Follow BEM methodology for styling

### Bug Reports & Feature Requests
- Use GitHub Issues for bug reports and feature requests
- Include reproduction steps for bugs
- Provide mockups or detailed descriptions for features
- Check existing issues before creating duplicates

## 📜 Credits & Acknowledgments

### Inspiration
- **Games Workshop**: Original Warhammer 40,000 universe and lore
- **Classic 4X Games**: Civilization, Master of Orion, Stellaris
- **Tactical RPGs**: Final Fantasy Tactics, X-COM series

### Technologies
- **Web Standards**: HTML5, CSS3, ES6+ JavaScript
- **Development**: Visual Studio Code, Git, GitHub
- **Testing**: Local HTTP servers, browser developer tools

## ⚖️ Legal & Licensing

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Disclaimer
**Astartes: Warmaster's Crusade** is a fan-created project inspired by the Warhammer 40,000 universe. It is not affiliated with, endorsed by, or connected to Games Workshop Limited. All Warhammer 40,000 intellectual property belongs to Games Workshop.

This game is provided for educational and entertainment purposes only. No commercial use is intended or permitted.

### Fair Use Statement
This project constitutes fair use under copyright law for the purposes of commentary, parody, and educational content. Original game mechanics, code, and non-derivative creative elements are released under the MIT License.
