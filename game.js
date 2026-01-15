// ========================================
// ZOMBIE SWAMP - Main Game Engine
// ========================================

// Game Configuration
const CONFIG = {
    GRID_SIZE: 15,
    TILE_SIZE: 40,
    TURN_DURATION: 1000, // 1 second per turn
    INITIAL_LIVES: 3,
    POINTS: {
        ZOMBIE_KILL: 100,
        LEVEL_COMPLETE: 500,
        COMBO_MULTIPLIER: 1.5,
        SPEED_BONUS: 50,
        NO_POWERUP_BONUS: 200
    }
};

// Tile Types
const TILE = {
    EMPTY: 0,
    SWAMP: 1,
    PLAYER: 2,
    ZOMBIE: 3,
    POWERUP: 4
};

// Direction Vectors
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

// Game State
class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.score = 0;
        this.level = 1;
        this.lives = CONFIG.INITIAL_LIVES;
        this.zombiesKilled = 0;
        this.combo = 0;
        this.lastKillTurn = 0;
        this.currentTurn = 0;
        this.activePowerups = [];
        this.canMove = true;
    }
}

// Entity Base Class
class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    isAt(x, y) {
        return this.x === x && this.y === y;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Player Class
class Player extends Entity {
    constructor(x, y) {
        super(x, y);
        this.hasShield = false;
        this.queuedMove = null;
    }

    queueMove(direction) {
        console.log('Player queued move:', direction);
        this.queuedMove = direction;
    }

    executeMove(grid) {
        if (!this.queuedMove) {
            console.log('No queued move to execute');
            return;
        }

        const newX = this.x + this.queuedMove.x;
        const newY = this.y + this.queuedMove.y;

        console.log(`Attempting to move from (${this.x}, ${this.y}) to (${newX}, ${newY})`);

        // Check bounds
        if (newX >= 0 && newX < CONFIG.GRID_SIZE && newY >= 0 && newY < CONFIG.GRID_SIZE) {
            this.moveTo(newX, newY);
            console.log(`Player moved to (${this.x}, ${this.y})`);
        } else {
            console.log('Move out of bounds');
        }

        this.queuedMove = null;
    }
}

// Zombie Class
class Zombie extends Entity {
    constructor(x, y, type = 'basic') {
        super(x, y);
        this.type = type;
        this.alive = true;
        this.direction = 'down'; // Current facing direction
        this.lastMove = null;
    }

    calculateMove(player) {
        // Simple AI: Move toward player
        const dx = player.x - this.x;
        const dy = player.y - this.y;

        // Prioritize larger distance and determine direction
        if (Math.abs(dx) > Math.abs(dy)) {
            this.direction = dx > 0 ? 'right' : 'left';
            return dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
        } else if (Math.abs(dy) > 0) {
            this.direction = dy > 0 ? 'down' : 'up';
            return dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
        }

        return null; // No movement needed (shouldn't happen)
    }

    executeMove(player, grid) {
        if (!this.alive) return;

        const move = this.calculateMove(player);
        if (move) {
            const newX = this.x + move.x;
            const newY = this.y + move.y;

            // Check bounds
            if (newX >= 0 && newX < CONFIG.GRID_SIZE && newY >= 0 && newY < CONFIG.GRID_SIZE) {
                this.lastMove = move;
                this.moveTo(newX, newY);
            }
        }
    }
}

// Game Class
class Game {
    constructor() {
        this.state = new GameState();
        this.grid = [];
        this.swamps = [];
        this.player = null;
        this.zombies = [];
        this.spriteRenderer = new SpriteRenderer();
        this.audioManager = new AudioManager();
        this.turnTimer = null;
        this.isRunning = false;

        this.initializeDOM();
    }

    initializeDOM() {
        // Screen references
        this.screens = {
            menu: document.getElementById('menu-screen'),
            instructions: document.getElementById('instructions-screen'),
            game: document.getElementById('game-screen'),
            gameOver: document.getElementById('game-over-screen'),
            levelComplete: document.getElementById('level-complete-screen')
        };

        // Button listeners
        document.getElementById('start-button').addEventListener('click', () => this.startGame());
        document.getElementById('instructions-button').addEventListener('click', () => this.showInstructions());
        document.getElementById('back-button').addEventListener('click', () => this.showMenu());
        document.getElementById('retry-button').addEventListener('click', () => this.startGame());
        document.getElementById('menu-button').addEventListener('click', () => this.showMenu());
        document.getElementById('next-level-button').addEventListener('click', () => this.nextLevel());

        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleInput(e));

        // Canvas setup
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = CONFIG.GRID_SIZE * CONFIG.TILE_SIZE;
        this.canvas.height = CONFIG.GRID_SIZE * CONFIG.TILE_SIZE;
    }

    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
        this.screens[screenName].classList.add('active');
    }

    showMenu() {
        this.stopGame();
        this.showScreen('menu');
    }

    showInstructions() {
        this.showScreen('instructions');
    }

    startGame() {
        this.state.reset();
        this.initializeLevel();
        this.showScreen('game');
        this.startTurnTimer();
        this.isRunning = true;
        this.startAnimationLoop();
    }

    stopGame() {
        this.isRunning = false;
        if (this.turnTimer) {
            clearInterval(this.turnTimer);
            this.turnTimer = null;
        }
        if (this.groanTimer) {
            clearInterval(this.groanTimer);
            this.groanTimer = null;
        }
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    startAnimationLoop() {
        const animate = () => {
            if (this.isRunning) {
                this.render();
                this.animationFrameId = requestAnimationFrame(animate);
            }
        };
        animate();
    }

    initializeLevel() {
        // Create empty grid
        this.grid = Array(CONFIG.GRID_SIZE).fill(null).map(() =>
            Array(CONFIG.GRID_SIZE).fill(TILE.EMPTY)
        );

        // Clear entities
        this.swamps = [];
        this.zombies = [];

        // Place player in center
        const center = Math.floor(CONFIG.GRID_SIZE / 2);
        this.player = new Player(center, center);

        // Generate level based on difficulty
        this.generateLevel();

        // Update UI
        this.updateUI();
    }

    generateLevel() {
        const zombieCount = this.getZombieCount();
        const swampCount = this.getSwampCount();

        // Generate swamps
        for (let i = 0; i < swampCount; i++) {
            this.placeSwamp();
        }

        // Generate zombies
        for (let i = 0; i < zombieCount; i++) {
            this.placeZombie();
        }
    }

    getZombieCount() {
        // Scale zombie count with level
        if (this.state.level <= 5) return 3 + this.state.level;
        if (this.state.level <= 10) return 5 + this.state.level;
        if (this.state.level <= 20) return 8 + Math.floor(this.state.level / 2);
        return 15 + Math.floor(this.state.level / 3);
    }

    getSwampCount() {
        // More swamps in early levels, fewer in later levels
        if (this.state.level <= 5) return 15;
        if (this.state.level <= 10) return 12;
        if (this.state.level <= 20) return 10;
        return 8;
    }

    placeSwamp() {
        const pos = this.getRandomEmptyPosition();
        if (pos) {
            this.swamps.push(pos);
            this.grid[pos.y][pos.x] = TILE.SWAMP;
        }
    }

    placeZombie() {
        const pos = this.getRandomEmptyPosition(3); // Min distance 3 from player
        if (pos) {
            const zombie = new Zombie(pos.x, pos.y);
            this.zombies.push(zombie);
        }
    }

    getRandomEmptyPosition(minDistanceFromPlayer = 0) {
        const maxAttempts = 100;
        for (let i = 0; i < maxAttempts; i++) {
            const x = Math.floor(Math.random() * CONFIG.GRID_SIZE);
            const y = Math.floor(Math.random() * CONFIG.GRID_SIZE);

            // Check if empty
            if (this.grid[y][x] !== TILE.EMPTY) continue;

            // Check if player position
            if (this.player && this.player.isAt(x, y)) continue;

            // Check distance from player
            if (this.player && minDistanceFromPlayer > 0) {
                const dist = Math.abs(x - this.player.x) + Math.abs(y - this.player.y);
                if (dist < minDistanceFromPlayer) continue;
            }

            return { x, y };
        }
        return null;
    }

    startTurnTimer() {
        // Initial render
        this.render();
        this.updateUI();

        // Set initial move window
        this.state.canMove = true;
        this.canvas.classList.add('can-move');

        this.turnTimer = setInterval(() => {
            this.executeTurn();
        }, CONFIG.TURN_DURATION);

        // Add ambient zombie groans every 3-5 seconds
        this.groanTimer = setInterval(() => {
            if (this.isRunning && this.zombies.length > 0) {
                this.playSound('groan');
            }
        }, 3000 + Math.random() * 2000);
    }

    executeTurn() {
        if (!this.isRunning) return;

        this.state.currentTurn++;

        // Play tick sound
        this.playSound('tick');

        // Execute player move (from queued input)
        this.player.executeMove(this.grid);

        // Execute zombie moves
        this.zombies.forEach(zombie => {
            zombie.executeMove(this.player, this.grid);
        });

        // Check collisions
        this.checkCollisions();

        // Check win condition
        if (this.checkLevelComplete()) {
            this.completeLevel();
            return;
        }

        // Update UI (rendering happens in animation loop)
        this.updateUI();

        // Open movement window for next turn (900ms to input, 100ms buffer)
        this.state.canMove = true;
        this.canvas.classList.add('can-move');

        setTimeout(() => {
            this.state.canMove = false;
            this.canvas.classList.remove('can-move');
        }, 900);
    }

    checkCollisions() {
        // Check zombie-swamp collisions
        this.zombies = this.zombies.filter(zombie => {
            const onSwamp = this.swamps.some(swamp =>
                zombie.isAt(swamp.x, swamp.y)
            );

            if (onSwamp) {
                zombie.alive = false;
                this.handleZombieKilled();
                return false;
            }
            return true;
        });

        // Check player-swamp collision
        const playerOnSwamp = this.swamps.some(swamp =>
            this.player.isAt(swamp.x, swamp.y)
        );

        if (playerOnSwamp) {
            this.handlePlayerDeath('You stepped into a swamp!');
            return;
        }

        // Check player-zombie collision
        const playerHitZombie = this.zombies.some(zombie =>
            zombie.isAt(this.player.x, this.player.y)
        );

        if (playerHitZombie) {
            if (this.player.hasShield) {
                this.player.hasShield = false;
                // Remove the zombie that hit player
                this.zombies = this.zombies.filter(z =>
                    !z.isAt(this.player.x, this.player.y)
                );
                this.showMessage('Shield broken!');
            } else {
                this.handlePlayerDeath('A zombie got you!');
            }
        }
    }

    handleZombieKilled() {
        this.state.zombiesKilled++;

        // Check combo
        if (this.state.currentTurn - this.state.lastKillTurn <= 2) {
            this.state.combo++;
            if (this.state.combo >= 2) {
                this.showCombo(this.state.combo);
            }
        } else {
            this.state.combo = 1;
        }

        this.state.lastKillTurn = this.state.currentTurn;

        // Calculate score
        const points = Math.floor(CONFIG.POINTS.ZOMBIE_KILL *
            Math.pow(CONFIG.POINTS.COMBO_MULTIPLIER, this.state.combo - 1));
        this.state.score += points;

        this.playSound('splash');
    }

    handlePlayerDeath(message) {
        this.state.lives--;
        this.playSound('death');

        if (this.state.lives <= 0) {
            this.gameOver();
        } else {
            this.showMessage(message);
            // Reset player to center
            const center = Math.floor(CONFIG.GRID_SIZE / 2);
            this.player.moveTo(center, center);
            this.updateUI();
        }
    }

    checkLevelComplete() {
        return this.zombies.length === 0;
    }

    completeLevel() {
        this.stopGame();

        // Calculate bonuses
        const levelBonus = CONFIG.POINTS.LEVEL_COMPLETE;
        this.state.score += levelBonus;

        // Show level complete screen
        document.getElementById('level-score').textContent = this.state.score - levelBonus;
        document.getElementById('level-bonus').textContent = levelBonus;
        document.getElementById('level-total').textContent = this.state.score;

        this.playSound('victory');
        this.showScreen('levelComplete');
    }

    nextLevel() {
        this.state.level++;
        this.state.combo = 0;

        // Award extra life every 5 levels
        if (this.state.level % 5 === 0) {
            this.state.lives++;
            this.showMessage('Extra life earned!');
        }

        this.initializeLevel();
        this.showScreen('game');
        this.isRunning = true;
        this.startTurnTimer();
        this.startAnimationLoop(); // Restart the animation loop
    }

    gameOver() {
        this.stopGame();

        // Update game over screen
        document.getElementById('final-score').textContent = this.state.score;
        document.getElementById('final-level').textContent = this.state.level;
        document.getElementById('total-zombies').textContent = this.state.zombiesKilled;

        this.playSound('gameOver');
        this.showScreen('gameOver');
    }

    handleInput(event) {
        if (!this.isRunning) {
            console.log('Game not running');
            return;
        }

        if (!this.state.canMove) {
            console.log('Cannot move yet - wait for tick');
            return;
        }

        let direction = null;

        switch(event.key.toLowerCase()) {
            case 'arrowup':
            case 'w':
                direction = DIRECTIONS.UP;
                event.preventDefault();
                break;
            case 'arrowdown':
            case 's':
                direction = DIRECTIONS.DOWN;
                event.preventDefault();
                break;
            case 'arrowleft':
            case 'a':
                direction = DIRECTIONS.LEFT;
                event.preventDefault();
                break;
            case 'arrowright':
            case 'd':
                direction = DIRECTIONS.RIGHT;
                event.preventDefault();
                break;
        }

        if (direction) {
            console.log('Queuing move:', direction);
            this.player.queueMove(direction);
            // Rendering happens in animation loop
        }
    }

    updateUI() {
        document.getElementById('score').textContent = this.state.score;
        document.getElementById('level').textContent = this.state.level;
        document.getElementById('zombie-count').textContent = this.zombies.length;

        // Update lives display
        const hearts = '❤️'.repeat(Math.max(0, this.state.lives));
        document.getElementById('lives').textContent = hearts || '💀';
    }

    render() {
        if (!this.ctx) return;

        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid lines
        this.drawGrid();

        // Draw swamps
        this.swamps.forEach(swamp => {
            this.drawTile(swamp.x, swamp.y, '#2a5f7f', '#1a4f6f');
        });

        // Draw zombies with sprite system
        this.zombies.forEach(zombie => {
            const frame = this.spriteRenderer.getZombieFrame(zombie.direction, this.state.currentTurn);
            frame.draw(this.ctx, zombie.x, zombie.y, CONFIG.TILE_SIZE);
        });

        // Draw player with sprite system
        this.spriteRenderer.sprites.player.default(this.ctx, this.player.x, this.player.y, CONFIG.TILE_SIZE);

        // Draw shield effect if player has shield
        if (this.player.hasShield) {
            this.drawShieldEffect(this.player.x, this.player.y);
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = '#2a2a2a';
        this.ctx.lineWidth = 1;

        for (let i = 0; i <= CONFIG.GRID_SIZE; i++) {
            // Vertical lines
            this.ctx.beginPath();
            this.ctx.moveTo(i * CONFIG.TILE_SIZE, 0);
            this.ctx.lineTo(i * CONFIG.TILE_SIZE, this.canvas.height);
            this.ctx.stroke();

            // Horizontal lines
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * CONFIG.TILE_SIZE);
            this.ctx.lineTo(this.canvas.width, i * CONFIG.TILE_SIZE);
            this.ctx.stroke();
        }
    }

    drawTile(x, y, fillColor, borderColor) {
        const pixelX = x * CONFIG.TILE_SIZE;
        const pixelY = y * CONFIG.TILE_SIZE;

        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(pixelX, pixelY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);

        if (borderColor) {
            this.ctx.strokeStyle = borderColor;
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(pixelX, pixelY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        }
    }

    drawShieldEffect(x, y) {
        const pixelX = x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
        const pixelY = y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
        const radius = CONFIG.TILE_SIZE / 3;

        // Animated shield ring
        const pulseScale = 1 + Math.sin(this.state.currentTurn * 0.3) * 0.1;

        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.7;
        this.ctx.beginPath();
        this.ctx.arc(pixelX, pixelY, (radius + 8) * pulseScale, 0, Math.PI * 2);
        this.ctx.stroke();

        // Outer glow
        this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(pixelX, pixelY, (radius + 12) * pulseScale, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.globalAlpha = 1.0;
    }

    showCombo(combo) {
        const popup = document.createElement('div');
        popup.className = 'combo-popup';
        popup.textContent = `${combo}× COMBO!`;
        document.body.appendChild(popup);

        this.playSound('combo', combo);

        setTimeout(() => {
            document.body.removeChild(popup);
        }, 1000);
    }

    showMessage(message) {
        // Simple alert for now - can be enhanced with custom UI
        console.log(message);
    }

    playSound(soundName, ...args) {
        if (this.audioManager) {
            this.audioManager.play(soundName, ...args);
        }
    }
}

// Initialize game when page loads
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
});
