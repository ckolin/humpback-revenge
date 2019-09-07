class Sprite {
    constructor(imageId, frames = 1, delay = 500, offset = 0, centered = true) {
        this.image = document.getElementById(imageId);
        this.frames = frames;
        this.frameWidth = Math.max(this.image.naturalWidth / frames, 1);
        this.delay = delay;
        this.offset = offset;
        this.centered = centered;
    }

    draw(ctx, time = 0, scaleX = 1) {
        const frame = this.frames <= 1 ? 0 : Math.floor(time / this.delay + this.offset) % this.frames;
        if (this.centered) ctx.translate(-this.frameWidth / 2, -this.image.naturalHeight / 2);
        ctx.scale(scaleX, 1);
        ctx.strokeStyle = options.colors[0];
        if (dbg()) ctx.strokeRect(0, 0, this.frameWidth * scaleX, this.image.naturalHeight);
        ctx.drawImage(
            this.image,
            this.frameWidth * frame, 0,
            this.frameWidth, this.image.naturalHeight,
            0, 0,
            this.frameWidth * scaleX, this.image.naturalHeight
        );
    }
}
