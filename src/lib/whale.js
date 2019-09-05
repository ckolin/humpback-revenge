class Whale {
    constructor() {
        this.thing = new Thing(new Sprite("whale", 4, 400), {x: 20, y: 60});
        this.lives = 3;
        this.maxBoost = 1000;
        this.boost = this.maxBoost;
        this.boostActivated = false;
    }

    hurt() {
        this.lives--;
        if (this.lives <= 0)
            gameOver();
    }

    update(delta) {
        if (!state.target) state.target = this.thing.position;
        this.thing.forward = Vec.normalize(Vec.subtract(state.target, this.thing.position));

        this.boostActivated = this.updateBoost(delta);
        if (this.boostActivated)
            this.thing.forward = Vec.scale(this.thing.forward, 2);

        if (Vec.distance2(state.target, this.thing.position) > 10)
            this.thing.position = Vec.add(this.thing.position, Vec.scale(this.thing.forward, delta * 0.02));
    }

    updateBoost(delta) {
        if (this.boost > 0 && state.input.boost) {
            this.boost -= delta;
            this.boost = Math.max(this.boost, 0);
            return true;
        } else {
            this.boost += delta * 0.5;
            this.boost = Math.min(this.boost, this.maxBoost);
            return false;
        }
    }

    draw(ctx, time) {
        this.thing.draw(ctx, time);
    }
}
