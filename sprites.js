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

        // Draw zombie based on direction
        switch(direction) {
            case 'left':
                this.drawZombieLeft(ctx, radius, frame);
                break;
            case 'right':
                this.drawZombieRight(ctx, radius, frame);
                break;
            case 'up':
                this.drawZombieBack(ctx, radius, frame);
                break;
            case 'down':
                this.drawZombieFront(ctx, radius, frame);
                break;
        }

        ctx.restore();
    }

    // Zombie walking LEFT (side view, facing left)
    drawZombieLeft(ctx, radius, frame) {
        const headSize = radius * 0.7;

        // Body (side view - narrower)
        ctx.fillStyle = '#6b0000';
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.6, radius * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#8b0000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Head (side profile)
        ctx.fillStyle = '#5a8a5a';
        ctx.beginPath();
        ctx.ellipse(-radius * 0.2, -radius * 0.8, headSize * 0.8, headSize, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#4a7a4a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // One visible eye (left side)
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(-headSize * 0.5, -radius * 0.8 - headSize * 0.1, headSize * 0.2, 0, Math.PI * 2);
        ctx.fill();
        // Eye glow
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(-headSize * 0.5, -radius * 0.8 - headSize * 0.1, headSize * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Arms - front arm swings more
        const armSwing = (frame === 1 || frame === 2) ? 0.5 : -0.3;
        this.drawZombieSideArm(ctx, -radius * 0.3, 0, armSwing, radius, true); // Front arm
        this.drawZombieSideArm(ctx, radius * 0.1, 0, -armSwing * 0.5, radius, false); // Back arm

        // Legs - alternating
        const legForward = (frame === 1 || frame === 2) ? 0.6 : -0.4;
        this.drawZombieSideLeg(ctx, -radius * 0.2, radius * 0.8, legForward);
        this.drawZombieSideLeg(ctx, radius * 0.2, radius * 0.8, -legForward);
    }

    // Zombie walking RIGHT (side view, facing right)
    drawZombieRight(ctx, radius, frame) {
        ctx.scale(-1, 1); // Mirror the left-facing sprite
        this.drawZombieLeft(ctx, radius, frame);
    }

    // Zombie walking DOWN (front view, toward camera)
    drawZombieFront(ctx, radius, frame) {
        const headSize = radius * 0.7;

        // Body (front view)
        ctx.fillStyle = '#6b0000';
        ctx.beginPath();
        ctx.ellipse(0, 0, radius, radius * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#8b0000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Head
        ctx.fillStyle = '#5a8a5a';
        ctx.beginPath();
        ctx.arc(0, -radius * 0.8, headSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#4a7a4a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Both eyes visible (front view)
        ctx.fillStyle = '#ffff00';
        const eyeOffset = headSize * 0.35;
        const eyeSize = headSize * 0.25;

        // Left eye
        ctx.beginPath();
        ctx.arc(-eyeOffset, -radius * 0.8, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        // Right eye
        ctx.beginPath();
        ctx.arc(eyeOffset, -radius * 0.8, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Eye glow
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(-eyeOffset, -radius * 0.8, eyeSize * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeOffset, -radius * 0.8, eyeSize * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Mouth (open, menacing)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -radius * 0.8 + headSize * 0.4, headSize * 0.3, 0.2, Math.PI - 0.2);
        ctx.stroke();

        // Arms swinging
        const armSwing = (frame === 1 || frame === 2) ? 0.4 : -0.3;
        this.drawZombieFrontArm(ctx, -radius * 0.9, 0, armSwing, radius);
        this.drawZombieFrontArm(ctx, radius * 0.9, 0, -armSwing, radius);

        // Legs walking toward camera
        const legSwing = (frame === 1 || frame === 2) ? 0.3 : -0.2;
        this.drawZombieFrontLeg(ctx, -radius * 0.35, radius * 0.8, legSwing);
        this.drawZombieFrontLeg(ctx, radius * 0.35, radius * 0.8, -legSwing);
    }

    // Zombie walking UP (back view, away from camera)
    drawZombieBack(ctx, radius, frame) {
        const headSize = radius * 0.7;

        // Body (back view)
        ctx.fillStyle = '#6b0000';
        ctx.beginPath();
        ctx.ellipse(0, 0, radius, radius * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#8b0000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Head (back of head, no face visible)
        ctx.fillStyle = '#4a7a4a'; // Darker shade for back of head
        ctx.beginPath();
        ctx.arc(0, -radius * 0.8, headSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#3a6a3a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Hair/back of head detail
        ctx.strokeStyle = '#3a6a3a';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(-headSize * 0.4 + i * headSize * 0.4, -radius * 0.8 - headSize * 0.5);
            ctx.lineTo(-headSize * 0.3 + i * headSize * 0.3, -radius * 0.8 + headSize * 0.5);
            ctx.stroke();
        }

        // Arms swinging (back view)
        const armSwing = (frame === 1 || frame === 2) ? -0.4 : 0.3;
        this.drawZombieBackArm(ctx, -radius * 0.9, 0, armSwing, radius);
        this.drawZombieBackArm(ctx, radius * 0.9, 0, -armSwing, radius);

        // Legs walking away
        const legSwing = (frame === 1 || frame === 2) ? 0.3 : -0.2;
        this.drawZombieFrontLeg(ctx, -radius * 0.35, radius * 0.8, legSwing);
        this.drawZombieFrontLeg(ctx, radius * 0.35, radius * 0.8, -legSwing);
    }

    // Side view arm (for left/right walking)
    drawZombieSideArm(ctx, x, y, angle, radius, isFront) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = isFront ? '#5a8a5a' : '#4a7a4a'; // Front arm brighter
        ctx.lineWidth = isFront ? 3 : 2;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, radius * 0.7);
        ctx.stroke();

        // Hand
        ctx.fillStyle = isFront ? '#4a7a4a' : '#3a6a3a';
        ctx.beginPath();
        ctx.arc(0, radius * 0.7, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Side view leg (for left/right walking)
    drawZombieSideLeg(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 9);
        ctx.stroke();

        // Foot (pointing forward in side view)
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath();
        ctx.ellipse(0, 9, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Front view arm (for down walking)
    drawZombieFrontArm(ctx, x, y, angle, radius) {
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
        ctx.arc(0, radius * 0.8, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Front view leg (for down/up walking)
    drawZombieFrontLeg(ctx, x, y, angle) {
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

    // Back view arm (for up walking)
    drawZombieBackArm(ctx, x, y, angle, radius) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = '#4a7a4a'; // Darker for back view
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, radius * 0.7);
        ctx.stroke();

        // Hand
        ctx.fillStyle = '#3a6a3a';
        ctx.beginPath();
        ctx.arc(0, radius * 0.7, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
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
        // Use Date.now() for continuous animation instead of turn-based
        const animTime = Math.floor(Date.now() / 250); // Change frame every 250ms
        const frameIndex = animTime % 4; // 4 frames per direction

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
