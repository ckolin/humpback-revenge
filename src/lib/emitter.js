class Emitter {
    constructor(colors, gravity, minLife, maxLife, minSize = 1, maxSize = 1, minSpeed = 0, maxSpeed = 0, minAngle = 0, maxAngle = 2 * Math.PI) {
        this.position = null;
        this.colors = colors;
        this.gravity = gravity;
        this.minLife = minLife;
        this.maxLife = maxLife;
        this.minSize = minSize;
        this.maxSize = maxSize;
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;
        this.minAngle = minAngle;
        this.maxAngle = maxAngle;
        this.particles = [];
        this.interval = Infinity;
        this.timeSinceLastEmission = 0;
    }

    start(interval) {
        this.interval = interval;
    }

    stop() {
        this.interval = Infinity;
    }

    burst(position, count) {
        this.position = position;
        for (let i = 0; i < count; i++)
            this.emitSingle();
    }

    update(delta) {
        this.timeSinceLastEmission += delta;
        if (this.timeSinceLastEmission > this.interval) {
            this.emitSingle();
            this.timeSinceLastEmission = 0;
        }

        this.particles.forEach((particle) => particle.life -= delta);
        this.particles = this.particles.filter((particle) => particle.life > 0);
        this.particles.forEach((particle) => {
            particle.velocity = Vec.add(Vec.scale(particle.velocity, 0.99), this.gravity);
            particle.position = Vec.add(particle.position, Vec.scale(particle.velocity, 0.1 * delta));
        });
    }

    emitSingle() {
        const life = random(this.minLife, this.maxLife);
        const angle = random(this.minAngle, this.maxAngle);
        const speed = random(this.minSpeed, this.maxSpeed);
        const size = random(this.minSize, this.maxSize);
        this.particles.push({
            life,
            position: this.position,
            velocity: {x: speed * Math.cos(angle), y: -speed * Math.sin(angle)},
            size,
            color: this.colors[Math.floor(random(0, this.colors.length))]
        });
    }

    render(view, time) {
        view.callScaledAndTranslated((ctx) => {
            this.particles.forEach((particle) => {
                if (particle.life <= 0) return;
                ctx.fillStyle = particle.color;
                ctx.fillRect(particle.position.x, particle.position.y, particle.size, particle.size);
            });
        });
    }
}
