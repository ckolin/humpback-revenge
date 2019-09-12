class Game {
    constructor() {
        this.score = 0;
        this.boost = false;
        this.paused = false;
        this.lastUpdate = 0;

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
            enemies: [
                new Boat({x: 40, y: 16}),
                new Boat({x: 100, y: 16}),
                new Submarine({x: 150, y: 60})
            ],
            whale: [this.whale],
            foreground: [
                new Thing(new Sprite("stone"), {x: 68, y: 89}, {x: 0, y: 1}),
                new Thing(new Sprite("stone"), {x: 60, y: 94}),
                new Thing(new Sprite("seaweed", 4, 600, 0), {x: 140, y: 80}),
                new Thing(new Sprite("seaweed", 4, 600, 2), {x: 160, y: 78}),
                new Thing(new Sprite("seaweed", 4, 600, 1), {x: 180, y: 76}),
                this.ocean.foreground
            ],
            overlay: [
                new Label(() => `${this.score} pts`, {x: options.worldSize.x - 1, y: 1}, true),
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
            "foreground",
            "overlay"
        ].forEach((layer) => {
            this.layers[layer] = this.layers[layer].filter((thing) => !thing.toDelete);
            this.layers[layer].forEach((thing) => thing.render(state.view, time));
        });
    }
}
