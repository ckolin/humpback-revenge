class View {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvasScale = null;
        this.camera = {x: 0, y: 0};
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

    callScaled(fn) {
        this.ctx.save();
        this.ctx.scale(this.canvasScale, this.canvasScale);
        fn(this.ctx);
        this.ctx.restore();
    }

    callScaledAndTranslated(fn) {
        this.ctx.save();
        this.ctx.scale(this.canvasScale, this.canvasScale);
        this.ctx.translate(this.camera.x, this.camera.y);
        fn(this.ctx);
        this.ctx.restore();
    }
}
