const dbg = (obj) => {
    if (obj) console.log(obj);
    return true;
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const options = {
    worldSize: {x: 300, y: 200}
};

let state = {
    canvasScale: 1,
};

const init = () => {
    dbg("init");
    resize();
    draw();
};

const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;
    state.canvasScale = canvas.width / options.worldSize.x;
};

const whale = {
    img: document.getElementById("whale-img"),
    size: {x: 60, y: 40},
    pos: {x: 40, y: 100},
    forward: {x: 1, y: 1}
};

const small_boat = {
    img: document.getElementById("small-boat-img"),
    size: {x: 60, y: 40},
    pos: {x: 100, y: 30},
    forward: {x: 1, y: 0}
};

const things = [
	small_boat,
	whale
];

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    things.forEach(t => drawThing(t));
    requestAnimationFrame(draw);
};

const drawThing = (thing) => {
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

const target = (pos) => {
    whale.forward = Vec.subtract(pos, whale.pos);
};

window.addEventListener("load", () => init());
window.addEventListener("resize", () => resize());
canvas.addEventListener("mousemove", (e) => target(Vec.scale({x: e.layerX, y: e.layerY}, 1 / state.canvasScale)));
