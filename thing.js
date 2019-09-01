class Thing {
    constructor(imgId, pos, forward={x: 1, y: 0}) {
        this.img = document.getElementById(imgId);
        this.pos = pos;
        this.forward = forward;
    }
}
