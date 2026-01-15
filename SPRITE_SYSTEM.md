# Zombie Swamp - Sprite System

## Overview

The game now features an advanced sprite system with animated walking zombies that show directional movement!

## Features

### Zombie Sprites

**Appearance:**
- **Green zombie skin** (#5a8a5a) - Classic undead look
- **Glowing yellow eyes** with aura effect
- **Dark red/brown body** (#6b0000)
- **Jagged mouth** for undead appearance
- **Animated limbs** (arms and legs)
- **Direction indicators** (small arrows showing movement direction)

**Animation:**
- **4-frame walk cycle** per direction
- **Bobbing motion** as they walk (vertical oscillation)
- **Arm swinging** synchronized with steps
- **Leg movement** creates realistic walking effect
- **Direction tracking**: up, down, left, right

### Player Sprite

**Enhanced Design:**
- **Hero green color** (#4a9d5f)
- **Bright outline** for visibility
- **Face details**:
  - White eyes with black pupils
  - Smiling mouth
- **Shield effect** (when powerup active):
  - Animated pulsing ring
  - Golden color (#ffd700)
  - Glowing outer aura

## Technical Implementation

### Files

**sprites.js** - Complete sprite rendering system:
- `SpriteRenderer` class manages all sprites
- Methods for drawing zombies in each direction
- Animation frame calculation
- Player sprite with facial features
- Shield effect rendering

**game.js** - Integration:
- Zombie class tracks direction
- Render loop uses sprite system
- Animation tied to turn counter

### How It Works

1. **Initialization**:
   ```javascript
   this.spriteRenderer = new SpriteRenderer();
   ```

2. **Zombie Direction Tracking**:
   - Zombies calculate their direction when moving toward player
   - Direction stored: 'up', 'down', 'left', 'right'

3. **Animation Frames**:
   - 4 frames per direction = 16 total frames per zombie
   - Frame selection based on game turn counter
   - Smooth cycling creates walking effect

4. **Rendering**:
   ```javascript
   const frame = this.spriteRenderer.getZombieFrame(zombie.direction, turnNumber);
   frame.draw(ctx, x, y, size);
   ```

## Animation Details

### Walk Cycle Timing

- **Animation Speed**: 8 game turns per frame
- **Full Cycle**: 32 turns (8 turns × 4 frames)
- **Turn Duration**: 1 second
- **Complete Walk Animation**: ~4 seconds

### Movement Phases

**Frame 0**: Legs together, arms neutral
**Frame 1**: Left leg forward, right arm forward
**Frame 2**: Legs together, arms neutral
**Frame 3**: Right leg forward, left arm forward

### Bobbing Effect

- **Vertical oscillation**: ±2 pixels
- **Sine wave pattern**: Creates smooth up/down motion
- **Synchronized with walk cycle**: Natural looking movement

## Customization

### Changing Zombie Colors

In `sprites.js`, modify these values:

```javascript
// Zombie skin (currently green)
ctx.fillStyle = '#5a8a5a';

// Eye glow (currently yellow)
ctx.fillStyle = '#ffff00';

// Body color (currently dark red)
ctx.fillStyle = '#6b0000';
```

### Adjusting Animation Speed

In `sprites.js`:

```javascript
this.animationSpeed = 8; // Lower = faster, Higher = slower
```

### Changing Sprite Size

Sprites scale automatically with `CONFIG.TILE_SIZE` in `game.js`:

```javascript
TILE_SIZE: 40, // Make larger for bigger sprites
```

## Visual Comparison

### Before (Simple Circles):
- ⚪ Player: Green circle
- 🔴 Zombie: Red circle with yellow dots for eyes
- No animation
- No directional facing

### After (Animated Sprites):
- 👤 Player: Detailed character with face
- 🧟 Zombie: Full body with animated limbs
- Walking animation with 4-frame cycle
- Direction indicators showing movement
- Realistic bobbing and swinging motion

## Performance

- **Efficient rendering**: All drawn with Canvas 2D API
- **No external images**: All graphics procedurally generated
- **Smooth animation**: Frame-based, tied to game logic
- **Scalable**: Works on any grid size

## Future Enhancements

Possible additions to sprite system:

1. **Zombie variants**:
   - Fast zombie: Red tint, motion blur
   - Tank zombie: Larger size, darker colors
   - Smart zombie: Different eye color

2. **Player animations**:
   - Walking animation when moving
   - Idle animation when stationary
   - Damaged state when hit

3. **Special effects**:
   - Particle effects for swamp drowning
   - Death animation for zombies
   - Powerup glow effects

4. **Environmental sprites**:
   - Animated swamp water
   - Grid tile variations
   - Background decorations

## Testing

To see the sprites in action:

1. Open http://localhost:8000
2. Start the game
3. Watch zombies walk toward you with animated limbs
4. Observe direction indicators showing zombie movement
5. Notice the bobbing motion as they approach

The animation is most noticeable when multiple zombies are moving from different directions!

---

**Version**: 1.1 (Sprite System)
**Last Updated**: January 14, 2026
