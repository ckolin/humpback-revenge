class Sfx {
    static init() {
        this.play([14,14,7,7], "square", 400, 0.05);
    }

    static gameOver() {
        this.play([14,14,,16,16,,18,18,,,21,21,21,21,21], "square", 200, 0.05);
    }

    static play(melody, type, pitch, tempo) {
        if (tempo <= 0.02) return;
        const context = new AudioContext();
        const gain = context.createGain();
        gain.connect(context.destination);
        melody.forEach((tone, i) => {
            if (!tone) return;
            const oscillator = context.createOscillator();
            oscillator.connect(gain);
            const time = i * tempo;
            oscillator.type = type;
            oscillator.start(time);
            oscillator.frequency.setValueAtTime(pitch * 1.06 ** (13 - tone), time);
            gain.gain.setValueAtTime(options.volume, time);
            gain.gain.setTargetAtTime(0.0001, time + tempo - 0.02, 0.005);
            oscillator.stop(time + tempo - 0.01);
        });
    }
}
