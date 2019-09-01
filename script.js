const dbg = (obj) => {
    if (obj) console.log(obj);
    return true;
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const options = {
    volume: 0.2,
    resolution: 0.5,
    worldSize: {x: 200, y: 100}
};

let state = {
    canvasScale: null,
    lastUpdate: null,
    target: null,
    sfx: null,
};

const init = () => {
    dbg("init");
    state.sfx = new Sfx();
    //TODO: state.sfx.startMusic();
    resize();
    update();
};

const resize = () => {
    canvas.width = window.innerWidth * options.resolution;
    canvas.height = window.innerHeight * options.resolution;
    ctx.imageSmoothingEnabled = false;
    state.canvasScale = canvas.width / options.worldSize.x;
};

const boats = [
    new Thing("small-boat-image", {x: 40, y: 30}),
    new Thing("small-boat-image", {x: 100, y: 30}),
];

const whale = new Thing("whale-image", {x: 40, y: 100});

const update = () => {
    const delta = state.lastUpdate ? Date.now() - state.lastUpdate : 0;
    state.lastUpdate = Date.now();
    updateWhale(delta);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const things = [...boats, whale];
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
    ctx.translate(-thing.img.naturalWidth / 2, -thing.img.naturalHeight / 2);
    const scaleX = thing.forward.x < 0 ? -1 : 1;
    ctx.scale(scaleX, 1);
    if (dbg()) ctx.strokeRect(0, 0, thing.img.naturalWidth * scaleX, thing.img.naturalHeight);
    ctx.drawImage(thing.img, 0, 0, thing.img.naturalWidth * scaleX, thing.img.naturalHeight);
    ctx.restore();
};

window.addEventListener("load", () => init());
window.addEventListener("resize", () => resize());
canvas.addEventListener("mousemove", (e) => {
    state.target = Vec.scale({x: e.clientX, y: e.clientY}, options.worldSize.x / window.innerWidth);
});
