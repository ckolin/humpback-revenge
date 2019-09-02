class Sprite {
    constructor(imageId, frames=1, delay=500) {
        this.image = document.getElementById(imageId);
        this.frames = frames;
        this.frameWidth = this.image.naturalWidth / frames;
        this.delay = delay;
    }

    draw(ctx, time, scaleX) {
        const frame = Math.floor(time/ this.delay) % this.frames;
        ctx.translate(-this.frameWidth / 2, -this.image.naturalHeight / 2);
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
