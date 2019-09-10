class Submarine {
    constructor(position) {
        this.thing = new Thing(new Sprite("submarine"), position);
        this.velocity = {x: 0, y: 0};
    }

    update(delta) {

    }

    render(view, time) {
        this.thing.render(view, time);
    }
}
