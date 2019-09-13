class Submarine {
    constructor(position) {
        this.thing = new Thing(new Sprite("submarine"), position);
        this.velocity = {x: 0, y: 0};
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

    }

    render(view, time) {
        this.thing.render(view, time);
    }
}
