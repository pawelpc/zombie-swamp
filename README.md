# Zombie Swamp

A turn-based strategy game where you must survive waves of zombies by strategically luring them into swamps.

## How to Run the Game

**IMPORTANT**: The game must be run through a local web server to load audio files properly.

### Option 1: Using Python (Recommended)
```bash
# Windows
start-server.bat

# Mac/Linux
chmod +x start-server.sh
./start-server.sh
```

### Option 2: Using Node.js
```bash
node server.js
```

### Option 3: Manual Python Server
```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

Once the server is running, open **http://localhost:8000** in your web browser.

## How to Play

1. Click "Start Game" to begin
2. Use arrow keys or WASD to move your character
3. Lead zombies into swamps to eliminate them
4. Avoid stepping into swamps or touching zombies
5. Clear all zombies to complete the level

## Game Controls

- **Arrow Keys** or **WASD**: Move your character (North, South, East, West)
- Movement happens once per second (listen for the ticking clock)
- Both you and zombies move simultaneously each turn

## Game Rules

- **Objective**: Eliminate all zombies on each level
- **Win Condition**: Clear all zombies from the grid
- **Lose Condition**: Run out of lives
- **Lives**: Start with 3 lives, earn extras every 5 levels
- **Zombies**: Always move toward your position
- **Swamps**: Deadly to both zombies and player
- **Strategy**: Lure zombies into swamps while avoiding them yourself

## Scoring

- **Zombie Eliminated**: 100 points
- **Level Complete**: 500 points
- **Combo System**: Consecutive kills increase your multiplier (1.5× per combo level)
- **Bonuses**: Speed completion and efficient play earn extra points

## Difficulty Progression

The game gets progressively harder:
- More zombies spawn each level
- Fewer swamps appear
- Zombies become smarter and faster
- New zombie types appear in later levels

## Features Implemented (Phase 1 - MVP)

✅ Core grid-based movement system
✅ Turn-based gameplay (1 second per turn)
✅ Player controls with keyboard input
✅ Zombie AI that moves toward player
✅ Swamp collision detection
✅ Win/loss conditions
✅ Lives system
✅ Score tracking with combo system
✅ Level progression
✅ Audio system with ticking clock
✅ Menu and game over screens
✅ Canvas-based rendering

## File Structure

```
Zombie Swamp Game/
├── index.html          # Main HTML file
├── styles.css          # Game styling
├── game.js             # Core game engine
├── audio.js            # Audio system
├── GAME_DESIGN.md      # Complete game design document
└── README.md           # This file
```

## Technical Details

- **Technology**: Vanilla JavaScript (ES6+)
- **Rendering**: HTML5 Canvas API
- **Audio**: Web Audio API (procedurally generated sounds)
- **No Dependencies**: Pure JavaScript, no external libraries required

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Requires modern browser with ES6 support and Web Audio API

## Future Enhancements (Coming in Phase 2 & 3)

- Powerups (Shield, Freeze, Speed Boost, etc.)
- Multiple zombie types (Fast, Smart, Tank, Horde)
- Special level types (Boss, Survival, Puzzle)
- Enhanced graphics and animations
- Background music
- Accessibility options
- Mobile touch controls
- Local high score storage

## Credits

Developed as part of the Claude Code Learning project.

**Version**: 1.0 (MVP)
**Last Updated**: January 14, 2026

---

Enjoy surviving the Zombie Swamp! 🧟‍♂️🌊
