class Boat {
    constructor(position) {
        this.thing = new Thing(new Sprite("boat"), position);
    }

    draw(ctx, time) {
        this.thing.draw(ctx, time);
    }
}
