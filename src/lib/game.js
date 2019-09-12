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
                this.explosionEmitter
            ],
            enemies: [],
            whale: [this.whale],
            environment: [],
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

        this.scatter(Math.random() * 4, options.worldSize.y - 10, options.worldSize.y - 5)
            .forEach((position) => this.layers.environment.push(new Thing(new Sprite("stone"), position, {
                x: 1,
                y: Math.random() - 0.5
            })));
        this.scatter(Math.random() * 5, options.worldSize.y - 25, options.worldSize.y - 20)
            .forEach((position) => this.layers.environment.push(new Thing(new Sprite("seaweed", 4, 500, Math.random() * 4), position)));
        this.scatter(Math.random() * 2, 20, 20)
            .forEach((position) => this.layers.enemies.push(new Boat(position)));
        this.scatter(Math.random() * 1, 40, 60)
            .forEach((position) => this.layers.enemies.push(new Submarine(position)));
    }

    scatter(count, minY, maxY) {
        const res = [];
        for (let i = 0; i < count * 2; i++) {
            const fac = Math.random() > 0.5 ? 1 : -1;
            res.push({
                x: random(state.view.camera.x + options.worldSize.x * fac, state.view.camera.x + 2 * options.worldSize.x * fac),
                y: random(minY, maxY)
            });
        }
        return res;
    }
}
