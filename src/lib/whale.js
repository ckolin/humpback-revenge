class Whale {
    constructor() {
        this.whaleSprite = new Sprite("whale", 4, 400);
        this.whaleFrontSprite = new Sprite("whale-front", 2, 800);
        this.thing = new Thing(this.whaleFrontSprite, {x: 20, y: 60});

        this.lives = 3;
        this.timeSinceLastHurt = Infinity;

        this.velocity = {x: 0, y: 0};
        this.gravity = {x: 0, y: 0.1};
        this.state = {
            shouldMove: false,
            isInWater: true,
            isOnFloor: false,
            isBoosting: false
        };

        this.maxBoost = 2000;
        this.boost = this.maxBoost;
        this.bubbleEmitter = new Emitter(
            this.thing.position,
            options.colors.slice(11, 13),
            {x: 0, y: -.001},
            600, 1400,
            1, 2,
            0, 0.2
        );
    }

    hurt() {
        if (this.timeSinceLastHurt < 1000)
            return;

        this.timeSinceLastHurt = 0;
        this.lives--;
        if (this.lives <= 0) gameOver();
        else state.sfx.hurt();
    }

    update(delta) {
        this.timeSinceLastHurt += delta;

        // Effects
        const lastState = this.state;
        this.state = this.getState(delta);
        if (this.state.isInWater && !lastState.isInWater)
            state.ocean.splash(Vec.subtract(this.thing.position, state.view.camera).x, .5, 12);
        if (this.state.isBoosting && !lastState.isBoosting)
            this.bubbleEmitter.start(10);
        else if (!this.state.isBoosting && lastState.isBoosting)
            this.bubbleEmitter.stop();

        this.bubbleEmitter.update(delta);

        const colliders = this.collide(state.layers.enemies);
        if (colliders.length > 0) {
            if (this.state.isBoosting)
                colliders.forEach((enemy) => enemy.destroy());
            else
                this.hurt();
        }

        // Movement
            if (this.state.shouldMove || !this.state.isInWater) {
                this.thing.sprite = this.whaleSprite;
                this.thing.forward = Vec.scale(state.direction, 0.01);
                let newVelocity;
                if (this.state.isInWater) {
                    newVelocity = Vec.scale(this.thing.forward, this.state.isBoosting ? 2 : 1);
                    if (this.state.isOnFloor)
                        newVelocity = Vec.multiply(newVelocity, {x: 1, y: Vec.dot(newVelocity, {x: 0, y: -1})});
                } else {
                    newVelocity = this.gravity;
                }
                this.velocity = Vec.add(this.velocity, newVelocity);
            } else {
                this.thing.sprite = this.whaleFrontSprite;
                this.thing.forward = {x: 1, y: 0};
            }
        this.velocity = Vec.scale(this.velocity, this.state.isInWater ? 0.75 : 0.999);
        this.thing.position = Vec.add(this.thing.position, Vec.scale(this.velocity, 0.01 * delta));
    }

    getState(delta) {
        const diff = Vec.length2(state.direction);
        const shouldMove = diff > 100 || (this.thing.sprite === this.whaleSprite && diff > 40);
        const isInWater = this.thing.position.y > state.ocean.height(Vec.subtract(this.thing.position, state.view.camera).x);
        const isOnFloor = this.thing.position.y > state.floor.level;
        const isBoosting = this.updateBoost(delta);
        return {
            shouldMove,
            isInWater,
            isOnFloor,
            isBoosting
        };
    }

    updateBoost(delta) {
        this.bubbleEmitter.position = this.thing.position;
        if (this.boost > 0 && state.input.boost) {
            this.boost = Math.max(this.boost - delta, 0);
            return true;
        }
        if (!state.input.boost)
            this.boost = Math.min(this.boost + delta * 0.3, this.maxBoost);
        return false;
    }

    collide(enemies) {
        // TODO: Refine hitbox
        return enemies.filter((enemy) => Vec.distance2(this.thing.position, enemy.thing.position) < 300);
    }

    render(view, time) {
        view.callScaledAndTranslated((ctx) => {
            this.bubbleEmitter.draw(ctx);
        });
        this.thing.render(view, time);
    }
}
