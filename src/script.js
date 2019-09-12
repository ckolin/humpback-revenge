const dbg = (obj) => {
    if (obj !== undefined) console.log(obj);
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
    view: null,
    sfx: null,
    muted: false,
    scene: null,
    sceneName: null
};

window.addEventListener("load", () => {
    state.view = new View();
    state.sfx = new Sfx();

    // Event handlers
    window.addEventListener("resize", () => state.view.resize());
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    state.view.canvas.addEventListener("mousedown", () => {
        if (state.sceneName === "game") state.scene.boost = true;
    });
    state.view.canvas.addEventListener("mouseup", () => {
        if (state.sceneName === "game") state.scene.boost = false;
        else if (state.sceneName === "intro") state.scene.next();
        else if (state.sceneName === "gameOver") showGame();
    });

    showIntro();
    requestAnimationFrame(loop);
});

const loop = () => {
    state.scene.update();
    window.requestAnimationFrame(loop);
};

const showIntro = () => {
    state.sceneName = "intro";
    state.scene = new Intro();
};

const showGame = () => {
    state.sceneName = "game";
    state.scene = new Game();
};

const showGameOver = () => {
    state.view.camera = {x: 0, y: 0};
    state.sfx.stopMusic();
    state.sfx.gameOver();
    state.sceneName = "gameOver";
    const score = state.scene.score;
    state.scene = {
        update: () => {
            state.view.callScaled((ctx) => ctx.clearRect(0, 0, options.worldSize.x, options.worldSize.y));
            new Label(() => "game over!", {x: 50, y: 40}).render(state.view);
            new Label(() => `${score} points`, {x: 60, y: 50}).render(state.view);
        }
    };
};

const random = (min, max) => min + (max - min) * Math.random();
