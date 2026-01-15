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
        this.sprites.swamp = this.createSwampSprites();
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

    // Create player sprites with directional animations
    createPlayerSprites() {
        return {
            up: this.generatePlayerFrames('up'),
            down: this.generatePlayerFrames('down'),
            left: this.generatePlayerFrames('left'),
            right: this.generatePlayerFrames('right')
        };
    }

    // Generate animation frames for player in given direction
    generatePlayerFrames(direction) {
        const frames = [];
        const frameCount = 4; // 4 frames per walk cycle

        for (let i = 0; i < frameCount; i++) {
            frames.push({
                direction: direction,
                frame: i,
                draw: (ctx, x, y, size) => this.drawPlayerDirectional(ctx, x, y, size, direction, i)
            });
        }

        return frames;
    }

    // Draw player sprite with animation
    drawPlayerDirectional(ctx, x, y, size, direction, frame) {
        const pixelX = x * size + size / 2;
        const pixelY = y * size + size / 2;
        const radius = size / 3;

        ctx.save();
        ctx.translate(pixelX, pixelY);

        // Bobbing animation based on frame
        const bobOffset = Math.sin((frame / 4) * Math.PI * 2) * 2;
        ctx.translate(0, bobOffset);

        // Draw player based on direction
        switch(direction) {
            case 'left':
                this.drawPlayerLeft(ctx, radius, frame);
                break;
            case 'right':
                this.drawPlayerRight(ctx, radius, frame);
                break;
            case 'up':
                this.drawPlayerBack(ctx, radius, frame);
                break;
            case 'down':
                this.drawPlayerFront(ctx, radius, frame);
                break;
        }

        ctx.restore();
    }

    // Player walking LEFT (side view, facing left)
    drawPlayerLeft(ctx, radius, frame) {
        const headSize = radius * 0.75;

        // Legs (drawn first, behind body) - side view narrower
        const legSwing = (frame === 1 || frame === 2) ? 0.5 : -0.4;
        this.drawPlayerSideLeg(ctx, -radius * 0.15, radius * 0.7, legSwing);
        this.drawPlayerSideLeg(ctx, radius * 0.15, radius * 0.7, -legSwing);

        // Body/Torso (hero armor) - side profile narrower
        ctx.fillStyle = '#3a7d5f'; // Darker green for armor
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.6, radius * 1.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2a6d4f';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Chest plate highlight (side view)
        ctx.fillStyle = '#4a9d6f';
        ctx.beginPath();
        ctx.ellipse(0, -radius * 0.1, radius * 0.4, radius * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Arms - front and back
        const armSwing = (frame === 1 || frame === 2) ? 0.4 : -0.3;
        this.drawPlayerSideArm(ctx, -radius * 0.3, 0, armSwing, radius, true); // Front arm
        this.drawPlayerSideArm(ctx, radius * 0.1, 0, -armSwing * 0.5, radius, false); // Back arm

        // Head (side profile)
        ctx.fillStyle = '#ffd7a8'; // Skin tone
        ctx.beginPath();
        ctx.ellipse(-radius * 0.15, -radius * 0.9, headSize * 0.8, headSize, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e0b88a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Hair (side profile)
        ctx.fillStyle = '#8b4513'; // Brown hair
        ctx.beginPath();
        ctx.ellipse(-headSize * 0.2, -radius * 0.9 - headSize * 0.2, headSize * 0.7, headSize * 0.6, 0, Math.PI, Math.PI * 2);
        ctx.fill();

        // Hair strands (side)
        ctx.strokeStyle = '#6b3513';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-headSize * 0.6, -radius * 0.9 - headSize * 0.6);
        ctx.lineTo(-headSize * 0.5, -radius * 0.9 - headSize * 0.2);
        ctx.stroke();

        // One visible eye (left side)
        ctx.fillStyle = '#ffffff';
        const eyeSize = headSize * 0.2;
        ctx.beginPath();
        ctx.arc(-headSize * 0.5, -radius * 0.9 - headSize * 0.05, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Pupil
        ctx.fillStyle = '#2a5f8f'; // Blue eye
        ctx.beginPath();
        ctx.arc(-headSize * 0.5, -radius * 0.9 - headSize * 0.05, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye highlight
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-headSize * 0.5 + eyeSize * 0.2, -radius * 0.9 - headSize * 0.15, eyeSize * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // Nose (side profile)
        ctx.strokeStyle = '#d0a88a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-headSize * 0.65, -radius * 0.9 + headSize * 0.05);
        ctx.lineTo(-headSize * 0.75, -radius * 0.9 + headSize * 0.15);
        ctx.lineTo(-headSize * 0.65, -radius * 0.9 + headSize * 0.18);
        ctx.stroke();

        // Mouth (side profile)
        ctx.strokeStyle = '#c08060';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(-headSize * 0.5, -radius * 0.9 + headSize * 0.35, headSize * 0.3, 0.3, 1.2);
        ctx.stroke();

        // Belt (side view)
        ctx.strokeStyle = '#8b6914';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-radius * 0.5, radius * 0.5);
        ctx.lineTo(radius * 0.5, radius * 0.5);
        ctx.stroke();
    }

    // Player walking RIGHT (side view, facing right)
    drawPlayerRight(ctx, radius, frame) {
        ctx.scale(-1, 1); // Mirror the left-facing sprite
        this.drawPlayerLeft(ctx, radius, frame);
    }

    // Player walking DOWN (front view, toward camera)
    drawPlayerFront(ctx, radius, frame) {
        const headSize = radius * 0.75;

        // Legs (drawn first, behind body)
        const legSwing = (frame === 1 || frame === 2) ? 0.3 : -0.2;
        this.drawPlayerFrontLeg(ctx, -radius * 0.3, radius * 0.7, legSwing);
        this.drawPlayerFrontLeg(ctx, radius * 0.3, radius * 0.7, -legSwing);

        // Body/Torso (hero armor)
        ctx.fillStyle = '#3a7d5f'; // Darker green for armor
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.85, radius * 1.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2a6d4f';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Chest plate highlight
        ctx.fillStyle = '#4a9d6f';
        ctx.beginPath();
        ctx.ellipse(0, -radius * 0.1, radius * 0.6, radius * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Arms swinging
        const armSwing = (frame === 1 || frame === 2) ? 0.4 : -0.3;
        this.drawPlayerFrontArm(ctx, -radius * 0.85, 0, armSwing, radius);
        this.drawPlayerFrontArm(ctx, radius * 0.85, 0, -armSwing, radius);

        // Head
        ctx.fillStyle = '#ffd7a8'; // Skin tone
        ctx.beginPath();
        ctx.arc(0, -radius * 0.9, headSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e0b88a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Hair
        ctx.fillStyle = '#8b4513'; // Brown hair
        ctx.beginPath();
        ctx.arc(0, -radius * 0.9 - headSize * 0.2, headSize * 0.9, Math.PI, Math.PI * 2);
        ctx.fill();

        // Hair strands
        ctx.strokeStyle = '#6b3513';
        ctx.lineWidth = 1.5;
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(i * headSize * 0.3, -radius * 0.9 - headSize * 0.7);
            ctx.lineTo(i * headSize * 0.25, -radius * 0.9 - headSize * 0.3);
            ctx.stroke();
        }

        // Eyes
        ctx.fillStyle = '#ffffff';
        const eyeOffset = headSize * 0.3;
        const eyeSize = headSize * 0.2;

        // Left eye
        ctx.beginPath();
        ctx.arc(-eyeOffset, -radius * 0.9 - headSize * 0.05, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        // Right eye
        ctx.beginPath();
        ctx.arc(eyeOffset, -radius * 0.9 - headSize * 0.05, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#2a5f8f'; // Blue eyes
        ctx.beginPath();
        ctx.arc(-eyeOffset, -radius * 0.9 - headSize * 0.05, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeOffset, -radius * 0.9 - headSize * 0.05, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye highlights (make eyes sparkle)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-eyeOffset + eyeSize * 0.2, -radius * 0.9 - headSize * 0.15, eyeSize * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeOffset + eyeSize * 0.2, -radius * 0.9 - headSize * 0.15, eyeSize * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // Eyebrows (heroic expression)
        ctx.strokeStyle = '#6b3513';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        // Left eyebrow
        ctx.beginPath();
        ctx.moveTo(-eyeOffset - eyeSize * 0.8, -radius * 0.9 - headSize * 0.35);
        ctx.lineTo(-eyeOffset + eyeSize * 0.5, -radius * 0.9 - headSize * 0.3);
        ctx.stroke();
        // Right eyebrow
        ctx.beginPath();
        ctx.moveTo(eyeOffset - eyeSize * 0.5, -radius * 0.9 - headSize * 0.3);
        ctx.lineTo(eyeOffset + eyeSize * 0.8, -radius * 0.9 - headSize * 0.35);
        ctx.stroke();

        // Nose
        ctx.strokeStyle = '#d0a88a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.9 + headSize * 0.05);
        ctx.lineTo(headSize * 0.1, -radius * 0.9 + headSize * 0.15);
        ctx.stroke();

        // Smile (confident hero)
        ctx.strokeStyle = '#c08060';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -radius * 0.9 + headSize * 0.3, headSize * 0.45, 0.15, Math.PI - 0.15);
        ctx.stroke();

        // Belt (optional detail)
        ctx.strokeStyle = '#8b6914';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-radius * 0.8, radius * 0.5);
        ctx.lineTo(radius * 0.8, radius * 0.5);
        ctx.stroke();

        // Belt buckle
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-radius * 0.15, radius * 0.4, radius * 0.3, radius * 0.2);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1;
        ctx.strokeRect(-radius * 0.15, radius * 0.4, radius * 0.3, radius * 0.2);
    }

    // Player walking UP (back view, away from camera)
    drawPlayerBack(ctx, radius, frame) {
        const headSize = radius * 0.75;

        // Legs (drawn first, behind body)
        const legSwing = (frame === 1 || frame === 2) ? 0.3 : -0.2;
        this.drawPlayerFrontLeg(ctx, -radius * 0.3, radius * 0.7, legSwing);
        this.drawPlayerFrontLeg(ctx, radius * 0.3, radius * 0.7, -legSwing);

        // Body/Torso (hero armor) - back view
        ctx.fillStyle = '#2a6d4f'; // Darker shade for back
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.85, radius * 1.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1a5d3f';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Backpack/Cape suggestion
        ctx.fillStyle = '#3a5f4f';
        ctx.beginPath();
        ctx.ellipse(0, -radius * 0.1, radius * 0.6, radius * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Arms swinging (back view)
        const armSwing = (frame === 1 || frame === 2) ? -0.4 : 0.3;
        this.drawPlayerBackArm(ctx, -radius * 0.85, 0, armSwing, radius);
        this.drawPlayerBackArm(ctx, radius * 0.85, 0, -armSwing, radius);

        // Head (back of head)
        ctx.fillStyle = '#ffd7a8'; // Skin tone
        ctx.beginPath();
        ctx.arc(0, -radius * 0.9, headSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e0b88a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Hair (back of head - fuller)
        ctx.fillStyle = '#8b4513'; // Brown hair
        ctx.beginPath();
        ctx.arc(0, -radius * 0.9, headSize * 0.95, 0, Math.PI * 2);
        ctx.fill();

        // Hair strands (back detail)
        ctx.strokeStyle = '#6b3513';
        ctx.lineWidth = 1.5;
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(i * headSize * 0.4, -radius * 0.9 - headSize * 0.6);
            ctx.lineTo(i * headSize * 0.3, -radius * 0.9 + headSize * 0.5);
            ctx.stroke();
        }

        // Neck/collar visible at top
        ctx.strokeStyle = '#3a7d5f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, -radius * 0.9 + headSize, headSize * 0.4, 0, Math.PI);
        ctx.stroke();

        // Belt (back view)
        ctx.strokeStyle = '#8b6914';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-radius * 0.8, radius * 0.5);
        ctx.lineTo(radius * 0.8, radius * 0.5);
        ctx.stroke();
    }

    // Side view arm for player
    drawPlayerSideArm(ctx, x, y, angle, radius, isFront) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = isFront ? '#ffd7a8' : '#e0b88a'; // Skin tone, front arm brighter
        ctx.lineWidth = isFront ? 3.5 : 2.5;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, radius * 0.6);
        ctx.stroke();

        // Hand
        ctx.fillStyle = isFront ? '#ffd7a8' : '#e0b88a';
        ctx.beginPath();
        ctx.arc(0, radius * 0.6, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Side view leg for player
    drawPlayerSideLeg(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = '#3a5f4f'; // Dark pants
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 8);
        ctx.stroke();

        // Boot
        ctx.fillStyle = '#4a3520'; // Brown boot
        ctx.beginPath();
        ctx.ellipse(0, 8, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Front view arm for player
    drawPlayerFrontArm(ctx, x, y, angle, radius) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = '#ffd7a8'; // Skin tone
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, radius * 0.6);
        ctx.stroke();

        // Hand
        ctx.fillStyle = '#ffd7a8';
        ctx.beginPath();
        ctx.arc(0, radius * 0.6, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Front view leg for player
    drawPlayerFrontLeg(ctx, x, y, angle) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = '#3a5f4f'; // Dark pants
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 8);
        ctx.stroke();

        // Boot
        ctx.fillStyle = '#4a3520'; // Brown boot
        ctx.beginPath();
        ctx.arc(0, 8, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Back view arm for player
    drawPlayerBackArm(ctx, x, y, angle, radius) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = '#e0b88a'; // Slightly darker skin for back
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, radius * 0.6);
        ctx.stroke();

        // Hand
        ctx.fillStyle = '#e0b88a';
        ctx.beginPath();
        ctx.arc(0, radius * 0.6, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawPlayer(ctx, x, y, size) {
        const pixelX = x * size + size / 2;
        const pixelY = y * size + size / 2;
        const radius = size / 3;

        ctx.save();
        ctx.translate(pixelX, pixelY);

        // Legs (drawn first, behind body)
        this.drawPlayerLeg(ctx, -radius * 0.3, radius * 0.7);
        this.drawPlayerLeg(ctx, radius * 0.3, radius * 0.7);

        // Body/Torso (hero armor)
        ctx.fillStyle = '#3a7d5f'; // Darker green for armor
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 0.85, radius * 1.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2a6d4f';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Chest plate highlight
        ctx.fillStyle = '#4a9d6f';
        ctx.beginPath();
        ctx.ellipse(0, -radius * 0.1, radius * 0.6, radius * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Arms
        this.drawPlayerArm(ctx, -radius * 0.85, 0, -0.2, radius);
        this.drawPlayerArm(ctx, radius * 0.85, 0, 0.2, radius);

        // Head
        const headSize = radius * 0.75;
        ctx.fillStyle = '#ffd7a8'; // Skin tone
        ctx.beginPath();
        ctx.arc(0, -radius * 0.9, headSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e0b88a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Hair
        ctx.fillStyle = '#8b4513'; // Brown hair
        ctx.beginPath();
        ctx.arc(0, -radius * 0.9 - headSize * 0.2, headSize * 0.9, Math.PI, Math.PI * 2);
        ctx.fill();

        // Hair strands
        ctx.strokeStyle = '#6b3513';
        ctx.lineWidth = 1.5;
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(i * headSize * 0.3, -radius * 0.9 - headSize * 0.7);
            ctx.lineTo(i * headSize * 0.25, -radius * 0.9 - headSize * 0.3);
            ctx.stroke();
        }

        // Eyes
        ctx.fillStyle = '#ffffff';
        const eyeOffset = headSize * 0.3;
        const eyeSize = headSize * 0.2;

        // Left eye
        ctx.beginPath();
        ctx.arc(-eyeOffset, -radius * 0.9 - headSize * 0.05, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        // Right eye
        ctx.beginPath();
        ctx.arc(eyeOffset, -radius * 0.9 - headSize * 0.05, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = '#2a5f8f'; // Blue eyes
        ctx.beginPath();
        ctx.arc(-eyeOffset, -radius * 0.9 - headSize * 0.05, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeOffset, -radius * 0.9 - headSize * 0.05, eyeSize * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye highlights (make eyes sparkle)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-eyeOffset + eyeSize * 0.2, -radius * 0.9 - headSize * 0.15, eyeSize * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeOffset + eyeSize * 0.2, -radius * 0.9 - headSize * 0.15, eyeSize * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // Eyebrows (heroic expression)
        ctx.strokeStyle = '#6b3513';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        // Left eyebrow
        ctx.beginPath();
        ctx.moveTo(-eyeOffset - eyeSize * 0.8, -radius * 0.9 - headSize * 0.35);
        ctx.lineTo(-eyeOffset + eyeSize * 0.5, -radius * 0.9 - headSize * 0.3);
        ctx.stroke();
        // Right eyebrow
        ctx.beginPath();
        ctx.moveTo(eyeOffset - eyeSize * 0.5, -radius * 0.9 - headSize * 0.3);
        ctx.lineTo(eyeOffset + eyeSize * 0.8, -radius * 0.9 - headSize * 0.35);
        ctx.stroke();

        // Nose
        ctx.strokeStyle = '#d0a88a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.9 + headSize * 0.05);
        ctx.lineTo(headSize * 0.1, -radius * 0.9 + headSize * 0.15);
        ctx.stroke();

        // Smile (confident hero)
        ctx.strokeStyle = '#c08060';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, -radius * 0.9 + headSize * 0.3, headSize * 0.45, 0.15, Math.PI - 0.15);
        ctx.stroke();

        // Belt (optional detail)
        ctx.strokeStyle = '#8b6914';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-radius * 0.8, radius * 0.5);
        ctx.lineTo(radius * 0.8, radius * 0.5);
        ctx.stroke();

        // Belt buckle
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(-radius * 0.15, radius * 0.4, radius * 0.3, radius * 0.2);
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1;
        ctx.strokeRect(-radius * 0.15, radius * 0.4, radius * 0.3, radius * 0.2);

        ctx.restore();
    }

    // Player arm
    drawPlayerArm(ctx, x, y, angle, radius) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.strokeStyle = '#ffd7a8'; // Skin tone
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, radius * 0.6);
        ctx.stroke();

        // Hand
        ctx.fillStyle = '#ffd7a8';
        ctx.beginPath();
        ctx.arc(0, radius * 0.6, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // Player leg
    drawPlayerLeg(ctx, x, y) {
        ctx.strokeStyle = '#3a5f4f'; // Dark pants
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 8);
        ctx.stroke();

        // Boot
        ctx.fillStyle = '#4a3520'; // Brown boot
        ctx.beginPath();
        ctx.arc(x, y + 8, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Get current animation frame for zombie
    getZombieFrame(direction, turnNumber) {
        // Use Date.now() for continuous animation instead of turn-based
        const animTime = Math.floor(Date.now() / 250); // Change frame every 250ms
        const frameIndex = animTime % 4; // 4 frames per direction

        return this.sprites.zombie[direction][frameIndex];
    }

    // Get current animation frame for player
    getPlayerFrame(direction, turnNumber) {
        // Use Date.now() for continuous animation instead of turn-based
        const animTime = Math.floor(Date.now() / 250); // Change frame every 250ms
        const frameIndex = animTime % 4; // 4 frames per direction

        return this.sprites.player[direction][frameIndex];
    }

    // Create swamp sprites with waving grass animation
    createSwampSprites() {
        const frames = [];
        const frameCount = 8; // 8 frames for smooth waving

        for (let i = 0; i < frameCount; i++) {
            frames.push({
                frame: i,
                draw: (ctx, x, y, size) => this.drawSwamp(ctx, x, y, size, i)
            });
        }

        return frames;
    }

    // Draw swamp tile with waving grass tufts
    drawSwamp(ctx, x, y, size, frame) {
        const pixelX = x * size;
        const pixelY = y * size;

        // Water/swamp base
        ctx.fillStyle = '#1a3f4f'; // Dark murky water
        ctx.fillRect(pixelX, pixelY, size, size);

        // Slightly lighter water patches for depth
        ctx.fillStyle = '#2a5f6f';
        ctx.fillRect(pixelX + size * 0.2, pixelY + size * 0.3, size * 0.3, size * 0.3);
        ctx.fillRect(pixelX + size * 0.6, pixelY + size * 0.1, size * 0.25, size * 0.25);
        ctx.fillRect(pixelX + size * 0.1, pixelY + size * 0.7, size * 0.2, size * 0.2);

        // Border
        ctx.strokeStyle = '#0a2f3f';
        ctx.lineWidth = 2;
        ctx.strokeRect(pixelX, pixelY, size, size);

        // Calculate wave animation (smooth sine wave for bending)
        const waveTime = (frame / 8) * Math.PI * 2;

        // Draw grass tufts at different positions with wave animation
        ctx.save();
        ctx.translate(pixelX + size / 2, pixelY + size / 2);

        // Create multiple grass tufts across the tile
        // Tuft 1 (left area)
        this.drawGrassTuft(ctx, -size * 0.3, size * 0.35, size * 0.5, waveTime);

        // Tuft 2 (center-left)
        this.drawGrassTuft(ctx, -size * 0.1, size * 0.35, size * 0.55, waveTime + Math.PI / 3);

        // Tuft 3 (center)
        this.drawGrassTuft(ctx, size * 0.05, size * 0.35, size * 0.52, waveTime + Math.PI / 2);

        // Tuft 4 (center-right)
        this.drawGrassTuft(ctx, size * 0.2, size * 0.35, size * 0.48, waveTime + Math.PI * 2 / 3);

        // Tuft 5 (right area)
        this.drawGrassTuft(ctx, size * 0.35, size * 0.35, size * 0.5, waveTime + Math.PI);

        ctx.restore();
    }

    // Draw a single grass tuft with waving animation
    drawGrassTuft(ctx, x, y, height, wavePhase) {
        const bladeCount = 7; // Number of grass blades per tuft
        const baseWidth = height * 0.3;

        ctx.save();
        ctx.translate(x, y);

        // Calculate bend amount from wave phase (swaying back and forth)
        const bendAmount = Math.sin(wavePhase) * 0.15; // -0.15 to 0.15 radians

        // Draw individual grass blades from back to front
        for (let i = 0; i < bladeCount; i++) {
            const bladeX = (i - bladeCount / 2) * (baseWidth / bladeCount);
            // Vary heights slightly for natural look
            const heightVariation = 0.85 + (i % 3) * 0.1;
            const bladeHeight = height * heightVariation;

            // Each blade bends slightly differently based on position
            const individualBend = bendAmount * (1 + (i - bladeCount / 2) * 0.1);

            // Grass blade color variations (bright greens like sample image)
            const greenShades = [
                '#4CAF50', // bright green
                '#66BB6A', // lighter green
                '#45a049', // medium green
                '#58c05c', // light bright green
                '#4db34f', // medium bright green
                '#3fa043', // darker green
                '#5bc55f'  // very bright green
            ];
            ctx.strokeStyle = greenShades[i % greenShades.length];
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';

            // Draw blade as a path that bends
            ctx.beginPath();
            ctx.moveTo(bladeX, 0);

            // Create smooth curve for bending blade
            // Bottom third - minimal bend
            const cp1X = bladeX + individualBend * bladeHeight * 0.1;
            const cp1Y = -bladeHeight * 0.33;

            // Middle third - more bend
            const cp2X = bladeX + individualBend * bladeHeight * 0.3;
            const cp2Y = -bladeHeight * 0.66;

            // Top - maximum bend
            const endX = bladeX + individualBend * bladeHeight * 0.5;
            const endY = -bladeHeight;

            // Draw smooth curve through control points
            ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
            ctx.stroke();

            // Draw pointed tip at end
            ctx.save();
            ctx.translate(endX, endY);
            ctx.rotate(Math.atan2(endY - cp2Y, endX - cp2X) - Math.PI / 2);

            ctx.fillStyle = ctx.strokeStyle;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-1.5, 3);
            ctx.lineTo(1.5, 3);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }

        ctx.restore();
    }

    // Get current animation frame for swamp
    getSwampFrame() {
        // Slower animation for swamps (gentle waving)
        const animTime = Math.floor(Date.now() / 400); // Change frame every 400ms
        const frameIndex = animTime % 8; // 8 frames for smooth waving

        return this.sprites.swamp[frameIndex];
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
