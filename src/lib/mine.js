class Mine {
    constructor(position) {
        this.thing = new Thing(new Sprite("mine"), position);
    }

    collide() {
        state.scene.explosionEmitter.burst(this.thing.position, 100);
        state.scene.whale.hurt();
        state.sfx.explosion();
        this.toDelete = true;
    }

    update() {

    }

    render(view, time) {
        this.thing.render(view, time);
    }
}
