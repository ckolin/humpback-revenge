class Whale {
    constructor() {
        this.thing = new Thing(new Sprite("whale", 4, 400), {x: 20, y: 60});
        this.lives = 3;
    }

    hurt() {
        this.lives--;
        if (this.lives <= 0)
            gameOver();
    }

    update(delta) {
        if (!state.target) state.target = this.thing.position;
        this.thing.forward = Vec.normalize(Vec.subtract(state.target, this.thing.position));
        if (Vec.distance2(state.target, this.thing.position) > 10)
            this.thing.position = Vec.add(this.thing.position, Vec.scale(this.thing.forward, delta * 0.02));
    }

    draw(ctx, time) {
        this.thing.draw(ctx, time);
    }
}
