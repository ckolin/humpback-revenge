class Ocean {
    constructor(size, seaLevel) {
        this.size = size;
        this.seaLevel = seaLevel;
        this.sines = [
            {a: 1, b: 0.09, c: 0.001},
            {a: 1, b: 0.04, c: 0.0015},
            {a: 0.8, b: 0.3, c: 0.002}
        ];

        this.points = [];
        for (let x = 0; x < this.size.x; x++)
            this.points.push({height: 0, velocity: 0});

        this.foreground = {
            render: (view, time) => {
                view.callScaledAndTranslated((ctx) => {
                    for (let x = 0; x < this.size.x; x++) {
                        const y = Math.floor(this.size.y - this.height(x, time));
                        ctx.fillStyle = options.colors[12];
                        ctx.fillRect(x, y, 1, 2);
                        ctx.fillStyle = options.colors[11];
                        ctx.fillRect(x, y + 2, 1, 1);
                    }
                });
            }
        };

        this.background = {
            render: (view, time) => {
                view.callScaledAndTranslated((ctx) => {
                    ctx.fillStyle = options.colors[10];
                    for (let x = 0; x < this.size.x; x++) {
                        const y = Math.floor(this.size.y - this.height(x, time));
                        ctx.fillRect(x, y + 3, 1, this.size.y - y - 3);
                    }
                });
            }
        };
    }

    splash(startX, force = 1, width = 12) {
        for (let x = Math.floor(startX); x < startX + width; x++)
            if (x > 0 && x < this.size.x)
                this.points[x].velocity += force;
    }

    update() {
        for (let x = 0; x < this.points.length; x++) {
            const point = this.points[x];
            const left = x > 0 ? this.points[x - 1].height - point.height : 0;
            const right = x < this.points.length - 1 ? this.points[x + 1].height - point.height : 0;
            const force = 3 * (left + right) - 1 * point.height;
            point.velocity = 0.98 * point.velocity + 0.005 * force;
            point.height += point.velocity;
        }
    }

    sineSum(x, time) {
        return this.sines
            .map((s) => s.a * Math.sin(x * s.b + s.c * time))
            .reduce((a, b) => a + b, 0);
    }

    height(x, time) {
        return this.seaLevel + this.points[x].height + this.sineSum(x, time);
    }
}
