class Game {
    constructor() {
        this.score = 0;
        this.boost = false;
        this.paused = false;
        this.lastUpdate = 0;
        this.lastWorldGenerationX = -Infinity;

        this.ocean = new Ocean();
        this.floor = new Floor();
        this.whale = new Whale();
        this.explosionEmitter = new Emitter(
            options.colors.slice(2, 4),
            {x: 0, y: 0.001},
            500, 1000,
            1, 4,
            0, 0.3
        );
        this.bubbleEmitter = new Emitter(
            options.colors.slice(11, 13),
            {x: 0, y: -.001},
            600, 1400,
            1, 2,
            0, 0.2
        );

        this.layers = {
            background: [
                this.ocean.background,
                this.floor,
                this.bubbleEmitter,
                this.explosionEmitter,
                new Label(() => "drag and click", {x: 40, y: 40}),
                new Label(() => "to move", {x: 40, y: 50}),
            ],
            enemies: [],
            whale: [this.whale],
            environment: [
                new Thing(new Sprite("seaweed", 4, 600, 0), {x: 50, y: 80}),
            ],
            overlay: [
                this.ocean.foreground,
                new Label(() => `${this.score} points`, {x: options.worldSize.x - 1, y: 1}, true),
                { // TODO: Extract
                    render: (view) => {
                        view.callScaled((ctx) => {
                            const size = {x: 36, y: 5};
                            const position = {x: 1, y: options.worldSize.y - size.y};
                            const width = Math.floor((this.whale.boost / this.whale.maxBoost) * size.x);
                            ctx.fillStyle = options.colors[0];
                            ctx.fillRect(position.x, position.y - 1, size.x + 2, size.y);
                            ctx.fillStyle = options.colors[5];
                            ctx.fillRect(position.x + 1, position.y, width, 1);
                            ctx.fillStyle = options.colors[6];
                            ctx.fillRect(position.x + 1, position.y + 1, width, size.y - 3);
                        });
                    }
                }, { // TODO: Extract
                    render: (view) => {
                        view.callScaled((ctx) => {
                            const sprite = new Sprite("heart", 1, 0, 0, false);
                            ctx.translate(1, 1);
                            for (let i = 0; i < this.whale.lives; i++) {
                                sprite.draw(ctx);
                                ctx.translate(sprite.frameWidth + 1, 0);
                            }
                        });
                    }
                }
            ]
        };
        this.pauseLabel = new Label(() => "paused", {x: 55, y: 45});

        setTimeout(() => {
            // Remove tutorial labels
            this.layers.background = this.layers.background.filter((item) => !item.font);
        }, 5000);
    }

    update() {
        const time = Date.now();
        const delta = this.lastUpdate ? time - this.lastUpdate : 0;
        this.lastUpdate = time;

        if (this.paused) {
            state.view.callScaled((ctx) => ctx.clearRect(0, 0, options.worldSize.x, options.worldSize.y));
            this.pauseLabel.render(state.view);
            return;
        }

        this.generateWorld();

        // Update
        [
            state.view,
            this.ocean,
            ...this.layers.enemies,
            this.explosionEmitter,
            this.bubbleEmitter,
            this.whale
        ].forEach((thing) => thing.update(delta));

        // Rendering
        state.view.callScaled((ctx) => {
            ctx.fillStyle = options.colors[4];
            ctx.fillRect(0, 0, options.worldSize.x, options.worldSize.y);
        });
        [ // TODO: Get rid of strings
            "background",
            "enemies",
            "whale",
            "environment",
            "overlay"
        ].forEach((layer) => {
            this.layers[layer] = this.layers[layer].filter((thing) => !thing.toDelete);
            this.layers[layer].forEach((thing) => thing.render(state.view, time));
        });
    }

    generateWorld() {
        if (Math.abs(state.view.camera.x - this.lastWorldGenerationX) < options.worldSize.x)
            return;

        this.score += 10;
        this.lastWorldGenerationX = state.view.camera.x;

        const distanceFilter = (thing) => Math.abs(thing.position.x - state.view.camera.x) < 2 * options.worldSize.x;
        this.layers.enemies = this.layers.enemies
            .filter((enemy) => distanceFilter(enemy.thing));
        this.layers.environment = this.layers.environment
            .filter(distanceFilter);

        this.scatter(random(2, 4), options.worldSize.y - 10, options.worldSize.y - 5)
            .forEach((pos) => this.layers.environment.push(new Thing(new Sprite("stone"), pos, {x: 1, y: random(-0.5, 0.5)})));
        this.scatter(random(0, 4), options.worldSize.y - 25, options.worldSize.y - 20)
            .forEach((pos) => this.layers.environment.push(new Thing(new Sprite("seaweed", 4, 500, random(0, 4)), pos)));
        this.scatter(random(1, 3), 20, 20)
            .forEach((pos) => this.layers.enemies.push(new Boat(pos)));
        this.scatter(random(0, 1), 40, 60)
            .forEach((pos) => this.layers.enemies.push(new Submarine(pos)));

        if (random()) {
            this.layers.enemies.push(new Torpedo(random(25, 45)));
            this.layers.enemies.push(new Torpedo(random(50, 75)));
        }
    }

    scatter(count, minY, maxY) {
        const res = [];
        for (let i = 0; i < count * 2; i++) {
            const fac = random() ? 2 : -1;
            res.push({
                x: random(state.view.camera.x + options.worldSize.x * fac, state.view.camera.x + options.worldSize.x * fac + options.worldSize.x),
                y: random(minY, maxY)
            });
        }
        return res;
    }
}
