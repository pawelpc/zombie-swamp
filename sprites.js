// ========================================
// ZOMBIE SWAMP - Sprite System
// ========================================

class SpriteRenderer {
    constructor() {
        this.animationFrame = 0;
        this.animationSpeed = 8; // Frames per animation cycle
        this.sprites = {};
        this.initializeSprites();
    }

    initializeSprites() {
        // Create sprite sheets for each entity type
        this.sprites.zombie = this.createZombieSprites();
        this.sprites.player = this.createPlayerSprites();
    }

    // Create zombie sprites with directional animations
    createZombieSprites() {
        return {
            up: this.generateZombieFrames('up'),
            down: this.generateZombieFrames('down'),
            left: this.generateZombieFrames('left'),
            right: this.generateZombieFrames('right')
        };
    }

    // Generate animation frames for zombie in given direction
    generateZombieFrames(direction) {
        const frames = [];
        const frameCount = 4; // 4 frames per walk cycle

        for (let i = 0; i < frameCount; i++) {
            frames.push({
                direction: direction,
                frame: i,
                draw: (ctx, x, y, size) => this.drawZombie(ctx, x, y, size, direction, i)
            });
        }

        return frames;
    }

    // Draw zombie sprite with animation
    drawZombie(ctx, x, y, size, direction, frame) {
        const pixelX = x * size + size / 2;
        const pixelY = y * size + size / 2;
        const radius = size / 3;

        ctx.save();
        ctx.translate(pixelX, pixelY);

        // Bobbing animation based on frame
        const bobOffset = Math.sin((frame / 4) * Math.PI * 2) * 2;
        ctx.translate(0, bobOffset);

        // Body (dark red/brown zombie color)
        ctx.fillStyle = '#6b0000';
        ctx.beginPath();
        ctx.ellipse(0, 0, radius, radius * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body outline
        ctx.strokeStyle = '#8b0000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Head
        const headSize = radius * 0.7;
        ctx.fillStyle = '#5a8a5a'; // Zombie green skin
        ctx.beginPath();
        ctx.arc(0, -radius * 0.8, headSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#4a7a4a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Eyes (glowing yellow)
        ctx.fillStyle = '#ffff00';
        const eyeOffset = headSize * 0.3;
        const eyeSize = headSize * 0.2;

        // Left eye
        ctx.beginPath();
        ctx.arc(-eyeOffset, -radius * 0.8 - headSize * 0.1, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Right eye
        ctx.beginPath();
        ctx.arc(eyeOffset, -radius * 0.8 - headSize * 0.1, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Eye glow effect
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(-eyeOffset, -radius * 0.8 - headSize * 0.1, eyeSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeOffset, -radius * 0.8 - headSize * 0.1, eyeSize * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Mouth (jagged/undead)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-headSize * 0.3, -radius * 0.8 + headSize * 0.4);
        ctx.lineTo(-headSize * 0.1, -radius * 0.8 + headSize * 0.3);
        ctx.lineTo(0, -radius * 0.8 + headSize * 0.4);
        ctx.lineTo(headSize * 0.1, -radius * 0.8 + headSize * 0.3);
        ctx.lineTo(headSize * 0.3, -radius * 0.8 + headSize * 0.4);
        ctx.stroke();

        // Arms - animated based on walking frame
        const armSwing = Math.sin((frame / 4) * Math.PI * 2) * 0.3;
        this.drawZombieArm(ctx, -radius * 0.8, 0, armSwing, radius);
        this.drawZombieArm(ctx, radius * 0.8, 0, -armSwing, radius);

        // Legs - animated based on walking frame
        const legSwing = Math.sin((frame / 4) * Math.PI * 2 + Math.PI) * 0.4;
        this.drawZombieLeg(ctx, -radius * 0.3, radius * 0.8, legSwing);
        this.drawZombieLeg(ctx, radius * 0.3, radius * 0.8, -legSwing);

        // Direction indicator (small arrow/marker)
        this.drawDirectionIndicator(ctx, direction, radius);

        ctx.restore();
    }

    drawZombieArm(ctx, x, y, angle, radius) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = '#5a8a5a';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, radius * 0.8);
        ctx.stroke();

        // Hand
        ctx.fillStyle = '#4a7a4a';
        ctx.beginPath();
        ctx.arc(0, radius * 0.8, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawZombieLeg(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 8);
        ctx.stroke();

        // Foot
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.arc(0, 8, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawDirectionIndicator(ctx, direction, radius) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.beginPath();

        const offset = radius * 1.5;
        switch(direction) {
            case 'up':
                ctx.moveTo(0, -offset);
                ctx.lineTo(-3, -offset + 5);
                ctx.lineTo(3, -offset + 5);
                break;
            case 'down':
                ctx.moveTo(0, offset);
                ctx.lineTo(-3, offset - 5);
                ctx.lineTo(3, offset - 5);
                break;
            case 'left':
                ctx.moveTo(-offset, 0);
                ctx.lineTo(-offset + 5, -3);
                ctx.lineTo(-offset + 5, 3);
                break;
            case 'right':
                ctx.moveTo(offset, 0);
                ctx.lineTo(offset - 5, -3);
                ctx.lineTo(offset - 5, 3);
                break;
        }

        ctx.closePath();
        ctx.fill();
    }

    // Create player sprites (enhanced version)
    createPlayerSprites() {
        return {
            default: (ctx, x, y, size) => this.drawPlayer(ctx, x, y, size)
        };
    }

    drawPlayer(ctx, x, y, size) {
        const pixelX = x * size + size / 2;
        const pixelY = y * size + size / 2;
        const radius = size / 3;

        ctx.save();
        ctx.translate(pixelX, pixelY);

        // Player body (hero green)
        ctx.fillStyle = '#4a9d5f';
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Player outline (brighter green)
        ctx.strokeStyle = '#5abd75';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Face details
        ctx.fillStyle = '#ffffff';
        // Left eye
        ctx.beginPath();
        ctx.arc(-radius * 0.3, -radius * 0.2, radius * 0.15, 0, Math.PI * 2);
        ctx.fill();
        // Right eye
        ctx.beginPath();
        ctx.arc(radius * 0.3, -radius * 0.2, radius * 0.15, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-radius * 0.3, -radius * 0.2, radius * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(radius * 0.3, -radius * 0.2, radius * 0.08, 0, Math.PI * 2);
        ctx.fill();

        // Smile
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, radius * 0.1, radius * 0.5, 0.2, Math.PI - 0.2);
        ctx.stroke();

        ctx.restore();
    }

    // Get current animation frame for zombie
    getZombieFrame(direction, turnNumber) {
        const frameIndex = Math.floor((turnNumber % (this.animationSpeed * 4)) / this.animationSpeed);
        return this.sprites.zombie[direction][frameIndex];
    }

    // Update animation (called each frame)
    updateAnimation() {
        this.animationFrame++;
    }
}

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpriteRenderer;
}
