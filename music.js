// 8-bit RPG celebration music (Final Fantasy inspired)
// Web Audio API — no external files needed

const Music = (() => {
    let ctx, playing = false, masterGain;
    const BPM = 110;
    const BEAT = 60 / BPM;

    // Notes (Hz) — two octaves plus accidentals
    const N = {
        R: 0, // rest
        C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
        C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
        C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
        C6: 1046.50, D6: 1174.66,
        Bb3: 233.08, Eb4: 311.13, Bb4: 466.16, Fs4: 369.99,
        Bb5: 932.33, Eb5: 622.25,
    };

    // -- COMPOSITION --
    // Chord progression: C - Am - F - G | C - F - Dm - G | C - Am - F - G | F - G - C
    // Each chord = 2 beats. 8 bars total, 16 chords, 32 beats.

    const chords = [
        // Bar 1-2: C - Am - F - G
        { root: N.C3, notes: [N.C4, N.E4, N.G4], dur: 2 },
        { root: N.A3, notes: [N.A3, N.C4, N.E4], dur: 2 },
        { root: N.F3, notes: [N.F3, N.A3, N.C4], dur: 2 },
        { root: N.G3, notes: [N.G3, N.B3, N.D4], dur: 2 },
        // Bar 3-4: C - F - Dm - G
        { root: N.C3, notes: [N.C4, N.E4, N.G4], dur: 2 },
        { root: N.F3, notes: [N.F3, N.A3, N.C4], dur: 2 },
        { root: N.D3, notes: [N.D4, N.F4, N.A4], dur: 2 },
        { root: N.G3, notes: [N.G3, N.B3, N.D4], dur: 2 },
        // Bar 5-6: C - Am - F - G  (repeat with variation)
        { root: N.C3, notes: [N.C4, N.E4, N.G4], dur: 2 },
        { root: N.A3, notes: [N.A3, N.C4, N.E4], dur: 2 },
        { root: N.F3, notes: [N.F3, N.A3, N.C4], dur: 2 },
        { root: N.G3, notes: [N.G3, N.B3, N.D4], dur: 2 },
        // Bar 7-8: F - G - C (grand ending, C held longer)
        { root: N.F3, notes: [N.F3, N.A3, N.C4], dur: 2 },
        { root: N.G3, notes: [N.G3, N.B3, N.D4], dur: 2 },
        { root: N.C3, notes: [N.C4, N.E4, N.G4], dur: 4 },
    ];

    // Melody — beat values (1 = quarter note)
    // Designed to land on chord tones on strong beats
    const melody = [
        // Bar 1: C - Am | Opening fanfare
        { n: N.C5, d: 0.5 }, { n: N.E5, d: 0.5 }, { n: N.G5, d: 0.75 }, { n: N.C6, d: 0.25 },
        { n: N.B5, d: 0.5 }, { n: N.A5, d: 0.5 }, { n: N.E5, d: 0.75 }, { n: N.R, d: 0.25 },
        // Bar 2: F - G | Answer phrase
        { n: N.F5, d: 0.5 }, { n: N.A5, d: 0.5 }, { n: N.G5, d: 0.5 }, { n: N.F5, d: 0.5 },
        { n: N.G5, d: 0.75 }, { n: N.B5, d: 0.25 }, { n: N.D6, d: 0.75 }, { n: N.R, d: 0.25 },
        // Bar 3: C - F | Lyrical theme
        { n: N.C6, d: 1.0 }, { n: N.B5, d: 0.5 }, { n: N.G5, d: 0.5 },
        { n: N.A5, d: 1.0 }, { n: N.G5, d: 0.5 }, { n: N.F5, d: 0.5 },
        // Bar 4: Dm - G | Building tension
        { n: N.F5, d: 0.5 }, { n: N.E5, d: 0.5 }, { n: N.D5, d: 0.5 }, { n: N.F5, d: 0.5 },
        { n: N.G5, d: 0.5 }, { n: N.A5, d: 0.5 }, { n: N.B5, d: 0.75 }, { n: N.R, d: 0.25 },
        // Bar 5: C - Am | Melody returns, ornamented
        { n: N.C6, d: 0.25 }, { n: N.B5, d: 0.25 }, { n: N.C6, d: 0.5 }, { n: N.G5, d: 0.5 }, { n: N.E5, d: 0.5 },
        { n: N.A5, d: 0.75 }, { n: N.G5, d: 0.25 }, { n: N.E5, d: 0.5 }, { n: N.C5, d: 0.5 },
        // Bar 6: F - G | Climbing
        { n: N.F5, d: 0.5 }, { n: N.G5, d: 0.5 }, { n: N.A5, d: 0.5 }, { n: N.C6, d: 0.5 },
        { n: N.B5, d: 0.5 }, { n: N.D6, d: 0.5 }, { n: N.C6, d: 0.75 }, { n: N.R, d: 0.25 },
        // Bar 7: F - G | Pre-finale
        { n: N.A5, d: 0.5 }, { n: N.F5, d: 0.5 }, { n: N.A5, d: 0.5 }, { n: N.C6, d: 0.5 },
        { n: N.B5, d: 0.5 }, { n: N.G5, d: 0.5 }, { n: N.B5, d: 0.5 }, { n: N.D6, d: 0.5 },
        // Bar 8: C held — triumphant resolution
        { n: N.C6, d: 2.0 }, { n: N.G5, d: 1.0 }, { n: N.C6, d: 1.0 },
    ];

    function createOsc(type, freq, gainVal, time, duration) {
        if (freq === 0) return;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, time);

        // Smooth envelope
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(gainVal, time + 0.015);
        g.gain.setValueAtTime(gainVal, time + duration * 0.5);
        g.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(g);
        g.connect(masterGain);
        osc.start(time);
        osc.stop(time + duration + 0.05);
    }

    // Softer lead: layered square + sine for warmth
    function playLead(freq, gainVal, time, duration) {
        if (freq === 0) return;
        createOsc('square', freq, gainVal * 0.5, time, duration);
        createOsc('sine', freq, gainVal * 0.7, time, duration);
        // Slight detune for richness
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 1.003, time);
        g.gain.setValueAtTime(0, time);
        g.gain.linearRampToValueAtTime(gainVal * 0.3, time + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, time + duration);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(time);
        osc.stop(time + duration + 0.05);
    }

    function scheduleMelody(startTime) {
        let t = startTime;
        for (const { n, d } of melody) {
            const dur = d * BEAT;
            if (n > 0) {
                playLead(n, 0.09, t, dur * 0.9);
            }
            t += dur;
        }
        return t;
    }

    function scheduleBass(startTime) {
        let t = startTime;
        for (const chord of chords) {
            const dur = chord.dur * BEAT;
            // Root note — octave pulse pattern (boom-boom)
            createOsc('triangle', chord.root, 0.12, t, dur * 0.4);
            createOsc('triangle', chord.root * 2, 0.06, t + dur * 0.5, dur * 0.35);
            t += dur;
        }
    }

    function scheduleArpeggios(startTime) {
        let t = startTime;
        for (const chord of chords) {
            const dur = chord.dur * BEAT;
            const notes = chord.notes;
            const arpBeat = dur / 6; // 6 arp notes per chord
            for (let i = 0; i < 6; i++) {
                const freq = notes[i % notes.length] * 2; // high octave shimmer
                createOsc('sine', freq, 0.025, t + i * arpBeat, arpBeat * 0.7);
            }
            t += dur;
        }
    }

    // Simple percussion using noise bursts
    function schedulePercussion(startTime, totalBeats) {
        for (let i = 0; i < totalBeats; i++) {
            const t = startTime + i * BEAT;
            // Kick on beats 1, 3
            if (i % 4 === 0 || i % 4 === 2) {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(150, t);
                osc.frequency.exponentialRampToValueAtTime(30, t + 0.08);
                g.gain.setValueAtTime(0.12, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
                osc.connect(g);
                g.connect(masterGain);
                osc.start(t);
                osc.stop(t + 0.15);
            }
            // Hi-hat on every beat
            const noise = ctx.createOscillator();
            const ng = ctx.createGain();
            noise.type = 'square';
            noise.frequency.setValueAtTime(6000 + Math.random() * 2000, t);
            ng.gain.setValueAtTime(0.015, t);
            ng.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
            noise.connect(ng);
            ng.connect(masterGain);
            noise.start(t);
            noise.stop(t + 0.05);
        }
    }

    function play() {
        if (playing) return;
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = ctx.createGain();
        masterGain.gain.value = 0.7;
        masterGain.connect(ctx.destination);
        playing = true;

        function loop() {
            if (!playing) return;
            const start = ctx.currentTime + 0.1;

            const endTime = scheduleMelody(start);
            scheduleBass(start);
            scheduleArpeggios(start);

            const totalBeats = Math.round((endTime - start) / BEAT);
            schedulePercussion(start, totalBeats);

            const durationMs = (endTime - start) * 1000;
            setTimeout(() => { if (playing) loop(); }, durationMs - 300);
        }

        loop();
    }

    function stop() {
        playing = false;
        if (ctx) {
            ctx.close();
            ctx = null;
        }
        masterGain = null;
    }

    function toggle() {
        if (playing) stop(); else play();
        return playing;
    }

    return { play, stop, toggle, isPlaying: () => playing };
})();
