// ========================================
// ZOMBIE SWAMP - Audio Manager
// ========================================

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.3;
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.audioBuffers = {};
        this.initializeAudioContext();
        this.loadAudioFiles();
    }

    initializeAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported', e);
        }
    }

    async loadAudioFiles() {
        // Load the grandfather clock tick sound
        // Encode spaces in the path for proper URL handling
        const tickPath = 'files from paul/Grandfather_Tick_1sec.wav'.replace(/ /g, '%20');
        await this.loadAudioFile('tick', tickPath);
    }

    async loadAudioFile(name, url) {
        if (!this.audioContext) {
            console.warn('No audio context available');
            return;
        }

        try {
            console.log(`Attempting to load audio: ${name} from ${url}`);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log(`Fetch successful for ${name}, decoding audio...`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.audioBuffers[name] = audioBuffer;
            console.log(`✓ Successfully loaded audio: ${name} (duration: ${audioBuffer.duration}s)`);
        } catch (e) {
            console.error(`✗ Failed to load audio file: ${url}`, e);
        }
    }

    // Resume audio context (needed for browser autoplay policies)
    resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Create oscillator for sound generation
    createOscillator(frequency, type = 'sine') {
        if (!this.audioContext) return null;

        const oscillator = this.audioContext.createOscillator();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        return oscillator;
    }

    // Create gain node for volume control
    createGain(volume = 1.0) {
        if (!this.audioContext) return null;

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(volume * this.masterVolume, this.audioContext.currentTime);
        return gainNode;
    }

    // Ticking Clock Sound - synchronized with turn timer
    // playbackRate: 1.0 = normal speed, >1.0 = faster, <1.0 = slower
    playTickSound(playbackRate = 1.0) {
        if (!this.soundEnabled || !this.audioContext) return;

        this.resumeContext();

        // Use loaded audio buffer if available, otherwise fallback to generated sound
        if (this.audioBuffers['tick']) {
            console.log(`Playing grandfather clock tick at ${playbackRate}x speed`);
            const source = this.audioContext.createBufferSource();
            source.buffer = this.audioBuffers['tick'];
            source.playbackRate.value = playbackRate; // Set playback speed

            const gainNode = this.createGain(0.5); // Adjust volume as needed
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            source.start(0);
        } else {
            console.log('Playing fallback tick (generated sound)');
            // Fallback to generated sound if file not loaded yet
            const oscillator = this.createOscillator(800, 'square');
            const gainNode = this.createGain(0.1);

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            const now = this.audioContext.currentTime;

            // Quick tick sound
            gainNode.gain.setValueAtTime(0.1 * this.masterVolume, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

            oscillator.start(now);
            oscillator.stop(now + 0.05);
        }
    }

    // Splash sound when zombie drowns in swamp
    playSplashSound() {
        if (!this.soundEnabled || !this.audioContext) return;

        this.resumeContext();

        const oscillator = this.createOscillator(200, 'sine');
        const gainNode = this.createGain(0.2);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        const now = this.audioContext.currentTime;

        // Descending splash
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.3);

        gainNode.gain.setValueAtTime(0.2 * this.masterVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        oscillator.start(now);
        oscillator.stop(now + 0.3);

        // Add bubble effect
        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.playBubble(), i * 100);
        }
    }

    // Bubble sound for splash effect
    playBubble() {
        if (!this.soundEnabled || !this.audioContext) return;

        const oscillator = this.createOscillator(300 + Math.random() * 200, 'sine');
        const gainNode = this.createGain(0.05);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        const now = this.audioContext.currentTime;

        gainNode.gain.setValueAtTime(0.05 * this.masterVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }

    // Footstep sound
    playFootstepSound() {
        if (!this.soundEnabled || !this.audioContext) return;

        this.resumeContext();

        const oscillator = this.createOscillator(150, 'square');
        const gainNode = this.createGain(0.05);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        const now = this.audioContext.currentTime;

        gainNode.gain.setValueAtTime(0.05 * this.masterVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        oscillator.start(now);
        oscillator.stop(now + 0.08);
    }

    // Death sound
    playDeathSound() {
        if (!this.soundEnabled || !this.audioContext) return;

        this.resumeContext();

        const oscillator = this.createOscillator(400, 'sawtooth');
        const gainNode = this.createGain(0.3);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        const now = this.audioContext.currentTime;

        // Descending death sound
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.5);

        gainNode.gain.setValueAtTime(0.3 * this.masterVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        oscillator.start(now);
        oscillator.stop(now + 0.5);
    }

    // Victory sound
    playVictorySound() {
        if (!this.soundEnabled || !this.audioContext) return;

        this.resumeContext();

        const frequencies = [523, 659, 784, 1047]; // C, E, G, C (major chord)

        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.createOscillator(freq, 'sine');
                const gainNode = this.createGain(0.2);

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                const now = this.audioContext.currentTime;

                gainNode.gain.setValueAtTime(0.2 * this.masterVolume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

                oscillator.start(now);
                oscillator.stop(now + 0.5);
            }, index * 100);
        });
    }

    // Game Over sound
    playGameOverSound() {
        if (!this.soundEnabled || !this.audioContext) return;

        this.resumeContext();

        const frequencies = [392, 349, 330, 294]; // Descending minor progression

        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.createOscillator(freq, 'triangle');
                const gainNode = this.createGain(0.25);

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                const now = this.audioContext.currentTime;

                gainNode.gain.setValueAtTime(0.25 * this.masterVolume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

                oscillator.start(now);
                oscillator.stop(now + 0.6);
            }, index * 150);
        });
    }

    // Combo sound
    playComboSound(comboLevel) {
        if (!this.soundEnabled || !this.audioContext) return;

        this.resumeContext();

        const baseFreq = 600;
        const freq = baseFreq + (comboLevel * 100);

        const oscillator = this.createOscillator(freq, 'square');
        const gainNode = this.createGain(0.15);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        const now = this.audioContext.currentTime;

        gainNode.gain.setValueAtTime(0.15 * this.masterVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        oscillator.start(now);
        oscillator.stop(now + 0.2);
    }

    // Powerup pickup sound
    playPowerupSound() {
        if (!this.soundEnabled || !this.audioContext) return;

        this.resumeContext();

        const frequencies = [659, 784, 988]; // Ascending

        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.createOscillator(freq, 'sine');
                const gainNode = this.createGain(0.15);

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                const now = this.audioContext.currentTime;

                gainNode.gain.setValueAtTime(0.15 * this.masterVolume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

                oscillator.start(now);
                oscillator.stop(now + 0.15);
            }, index * 50);
        });
    }

    // Zombie groan (periodic ambient sound)
    playZombieGroan() {
        if (!this.soundEnabled || !this.audioContext) return;

        this.resumeContext();

        const oscillator = this.createOscillator(80 + Math.random() * 40, 'sawtooth');
        const gainNode = this.createGain(0.08);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        const now = this.audioContext.currentTime;

        // Warbling groan
        oscillator.frequency.setValueAtTime(80, now);
        oscillator.frequency.linearRampToValueAtTime(100, now + 0.3);
        oscillator.frequency.linearRampToValueAtTime(70, now + 0.6);

        gainNode.gain.setValueAtTime(0.08 * this.masterVolume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

        oscillator.start(now);
        oscillator.stop(now + 0.6);
    }

    // Toggle sound on/off
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    // Set master volume (0.0 to 1.0)
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    // Play sound by name (convenience method)
    play(soundName, ...args) {
        const soundMap = {
            'tick': (playbackRate) => this.playTickSound(playbackRate),
            'splash': () => this.playSplashSound(),
            'footstep': () => this.playFootstepSound(),
            'death': () => this.playDeathSound(),
            'victory': () => this.playVictorySound(),
            'gameOver': () => this.playGameOverSound(),
            'combo': (level) => this.playComboSound(level),
            'powerup': () => this.playPowerupSound(),
            'groan': () => this.playZombieGroan()
        };

        const soundFn = soundMap[soundName];
        if (soundFn) {
            soundFn(...args);
        } else {
            console.warn(`Sound not found: ${soundName}`);
        }
    }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
