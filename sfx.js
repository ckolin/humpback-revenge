class Sfx {
    constructor() {
        Sfx.play([14, 14, 7, 7], "square", 400, 0.05);
    }

    gameOver() {
        Sfx.play([14, 14, , 16, 16, , 18, 18, , , 21, 21, 21, 21, 21], "square", 200, 0.05);
    }

    startMusic() {
        const melody = [14, 14, , 14, , 16, , 21, , 19, 19, , 19, , , 19, 19, , 19, , 16, , 16, , 19, 19, , 19, , , 19, , 19, , 21, , 21, , 19, , 19, 19, , 19, , , 19, 19, , 19, , 16, , 16, , 19, 19, , 19, , , 19, , 19, , 24, , 24, , 21];
        const tempo = 0.12;
        this.musicInterval = setInterval(() => Sfx.play(melody, "sawtooth", 200, tempo), (melody.length + 1) * tempo * 1000);
    }

    endMusic() {
        clearInterval(this.musicInterval);
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
            gain.gain.setTargetAtTime(0.0001, time + 0.02, tempo);
            oscillator.stop(time + tempo - 0.01);
        });
    }
}
