class Floor {
    constructor(size = options.worldSize, floorLevel = 10) {
        this.size = size;
        this.floorLevel = floorLevel;
        this.sines = [
            {a: 1, b: 0.09},
            {a: 0.8, b: 0.05}
        ]
    }

    render(view, time) {
        view.callScaled((ctx) => {
            for (let x = 0; x < this.size.x; x++) {
                const y = Math.floor(this.size.y - this.height(x));
                ctx.fillStyle = options.colors[13];
                ctx.fillRect(x, y, 1, 2);
                ctx.fillStyle = options.colors[14];
                ctx.fillRect(x, y + 2, 1, this.size.y - y - 2);
            }
        })
    }

    sineSum(x) {
        return this.sines
            .map((s) => s.a * Math.sin(x * s.b))
            .reduce((a, b) => a + b, 0);
    }

    height(x) {
        return this.floorLevel + this.sineSum(x + state.view.camera.x);
    }
}
