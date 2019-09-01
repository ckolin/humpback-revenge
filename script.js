const dbg = (obj) => {
    if (obj) console.log(obj);
    return true;
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const options = {
    volume: 0.2,
    resolution: 0.3,
    worldSize: {x: 300, y: 200}
};

let state = {
    canvasScale: 1,
    lastUpdate: null,
    target: null,
    sfx: null,
};

const init = () => {
    dbg("init");
    state.sfx = new Sfx();
    if (!dbg()) state.sfx.startMusic();
    resize();
    update();
};

const resize = () => {
    canvas.width = window.innerWidth * options.resolution;
    canvas.height = window.innerHeight * options.resolution;
    ctx.imageSmoothingEnabled = false;
    state.canvasScale = canvas.width / options.worldSize.x;
};

const whale = {
    img: document.getElementById("whale-img"),
    size: {x: 30, y: 20},
    pos: {x: 40, y: 100},
    forward: {x: 1, y: 1}
};

const small_boat = {
    img: document.getElementById("small-boat-img"),
    size: {x: 30, y: 20},
    pos: {x: 100, y: 30},
    forward: {x: 1, y: 0}
};

const things = [
    small_boat,
    whale
];

const update = () => {
    const delta = state.lastUpdate ? Date.now() - state.lastUpdate : 0;
    state.lastUpdate = Date.now();

    updateWhale(delta);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    things.forEach(t => draw(t));

    requestAnimationFrame(update);
};

const updateWhale = (delta) => {
    if (!state.target) state.target = whale.pos;
    whale.forward = Vec.normalize(Vec.subtract(state.target, whale.pos));
    if (Vec.distance2(state.target, whale.pos) > 10)
        whale.pos = Vec.add(whale.pos, Vec.scale(whale.forward, delta * 0.03));
};

const draw = (thing) => {
    ctx.save();
    ctx.scale(state.canvasScale, state.canvasScale);
    ctx.translate(thing.pos.x, thing.pos.y);
    ctx.rotate(Vec.angle(thing.forward));
    ctx.translate(-thing.size.x / 2, -thing.size.y / 2);
    const scaleX = thing.forward.x < 0 ? -1 : 1;
    ctx.scale(scaleX, 1);
    ctx.drawImage(thing.img, 0, 0, thing.size.x * scaleX, thing.size.y);
    if (dbg()) ctx.strokeRect(0, 0, thing.size.x * scaleX, thing.size.y);
    ctx.restore();
};

window.addEventListener("load", () => init());
window.addEventListener("resize", () => resize());
canvas.addEventListener("mousemove", (e) => state.target = Vec.scale({
    x: e.clientX,
    y: e.clientY
}, options.worldSize.x / window.innerWidth));
