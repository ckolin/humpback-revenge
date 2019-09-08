class Emitter {
    constructor(position, colors, gravity, minLife, maxLife, minSize = 1, maxSize = 1, minSpeed = 0, maxSpeed = 0, startAngle = 0, endAngle = 2 * Math.PI) {
        this.position = position;
        this.colors = colors;
        this.gravity = gravity;
        this.minLife = minLife;
        this.maxLife = maxLife;
        this.minSize = minSize;
        this.maxSize = maxSize;
        this.minSpeed = minSpeed;
        this.maxSpeed = maxSpeed;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.particles = [];
        this.emitInterval = null;
    }

    start(interval) {
        this.emitInterval = setInterval(() => this.emitSingle(), interval);
    }

    stop() {
        clearInterval(this.emitInterval);
    }

    emit(count, duration = 100) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => this.emitSingle(), i / count * duration);
        }
    }

    emitSingle() {
        const angle = this.startAngle + (this.endAngle - this.startAngle) * Math.random();
        const speed = this.minSpeed + (this.maxSpeed - this.minSpeed) * Math.random();
        this.particles.push({
            life: this.minLife + (this.maxLife - this.minLife) * Math.random(),
            position: this.position,
            velocity: {x: speed * Math.cos(angle), y: -speed * Math.sin(angle)},
            size: this.minSize + (this.maxSize - this.minSize) * Math.random(),
            color: this.colors[Math.floor(Math.random() * this.colors.length)]
        });
    }

    update(delta) {
        this.particles.forEach((particle) => particle.life -= delta);
        this.particles = this.particles.filter((particle) => particle.life > 0);
        this.particles.forEach((particle) => {
            particle.velocity = Vec.add(Vec.scale(particle.velocity, 0.99), this.gravity);
            particle.position = Vec.add(particle.position, particle.velocity);
        });
    }

    draw(ctx) {
        this.particles.forEach((particle) => {
            if (particle.life <= 0) return;
            ctx.fillStyle = particle.color;
            ctx.fillRect(particle.position.x, particle.position.y, particle.size, particle.size);
        });
    }
}
