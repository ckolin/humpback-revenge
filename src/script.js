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
    paused: false,
    view: null,
    sfx: null,
    stage: null,
    stages: [],
    lastUpdate: null,
    direction: {x: 0, y: 0},
    layers: {},
};

window.addEventListener("load", () => {
    state.view = new View();
    state.sfx = new Sfx();
    state.intro = new Intro();

    // Event handlers
    window.addEventListener("resize", () => state.view.resize());
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    state.view.canvas.addEventListener("mousedown", () => {
        if (state.game) state.game.boost = true;
    });
    state.view.canvas.addEventListener("mouseup", () => {
        if (state.game) state.game.boost = false;
        else state.intro.next();
    });
});
