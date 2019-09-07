class Sfx {
    constructor() {
        this.musicInterval = null;
    }

    init() {
        Sfx.play([14, 14, 7, 7], "square", 400, 0.05);
    }

    hurt() {
        Sfx.play([1], "square", 20, 0.2);
    }

    gameOver() {
        Sfx.play([14, 14, , 16, 16, , 18, 18, , , 21, 21, 21, 21, 21], "square", 200, 0.05);
    }

    startMusic() {
        //const melody = [14, 14, , 14, , 16, , 21, , 19, 19, , 19, , , 19, 19, , 19, , 16, , 16, , 19, 19, , 19, , , 19, , 19, , 21, , 21, , 19, , 19, 19, , 19, , , 19, 19, , 19, , 16, , 16, , 19, 19, , 19, , , 19, , 19, , 24, , 24, , 21];
        const melody = [5, 19, 12, 19, 16, 19, 16, 12, 7, , 11, , 19, , 19, 19, 19, 19, , 12, , 19, , 5, 19, 12, 19, 16, , 12, 11, 12, 13, 16, 15, 16, 17, , 19, , 14, 14, 14, , 14, , 14, , 19, 17, , 15, , 17, 17, , 14, , 15, 16, 19, , 5, 19, 12, 19, 14, 19, 15, 19, 16, 19, 17, 19, , 19, 21, 19, 22, 19, 23, 19, 12, 12, 5, 2, , 19];
        const tempo = 0.24;
        const loop = () => Sfx.play(melody, "sawtooth", 280, tempo, 0.5);
        this.musicInterval = setInterval(loop, (melody.length + 1) * tempo * 1000);
        loop();
    }

    stopMusic() {
        clearInterval(this.musicInterval);
    }

    static play(melody, type, pitch, tempo, volume = 1) {
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
            gain.gain.setValueAtTime(options.volume * volume, time);
            gain.gain.setTargetAtTime(0, time + 0.01, tempo / 3);
            oscillator.stop(time + tempo - 0.01);
        });
    }
}
