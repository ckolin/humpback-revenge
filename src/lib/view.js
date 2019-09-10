class View {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvasScale = null;
        this.camera = {x: 0, y: 0};
        this.cameraVelocity = {x: 0, y: 0};
        this.directionRadius = 60;
        this.canvas.addEventListener("click", () => this.canvas.requestPointerLock());
        this.canvas.addEventListener("mousemove", (e) => {
            state.direction = Vec.add(state.direction, {x: e.movementX, y: e.movementY});
            if (Vec.length2(state.direction) > this.directionRadius ** 2)
                state.direction = Vec.scale(Vec.normalize(state.direction), this.directionRadius);
        });
        this.resize();
    }

    resize() {
        this.canvasScale = Math.floor(Math.min(
            Math.min(window.innerWidth / options.worldSize.x, window.innerHeight / options.worldSize.y),
            options.maxScale
        ));
        const canvasSize = Vec.scale(options.worldSize, this.canvasScale);
        this.canvas.width = canvasSize.x;
        this.canvas.height = canvasSize.y;
        this.canvas.style.left = `${(window.innerWidth - canvasSize.x) / 2}px`;
        this.canvas.style.top = `${(window.innerHeight - canvasSize.y) / 2}px`;
        this.ctx.imageSmoothingEnabled = false;
    };

    update(delta) {
        const diff = state.whale.thing.position.x - this.camera.x - options.worldSize.x / 2;
        this.cameraVelocity = Vec.add(this.cameraVelocity, {x: diff, y: 0});
        this.cameraVelocity = Vec.scale(this.cameraVelocity, 0.1);
        this.camera = Vec.add(this.camera, Vec.scale(this.cameraVelocity, 0.01 * delta));
    }

    callScaled(fn) {
        this.ctx.save();
        this.ctx.scale(this.canvasScale, this.canvasScale);
        fn(this.ctx);
        this.ctx.restore();
    }

    callScaledAndTranslated(fn) {
        this.ctx.save();
        this.ctx.scale(this.canvasScale, this.canvasScale);
        this.ctx.translate(-this.camera.x, -this.camera.y);
        fn(this.ctx);
        this.ctx.restore();
    }
}
