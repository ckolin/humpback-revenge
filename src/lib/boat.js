class Boat {
    constructor(position) {
        this.thing = new Thing(new Sprite("boat"), position);
        this.velocity = {x: 0, y: 0};
    }

    collide() {
        if (state.scene.whale.state .isBoosting) {
            state.scene.explosionEmitter.burst(this.thing.position, 100);
            state.sfx.explosion();
            state.scene.score += 100;
            this.toDelete = true;
        } else {
            state.scene.whale.hurt();
        }
    }

    update(delta) {
        const x = Vec.subtract(this.thing.position, state.view.camera).x;

        // Rotation
        const d = 6;
        const p1 = {x: x - d, y: state.scene.ocean.height(x - d)};
        const p2 = {x: x + d, y: state.scene.ocean.height(x + d)};
        this.thing.forward = Vec.normalize(Vec.add(this.thing.forward, Vec.scale(Vec.subtract(p2, p1), 0.1)));

        // Movement
        const lift = state.scene.ocean.height(x) - this.thing.position.y - 3;
        this.velocity = Vec.add(this.velocity, Vec.scale({x: 0, y: lift}, 0.1));
        this.velocity = Vec.scale(this.velocity, 0.8);
        this.thing.position = Vec.add(this.thing.position, Vec.scale(this.velocity, 0.1 * delta));
    }

    render(view, time) {
        this.thing.render(view, time);
    }
}
