class Whale {
    constructor() {
        this.whaleSprite = new Sprite("whale", 4, 400);
        this.whaleFrontSprite = new Sprite("whale-front", 2, 800);
        this.thing = new Thing(this.whaleFrontSprite, {x: 20, y: 60});

        this.maxBoost = 2000;
        this.boost = this.maxBoost;

        this.lives = 3;
        this.timeSinceLastHurt = Infinity;
        this.hurtPeriod = 1500;
        this.blinkSpeed = 100;
        this.velocity = {x: 0, y: 0};
        this.gravity = {x: 0, y: 0.1};
        this.state = null;
    }

    hurt() {
        if (this.state.isHurt) return;
        this.timeSinceLastHurt = 0;
        this.lives--;
        if (this.lives <= 0) state.game.gameOver();
        else state.sfx.hurt();
    }

    update(delta) {
        // Effects
        const lastState = this.state == null ? this.getState(delta) : this.state;
        this.state = this.getState(delta);
        if (this.state.isInWater && !lastState.isInWater)
            state.game.ocean.splash(Vec.subtract(this.thing.position, state.view.camera).x, .5, 12);
        if (this.state.isBoosting && !lastState.isBoosting)
            state.game.bubbleEmitter.start(5);
        else if (!this.state.isBoosting && lastState.isBoosting)
            state.game.bubbleEmitter.stop();

        const colliders = this.collide(state.layers.enemies);
        if (colliders.length > 0) {
            if (this.state.isBoosting) colliders.forEach((enemy) => enemy.destroy());
            else this.hurt();
        }

        // Movement
        if (this.state.shouldMove || !this.state.isInWater) {
            this.thing.sprite = this.whaleSprite;
            this.thing.forward = Vec.scale(state.direction, 0.01);
            this.velocity = Vec.add(this.velocity, this.getVelocity());
        } else {
            this.thing.sprite = this.whaleFrontSprite;
            this.thing.forward = {x: 1, y: 0};
        }
        this.velocity = Vec.scale(this.velocity, this.state.isInWater ? 0.75 : 0.999);
        this.thing.position = Vec.add(this.thing.position, Vec.scale(this.velocity, 0.01 * delta));
        state.game.bubbleEmitter.position = this.thing.position;
    }

    getState(delta) {
        const diff = Vec.length2(state.direction);
        const shouldMove = diff > 100;
        this.timeSinceLastHurt += delta;
        const isHurt = this.timeSinceLastHurt < this.hurtPeriod;
        const isInWater = this.thing.position.y > state.game.ocean.height(Vec.subtract(this.thing.position, state.view.camera).x);
        const isOnFloor = this.thing.position.y > state.game.floor.level - 5;
        const isBoosting = this.updateBoost(delta);
        return {
            shouldMove,
            isHurt,
            isInWater,
            isOnFloor,
            isBoosting
        };
    }

    getVelocity() {
        if (!this.state.isInWater)
            return this.gravity;
        let velocity = Vec.scale(this.thing.forward, this.state.isBoosting ? 2 : 1);
        if (this.state.isOnFloor)
            velocity = Vec.multiply(velocity, {x: 1, y: Vec.dot(velocity, {x: 0, y: -1})});
        return velocity;
    }

    updateBoost(delta) {
        if (this.boost > 0 && state.game.boost) {
            this.boost = Math.max(this.boost - delta, 0);
            return true;
        }
        if (!state.game.boost)
            this.boost = Math.min(this.boost + delta * 0.3, this.maxBoost);
        return false;
    }

    collide(enemies) {
        // TODO: Refine hitbox
        return enemies.filter((enemy) => Vec.distance2(this.thing.position, enemy.thing.position) < 200);
    }

    render(view, time) {
        if (!this.state.isHurt || (this.state.isHurt && time % this.blinkSpeed > this.blinkSpeed / 2))
            this.thing.render(view, time);
    }
}
