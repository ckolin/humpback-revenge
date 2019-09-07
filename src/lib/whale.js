class Whale {
    constructor() {
        this.whaleSprite = new Sprite("whale", 4, 400);
        this.whaleFrontSprite = new Sprite("whale-front");
        this.thing = new Thing(this.whaleFrontSprite, {x: 20, y: 60});
        this.lives = 3;
        this.maxBoost = 2000;
        this.boost = this.maxBoost;
        this.bubbleEmitter = new Emitter(options.colors.slice(11, 13), {x: 0, y: -.001}, 600, 1400, 1, 2, 0, 0.2);
    }

    hurt() {
        this.lives--;
        if (this.lives <= 0)
            gameOver();
        else
            state.sfx.ouch();
    }

    update(delta) {
        const targetDistance = state.target ? Vec.distance2(state.target, this.thing.position) : 0;
        if (targetDistance > 15 || (this.thing.sprite === this.whaleSprite && targetDistance > 2)) {
            this.thing.forward = Vec.normalize(Vec.subtract(state.target, this.thing.position));
            if (this.updateBoost(delta))
                this.thing.forward = Vec.scale(this.thing.forward, 2);
            this.thing.position = Vec.add(this.thing.position, Vec.scale(this.thing.forward, delta * 0.02));
            this.thing.sprite = this.whaleSprite;
        } else {
            this.thing.forward = {x: 1, y: 0};
            this.thing.sprite = this.whaleFrontSprite;
        }

        this.bubbleEmitter.update(delta);
    }

    updateBoost(delta) {
        if (this.boost > 0 && state.input.boost) {
            this.boost = Math.max(this.boost - delta, 0);
            this.bubbleEmitter.emit(this.thing.position, 1, 0);
            return true;
        }
        if (!state.input.boost)
            this.boost = Math.min(this.boost + delta * 0.3, this.maxBoost);
        return false;
    }

    draw(ctx, time) {
        this.bubbleEmitter.draw(ctx);
        this.thing.draw(ctx, time);
    }
}
