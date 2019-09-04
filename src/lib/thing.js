class Thing {
    constructor(sprite, pos, forward = {x: 1, y: 0}) {
        this.sprite = sprite;
        this.position = pos;
        this.forward = forward;
    }

    draw(ctx, time) {
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(Vec.angle(this.forward));
        const scaleX = this.forward.x < 0 ? -1 : 1;
        this.sprite.draw(ctx, time, scaleX);
    }
}
