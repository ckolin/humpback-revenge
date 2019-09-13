class Torpedo {
    constructor(height, startTime = 2000) {
        this.height = height;
        this.time = 0;
        this.startTime = startTime;
        this.started = false;
        this.fromLeft = random();
        this.thing = new Thing(new Sprite("torpedo"), {x: state.view.camera.x, y: height}, {x: this.fromLeft ? 1 : -1, y: 0});
        this.warningSprite = new Sprite("warning");
        this.blinkSpeed = 400;
    }

    collide() {
        state.scene.explosionEmitter.burst(this.thing.position, 100);
        state.scene.whale.hurt();
        state.sfx.explosion();
        this.toDelete = true;
    }

    update(delta) {
        this.time += delta;
        if (this.started) {
            this.thing.position = Vec.add(this.thing.position, Vec.scale(this.thing.forward, 0.08 * delta));
        } else if (this.time >= this.startTime) {
            this.started = true;
            this.thing.position.x = this.fromLeft ? 0 : options.worldSize.x;
            this.thing.position = Vec.add(this.thing.position, state.view.camera);
        }
    }

    render(view, time) {
        if (this.started) {
            this.thing.render(view, time);
        } else if (time % this.blinkSpeed > this.blinkSpeed / 2) {
            state.view.callScaled((ctx) => {
                const offset = 3;
                ctx.translate(this.fromLeft ? offset : options.worldSize.x - offset, this.height);
                this.warningSprite.draw(ctx);
            });
        }
    }
}
