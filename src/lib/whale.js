class Whale {
    constructor() {
        this.whaleSprite = new Sprite("whale", 4, 400);
        this.whaleFrontSprite = new Sprite("whale-front", 2, 800);
        this.thing = new Thing(this.whaleFrontSprite, {x: 20, y: 60});
        this.lives = 3;

        this.velocity = {x: 0, y: 0};
        this.gravity = {x: 0, y: 0.1};
        this.physicsState = {
            shouldMove: false,
            isInWater: true,
            isOnFloor: false
        };

        this.maxBoost = 2000;
        this.boost = this.maxBoost;
        this.boostActivated = false;
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
        this.lives--;
        if (this.lives <= 0) gameOver();
        else state.sfx.hurt();
    }

    update(delta) {
        const lastState = this.physicsState;
        this.physicsState = this.getPhysicsState();

        // Effects
        if (this.physicsState.isInWater && !lastState.isInWater) {
            state.ocean.splash(Vec.subtract(this.thing.position, state.view.camera).x, -.5, 14);
        }

        // Boost
        const wasBoostActivated = this.boostActivated;
        this.boostActivated = this.updateBoost(delta);
        if (this.boostActivated && !wasBoostActivated)
            this.bubbleEmitter.start(10);
        else if (!this.boostActivated && wasBoostActivated)
            this.bubbleEmitter.stop();
        this.bubbleEmitter.update(delta);

        // Movement
        if (this.physicsState.shouldMove || !this.physicsState.isInWater) {
            this.thing.sprite = this.whaleSprite;
            this.thing.forward = Vec.scale(state.direction, 0.01);
            let newVelocity;
            if (this.physicsState.isInWater) {
                newVelocity = Vec.scale(this.thing.forward, this.boostActivated ? 2 : 1);
                if (this.physicsState.isOnFloor)
                    newVelocity = Vec.multiply(newVelocity, {x: 1, y: Vec.dot(newVelocity, {x: 0, y: -1})});
            } else {
                newVelocity = this.gravity;
            }
            this.velocity = Vec.add(this.velocity, newVelocity);
        } else {
            this.thing.sprite = this.whaleFrontSprite;
            this.thing.forward = {x: 1, y: 0};
        }

        this.velocity = Vec.scale(this.velocity, this.physicsState.isInWater ? 0.75 : 0.999);
        this.thing.position = Vec.add(this.thing.position, Vec.scale(this.velocity, 0.01 * delta));
    }

    collide(things) {
        // TODO: Refine hitbox
        return things.filter((thing) => Vec.distance2(this.thing.position, thing.position) < 20);
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

    getPhysicsState() {
        const diff = Vec.length2(state.direction);
        const shouldMove = diff > 100 || (this.thing.sprite === this.whaleSprite && diff > 40);
        const isInWater = this.thing.position.y > state.ocean.height(Vec.subtract(this.thing.position, state.view.camera).x);
        const isOnFloor = this.thing.position.y > state.floor.level;
        return {
            shouldMove,
            isInWater,
            isOnFloor
        };
    }

    render(view, time) {
        view.callScaledAndTranslated((ctx) => {
            this.bubbleEmitter.draw(ctx);
        });
        this.thing.render(view, time);
    }
}
