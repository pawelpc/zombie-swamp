# Zombie Swamp - Game Design Document

## Game Concept

**Zombie Swamp** is a single-player JavaScript grid-based strategy game where the player must survive waves of zombies by strategically luring them into swamps while avoiding death themselves.

---

## Core Mechanics

### Grid System
- **Starting Grid Size**: 15×15 tiles
- **Grid Variations**: Size changes by level (10×10 for harder levels, 20×20 for easier)
- **Player Spawn**: Center of the screen at game start
- **Zombie Spawn**: Random positions around the grid
- **Swamp Spawn**: Random positions across the grid

### Movement System
- **Turn-Based**: All entities move simultaneously once per second
- **Movement Options**: Four cardinal directions (North, South, East, West)
- **One Tile Per Turn**: Standard movement distance for both player and zombies

### Zombie Behavior
- **AI Logic**: Zombies always move toward the player's position
- **Pathfinding**: Direct approach, seeking shortest distance to player
- **Elimination**: Zombies die when they step into a swamp tile

### Win/Loss Conditions

**Level Victory:**
- All zombies eliminated from the grid
- Player survives until no zombies remain

**Player Defeat:**
- Player occupies the same tile as a zombie
- Player steps into a swamp tile

---

## Gameplay Loop

### Per Level Flow
1. **Level Start**: Player spawns center, zombies and swamps randomly placed
2. **Movement Phase**: Simultaneous turn-based movement (player inputs direction, all zombies calculate movement)
3. **Resolution Phase**: Check collisions
   - Zombie-swamp collisions → Zombie eliminated
   - Player-zombie collision → Player death
   - Player-swamp collision → Player death
4. **Victory Check**: All zombies eliminated → Calculate score → Proceed to next level
5. **Defeat Check**: Player dies → Show statistics → Retry or return to menu

### Meta Progression
- Complete levels to unlock harder difficulties and game modes
- Accumulate score to unlock cosmetic variants
- Track personal best scores per level
- Lives system: Start with 3 lives, earn extras every 5 levels or per 10,000 points

---

## Tile Types

### Standard Tiles
- **Normal Tile**: Safe for player movement (white/green visual)
- **Swamp Tile**: Deadly to both player and zombies (blue/murky visual)

### Special Tiles (Advanced)
- **Safe Zone**: Zombies cannot enter for 1 turn (rare spawns, golden glow)
- **Quick Mud**: Slows zombies by 50% when stepped on (brown/muddy visual)
- **Obstacle/Rock**: Blocks movement for all entities (gray/stone visual)

---

## Powerups

Powerups appear randomly on the grid during gameplay. Player collects by moving onto the tile.

### Defensive Powerups
- **Shield**: Survive one zombie collision without dying (breaks on contact)
- **Freeze**: All zombies stop moving for 2-3 turns
- **Invisibility**: Zombies don't track player for 3-5 turns (wander randomly instead)

### Offensive Powerups
- **Zombie Repel**: Pushes all adjacent zombies 1 space away from player
- **Swamp Creator**: Player can place 1-2 new swamp tiles on the grid
- **Chain Reaction**: Next zombie eliminated in swamp causes adjacent zombies to also die

### Utility Powerups
- **Speed Boost**: Move 2 spaces in one turn (3 uses)
- **Reveal**: Shows safe path indicators for 3 turns
- **Undo**: Rewind 1 turn (once per level)

---

## Zombie Types

Introduced gradually as difficulty increases:

1. **Basic Zombie** (Level 1+)
   - Standard movement toward player
   - Moves 1 tile per turn

2. **Fast Zombie** (Level 11+)
   - Moves 1.5x speed
   - Gets 2 moves every other turn
   - Visual: Red tint, speed lines

3. **Tank Zombie** (Level 16+)
   - Requires 2 swamp drownings to eliminate
   - Moves slower (every 2 turns)
   - Visual: Larger sprite, darker color

4. **Smart Zombie** (Level 21+)
   - 30% chance to path around obvious swamp traps
   - Standard movement speed
   - Visual: Glowing eyes, different color

5. **Horde Zombie** (Level 26+)
   - Spawns in groups
   - Slight coordination with pack behavior
   - Attempts to surround player
   - Visual: Similar appearance, spawn in clusters

---

## Difficulty Progression

### Levels 1-5 (Tutorial)
- 3-5 basic zombies
- Many swamps (high density)
- Generous spacing between zombies and player
- Introduction to core mechanics

### Levels 6-10 (Easy)
- 5-8 basic zombies
- Moderate swamp density
- First powerups introduced
- Standard grid size (15×15)

### Levels 11-20 (Medium)
- 8-12 zombies (mix of basic and fast)
- Fewer swamps
- Tighter spawn spacing
- Fast zombies introduced
- Regular powerup spawns

### Levels 21-30 (Hard)
- 12-15 zombies (basic, fast, smart)
- Minimal swamps
- Smart zombies introduced
- Grid obstacles (rocks) appear
- Tank zombies introduced at level 16

### Levels 31+ (Expert)
- 15-20 zombies (all types)
- Very few swamps
- Pack behavior coordination
- Shrinking grid (borders close in every 10 turns)
- Mid-level zombie spawning
- Horde zombies introduced

### Dynamic Difficulty Variables
- **Zombie Count**: Increases per level
- **Zombie Speed**: Multiplier increases
- **Swamp Density**: Decreases over time
- **Grid Size**: Can shrink or expand
- **AI Intelligence**: Smarter pathing at higher levels
- **Spawn Rate**: Additional zombies spawn mid-level in expert mode

---

## Scoring System

### Base Points
- **Zombie Eliminated**: 100 points
- **Level Complete**: 500 points
- **Combo Multiplier**: 1.5× per consecutive elimination without pause
- **Speed Bonus**: +50 points per unused turn remaining
- **Powerup Efficiency Bonus**: +200 points if no powerups used
- **Perfect Run**: +1000 points if no tile revisited during level

### Combo System
- Eliminating zombies in rapid succession builds combo counter
- Each consecutive elimination multiplies score
- Combo breaks if player waits more than 2 turns between eliminations
- Visual feedback: "2× COMBO!", "3× COMBO!" popup text

### Special Bonuses
- **Multi-Kill**: Eliminate 3+ zombies in one swamp (+500 points)
- **Close Call**: Survive with zombie adjacent to player (+100 points)
- **Swamp Master**: Complete level using only starting swamps (+300 points)

---

## Special Level Types

Every 5th level features a unique challenge:

### Boss Level (Levels 5, 15, 25, etc.)
- Single "Zombie King" enemy
- Requires 3 swamp hits to eliminate
- Smarter pathfinding (avoids obvious traps)
- Larger sprite with crown visual
- Bonus score on defeat

### Survival Mode (Levels 10, 20, 30, etc.)
- Zombies spawn continuously throughout level
- Must survive for 30 turns
- Increasing spawn rate over time
- Victory by surviving timer

### Puzzle Level (Levels 8, 18, 28, etc.)
- Pre-set zombie and swamp positions
- One optimal solution path
- Limited moves to complete
- Bonus for finding perfect solution

### Swarm Level (Levels 12, 22, 32, etc.)
- Many weak zombies (15-25)
- High swamp density
- Focus on crowd control
- Time pressure element

### Gauntlet Level (Levels 14, 24, 34, etc.)
- Linear/corridor grid layout
- Zombies approach from one or both ends
- Limited space to maneuver
- Must eliminate all before being overwhelmed

---

## Strategy & Tactics

### Core Strategies
- **Kiting**: Lead zombies toward swamps in controlled manner
- **Grouping**: Line up multiple zombies to eliminate several at once
- **Safe Pathing**: Plan route to maintain distance while herding zombies
- **Powerup Timing**: Know when to use versus save for emergency
- **Corner Avoidance**: Never trap yourself in a corner
- **Swamp Mapping**: Memorize swamp positions for quick decisions

### Risk/Reward Elements
- Powerups spawn in dangerous positions (near zombies or swamps)
- Bonus objectives encourage aggressive play
- Score multipliers reward efficient play
- Optional challenges for extra points

---

## User Interface

### HUD Elements
- **Score Display**: Top-left corner
- **Level Counter**: Top-center
- **Lives Remaining**: Top-right corner with heart icons
- **Turn Counter**: Shows current turn number
- **Active Powerups**: Icons with remaining duration/uses
- **Combo Meter**: Visual feedback for combo multiplier
- **Next Move Indicator**: Highlights valid movement squares

### Visual Feedback
- **Color-Coded Zombies**: Different types have distinct colors
- **Movement Preview**: Show where zombies will move next turn
- **Danger Indicators**: Red glow on threatened squares
- **Particle Effects**: Splash for swamp elimination, dust for movement
- **Screen Shake**: On player hit or close call
- **Zombie Shadows**: Grow larger as they approach player
- **Movement Trails**: Subtle trail showing recent movement paths

### Minimap (For Larger Grids)
- Small overview in corner showing all entities
- Click to pan camera on large grids
- Toggle on/off with keyboard shortcut

---

## Audio Design

### Sound Effects
- **Ticking Clock**: Synchronized with the 1-second turn timer (creates tension and helps players time movements)
  - Visual sync: Flash border or icon in sync with tick
  - Speed variations: Clock ticks faster in higher levels or when zombies very close
  - Silence effect: Clock stops during "Freeze" powerup (eerie silence)
  - Final countdown: Different tick sound for limited turns in timed modes
  - Metronome option: Settings toggle for players who find it helpful vs distracting
- **Zombie Groans**: Directional audio based on zombie positions
- **Splash Sound**: Swamp elimination
- **Footstep Sounds**: Player and zombie movement
- **Powerup Pickup**: Chime sound
- **Powerup Activation**: Unique sound per powerup type
- **Victory Stinger**: Level complete fanfare
- **Defeat Stinger**: Death sound
- **Combo Sounds**: Escalating pitch for combo increases

### Music
- **Tension Music**: Background music that intensifies with zombie proximity
- **Boss Music**: Unique track for boss levels
- **Menu Music**: Calm atmospheric track
- **Victory Music**: Triumphant theme for game completion

---

## Accessibility Features

### Visual Accessibility
- **Colorblind Mode**: Alternative color palettes for all tile types
- **High Contrast Mode**: Enhanced visibility of all elements
- **Adjustable Grid Size**: Zoom options for visual clarity
- **Screen Reader Support**: Text descriptions of game state

### Gameplay Accessibility
- **Movement Preview Arrows**: Shows where entities will move
- **Tutorial Level**: Step-by-step explanation of mechanics
- **Pause Functionality**: Freeze game at any time to review board
- **Difficulty Settings**: Easy/Normal/Hard modes with different starting parameters
- **Turn Timer Options**: Adjust or disable turn timer
- **Undo Feature**: Built-in as powerup, can be enabled permanently in accessibility settings

### Audio Accessibility
- **Volume Controls**: Separate sliders for SFX, music, and UI sounds
- **Audio Toggle**: Disable specific sound categories
- **Visual Metronome**: Clock tick shown visually for hearing-impaired players
- **Subtitle Options**: Text popup for audio cues

---

## Implementation Phases

### Phase 1 - MVP (Core Game)
- Basic grid rendering (15×15)
- Player movement with keyboard controls
- Basic zombie AI (move toward player)
- Swamp collision detection
- Win/loss conditions
- Simple scoring (zombie elimination + level complete)
- Basic UI (score, level, lives)

### Phase 2 - Enhanced Gameplay
- 3-5 powerup types (Shield, Freeze, Speed Boost, Swamp Creator, Repel)
- Difficulty scaling (zombie count, spawn density)
- Lives system (3 lives, extra life rewards)
- Level progression (10 levels minimum)
- Combo scoring system
- Audio implementation (ticking clock, basic SFX)

### Phase 3 - Content Expansion
- Zombie variants (Fast, Smart, Tank)
- Special level types (Boss, Survival, Puzzle)
- Advanced powerups (Chain Reaction, Undo, Invisibility)
- UI polish (particles, animations, feedback)
- Music and full audio suite
- Advanced scoring (bonuses, perfect runs)

### Phase 4 - Polish & Accessibility
- Colorblind and high contrast modes
- Tutorial system
- Settings menu (audio, controls, difficulty)
- Visual feedback enhancements
- Performance optimization
- Balance tuning based on playtesting

---

## Technical Considerations

### Technology Stack
- **Language**: JavaScript (vanilla or framework TBD)
- **Rendering**: HTML5 Canvas or CSS Grid
- **Audio**: Web Audio API
- **Storage**: LocalStorage for high scores and settings

### Performance Targets
- 60 FPS rendering
- < 100ms input latency
- Smooth animations and transitions
- Responsive on desktop and mobile browsers

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browser support
- Responsive design for various screen sizes

---

## Future Expansion Ideas

### Potential Features (Post-Launch)
- **Multiplayer Mode**: Co-op or competitive gameplay
- **Level Editor**: Player-created levels
- **Daily Challenges**: Procedurally generated daily levels with leaderboards
- **Achievements System**: Unlock rewards for specific accomplishments
- **Character Skins**: Cosmetic player and zombie variants
- **Power-up Loadouts**: Choose starting powerups before level
- **Endless Mode**: Survive as long as possible with continuous spawning
- **Speedrun Mode**: Time-based challenges with leaderboards

---

## Game Balance Notes

### Tuning Parameters (To Be Adjusted During Playtesting)
- Zombie spawn distances from player
- Swamp density percentages per difficulty tier
- Powerup spawn frequency and positioning
- Combo timer duration
- Score multiplier values
- Lives earned frequency
- Grid shrinking speed in expert mode
- Smart zombie trap avoidance percentage
- Tank zombie health points

### Success Metrics
- Average player completion rate per difficulty tier
- Time to complete levels
- Most/least used powerups
- Player death locations (identify unfair situations)
- Score distribution across playerbase

---

## Credits & Version

**Game Title**: Zombie Swamp
**Genre**: Turn-Based Strategy / Puzzle
**Platform**: Web Browser (JavaScript)
**Version**: 1.0 (Design Document)
**Last Updated**: January 14, 2026

---

*This design document is a living document and will be updated as development progresses and playtesting provides feedback.*
