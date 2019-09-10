const dbg = (obj) => {
    if (obj) console.log(obj);
    return location.hash === "#debug";
};

const options = {
    volume: 0.2,
    maxScale: 8,
    worldSize: {x: 200, y: 100},
    colors: [
        "#1a1c2c", "#5d275d", "#b13e53", "#ef7d57", "#ffcd75", "#a7f070", "#38b764", "#257179",
        "#29366f", "#3b5dc9", "#41a6f6", "#73eff7", "#f4f4f4", "#94b0c2", "#566c86", "#333c57"
    ]
};

const state = {
    score: 0,
    screen: null,
    lastUpdate: null,
    direction: {x: 0, y: 0},
    sfx: null,
    layers: null,
    input: {
        boost: false
    }
};

window.addEventListener("load", () => {
    state.view = new View();
    state.sfx = new Sfx();
    state.sfx.init();
    if (!dbg()) state.sfx.startMusic();

    state.ocean = new Ocean();
    state.floor = new Floor();
    state.whale = new Whale();

    // Game objects
    state.layers = {
        background: [
            state.ocean.background,
            state.floor
        ],
        boats: [
            new Boat({x: 40, y: 15}),
            new Boat({x: 100, y: 15}),
            new Thing(new Sprite("submarine"), {x: 150, y: 60})
        ],
        whale: [state.whale],
        foreground: [
            new Thing(new Sprite("stone"), {x: 68, y: 93}, {x: 0, y: 1}),
            new Thing(new Sprite("stone"), {x: 60, y: 95}),
            new Thing(new Sprite("seaweed", 4, 600, 0), {x: 140, y: 90}),
            new Thing(new Sprite("seaweed", 4, 600, 2), {x: 160, y: 88}),
            new Thing(new Sprite("seaweed", 4, 600, 1), {x: 180, y: 86}),
            state.ocean.foreground
        ],
        overlay: [
            new Label(() => `${state.score} PTS`, {x: 50, y: 1}),
            { // TODO: Extract
                render: (screen) => {
                    screen.callScaled((ctx) => {
                        const width = 20;
                        ctx.fillStyle = options.colors[0];
                        ctx.fillRect(1, options.worldSize.y - 5, width + 2, 4);
                        ctx.fillStyle = options.colors[12];
                        ctx.fillRect(2, options.worldSize.y - 4, Math.floor((state.whale.boost / state.whale.maxBoost) * width), 2);
                    });
                }
            }, { // TODO: Extract
                render: (screen) => {
                    screen.callScaled((ctx) => {
                        const sprite = new Sprite("heart", 1, 0, 0, false);
                        ctx.translate(1, 1);
                        for (let i = 0; i < state.whale.lives; i++) {
                            sprite.draw(ctx);
                            ctx.translate(sprite.frameWidth + 1, 0);
                        }
                    });
                }
            }
        ]
    };

    // Event handlers
    window.addEventListener("resize", () => state.view.resize());
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    window.addEventListener("mousedown", () => state.input.boost = true);
    window.addEventListener("mouseup", () => state.input.boost = false);

    requestAnimationFrame(update);
});

const update = () => {
    const time = Date.now();
    const delta = state.lastUpdate ? time - state.lastUpdate : 0;
    state.lastUpdate = time;

    // Update
    [
        state.ocean,
        state.whale,
        state.view
    ].forEach((thing) => thing.update(delta));

    // Rendering
    state.view.callScaled((ctx) => {
        ctx.fillStyle = options.colors[4];
        ctx.fillRect(0, 0, options.worldSize.x, options.worldSize.y);
    });
    [
        state.layers.background,
        state.layers.boats,
        state.layers.whale,
        state.layers.foreground,
        state.layers.overlay
    ].forEach((layer) => {
        layer = layer.filter((thing) => !thing.toDelete);
        layer.forEach((thing) => thing.render(state.view, time))
    });

    requestAnimationFrame(update);
};

const scaleContext = (ctx) => {
    ctx.save();
    ctx.scale(state.canvasScale, state.canvasScale);
};

const gameOver = () => {
    state.sfx.stopMusic();
    state.sfx.gameOver();
};
