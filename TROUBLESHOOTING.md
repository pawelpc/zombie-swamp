# Troubleshooting Guide - Zombie Swamp

## Player Movement Not Working

If the player (green circle) isn't moving when you press keys, try these steps:

### Step 1: Check Browser Console
1. Open the game in your browser
2. Press **F12** to open Developer Tools
3. Click the **Console** tab
4. Start the game and press arrow keys or WASD
5. Look for debug messages like:
   - "Game not running" - means you need to click "Start Game"
   - "Cannot move yet - wait for tick" - means you pressed the key between turns
   - "Queuing move: {x: 0, y: -1}" - means input is being registered
   - "Player moved to (x, y)" - means movement is working

### Step 2: Verify Timing
- **Listen for the tick sound** - this happens every 1 second
- You can only input movement **AFTER** you hear the tick
- You have about 0.9 seconds to press a key after each tick
- The game border will glow brighter when you can move

### Step 3: Check Game State
Make sure:
- You clicked "Start Game" button
- You're on the game screen (not menu)
- The game isn't paused or frozen
- You can see the grid with player (green) and zombies (red)

### Step 4: Test Keys
Try different keys to see if the issue is key-specific:
- Arrow Up / W
- Arrow Down / S
- Arrow Left / A
- Arrow Right / D

### Step 5: Browser Compatibility
If movement still doesn't work:
- Try a different browser (Chrome, Firefox, Edge recommended)
- Make sure JavaScript is enabled
- Disable browser extensions that might interfere
- Check if the page loaded all resources (refresh with Ctrl+F5)

## Debug Mode

The current build includes console logging to help diagnose issues:

### What to Look For in Console:

**Good signs:**
```
Player queued move: {x: 0, y: -1}
Attempting to move from (7, 7) to (7, 6)
Player moved to (7, 6)
```

**Problem signs:**
```
Game not running
→ Solution: Click "Start Game"

Cannot move yet - wait for tick
→ Solution: Wait for the tick sound, then press key

No queued move to execute
→ Solution: Make sure you're pressing keys AFTER the tick sound
```

## Common Issues

### Issue: "I press keys but nothing happens"
**Solution**: The turn-based system requires you to press keys within the movement window (right after the tick sound). Wait for the tick, then immediately press your movement key.

### Issue: "The game starts but I don't see anything"
**Solution**:
1. Check browser console for errors
2. Make sure all files are in the same directory
3. Try opening index.html directly in browser (not through file explorer)
4. Verify canvas is loading (should see a black grid with green/red circles)

### Issue: "No sound playing"
**Solution**:
1. Check system volume
2. Click anywhere on the page to enable audio (browser autoplay policy)
3. Try refreshing the page
4. Check if Web Audio API is supported (works in modern browsers)

### Issue: "Player moves but in wrong direction"
**Solution**: This shouldn't happen, but if it does:
1. Check console for coordinate logs
2. Report the specific keys you pressed
3. Note which direction player actually moved

### Issue: "Game is too fast/slow"
**Solution**: The game runs at 1 turn per second. This is intentional. The timing is controlled by:
```javascript
TURN_DURATION: 1000 // 1 second = 1000ms
```

## Technical Details

### How Movement Works:
1. Every 1 second, the game executes a "turn"
2. At the start of each turn, a tick sound plays
3. You have 900ms to press a movement key
4. Your input is "queued" for execution
5. At the next turn, your queued move executes
6. Zombies move simultaneously with your movement

### Input Flow:
```
Tick Sound → Movement Window Opens (900ms)
→ Player Presses Key → Move Queued
→ Next Tick → Move Executes → Render
```

## Still Having Issues?

If you've tried everything and movement still doesn't work:

1. **Copy the console logs** (Ctrl+A in console, Ctrl+C)
2. **Note your browser** (Chrome/Firefox/Safari/Edge + version)
3. **Describe what happens** when you press keys
4. **Report the issue** with the above information

## Advanced Debugging

For developers, you can modify the code to help debug:

### Increase Movement Window
In `game.js`, find:
```javascript
setTimeout(() => {
    this.state.canMove = false;
    this.canvas.classList.remove('can-move');
}, 900);
```
Change `900` to `1500` for a longer movement window.

### Slow Down Game Speed
In `game.js`, find:
```javascript
const CONFIG = {
    TURN_DURATION: 1000,
```
Change `1000` to `2000` for 2 seconds per turn.

### Add Visual Indicators
The canvas should glow when you can move (`.can-move` class adds brighter shadow). If you don't see this, check CSS is loaded.

---

**Version**: 1.0
**Last Updated**: January 14, 2026
