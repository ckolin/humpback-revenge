class Boat {
    constructor(position) {
        this.thing = new Thing(new Sprite("boat"), position);
    }

    render(view, time) {
        this.thing.render(view, time);
    }
}
