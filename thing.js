class Thing {
    constructor(imageId, pos, forward={x: 1, y: 0}) {
        this.image = document.getElementById(imageId);
        this.position = pos;
        this.forward = forward;
    }

    draw(ctx) {
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(Vec.angle(this.forward));
        ctx.translate(-this.image.naturalWidth / 2, -this.image.naturalHeight / 2);
        const scaleX = this.forward.x < 0 ? -1 : 1;
        ctx.scale(scaleX, 1);
        ctx.strokeStyle = options.colors[0];
        if (dbg()) ctx.strokeRect(0, 0, this.image.naturalWidth * scaleX, this.image.naturalHeight);
        ctx.drawImage(this.image, 0, 0, this.image.naturalWidth * scaleX, this.image.naturalHeight);
    }
}
