class Submarine {
    constructor(position) {
        this.thing = new Thing(new Sprite("submarine"), position, {x: random() ? 1 : -1, y: random(-.1, .1)});
    }

    collide() {
        if (state.scene.whale.state.isBoosting) {
            state.scene.explosionEmitter.burst(this.thing.position, 60);
            state.sfx.explosion();
            state.scene.score += 125;
            this.toDelete = true;
        } else {
            state.scene.whale.hurt();
        }
    }

    update(delta) {
        this.thing.position = Vec.add(this.thing.position, Vec.scale(this.thing.forward, 0.01 * delta));
        if (this.thing.position.y < 30 || this.thing.position.y > 75)
            this.thing.forward.y *= -1;
    }

    render(view, time) {
        this.thing.render(view, time);
    }
}
