const dbg = (obj) => {
    if (obj) console.log(obj);
    return location.hash === "#debug";
};

const options = {
    volume: 0.2,
    resolution: dbg() ? 0.5 : 1,
    worldSize: {x: 200, y: 100},
    colors: [
        "#1a1c2c", "#5d275d", "#b13e53", "#ef7d57", "#ffcd75", "#a7f070", "#38b764", "#257179",
        "#29366f", "#3b5dc9", "#41a6f6", "#73eff7", "#f4f4f4", "#94b0c2", "#566c86", "#333c57"
    ]
};

const state = {
    canvas: null,
    ctx: null,
    canvasScale: null,
    lastUpdate: null,
    target: null,
    sfx: null,
};

window.addEventListener("load", () => {
    dbg("init");

    state.canvas = document.getElementById("canvas");
    state.ctx = state.canvas.getContext("2d");
    state.sfx = new Sfx();
    //TODO: state.sfx.startMusic();
    state.ocean = new Ocean(options.worldSize, 80);
    window.addEventListener("resize", () => resize());
    state.canvas.addEventListener("mousemove", (e) => {
        state.target = Vec.scale({x: e.clientX, y: e.clientY}, options.worldSize.x / window.innerWidth);
    });

    resize();
    update();
});

const resize = () => {
    state.canvas.width = window.innerWidth * options.resolution;
    state.canvas.height = window.innerHeight * options.resolution;
    state.ctx.imageSmoothingEnabled = false;
    state.canvasScale = state.canvas.width / options.worldSize.x;
};

const boats = [
    new Thing("small-boat-image", {x: 40, y: 15}),
    new Thing("small-boat-image", {x: 100, y: 15}),
];

const whale = new Thing("whale-image", {x: 20, y: 60});

// TODO
const test = {
    img: document.getElementById("seaweed-image"),
    pos: {x: 10, y: 82},
    forward: {x: 1, y: 0},
    draw: (ctx) => {
        const width = 16;
        const delay = 600;
        const frames = 4;
        const frame = Math.floor(Date.now() / delay) % frames;
        ctx.translate(test.pos.x, test.pos.y);
        ctx.rotate(Vec.angle(test.forward));
        ctx.translate(-width / 2, -test.img.naturalHeight / 2);
        const scaleX = test.forward.x < 0 ? -1 : 1;
        ctx.scale(scaleX, 1);
        ctx.strokeStyle = options.colors[0];
        if (dbg()) ctx.strokeRect(0, 0, width * scaleX, test.img.naturalHeight);
        ctx.drawImage(test.img, width * frame, 0, width, test.img.naturalHeight, 0, 0, width * scaleX, test.img.naturalHeight);
    }
};

const text = new Text("Hello, World!", {x: 1, y: 1});

const update = () => {
    const delta = state.lastUpdate ? Date.now() - state.lastUpdate : 0;
    state.lastUpdate = Date.now();
    updateWhale(delta);
    state.ocean.update();

    state.ctx.fillStyle = options.colors[4];
    state.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);
    [state.ocean.background, ...boats, whale, test, state.ocean.foreground, text].forEach(t => drawScaled(t));

    requestAnimationFrame(update);
};

const drawScaled = (thing) => {
    state.ctx.save();
    state.ctx.scale(state.canvasScale, state.canvasScale);
    thing.draw(state.ctx);
    state.ctx.restore();
};

const updateWhale = (delta) => {
    if (!state.target) state.target = whale.position;
    whale.forward = Vec.normalize(Vec.subtract(state.target, whale.position));
    if (Vec.distance2(state.target, whale.position) > 10)
        whale.position = Vec.add(whale.position, Vec.scale(whale.forward, delta * 0.02));
};
