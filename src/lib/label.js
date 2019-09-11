class Label {
    constructor(valueFn, position = {x: 0, y: 0}, rightAlign = false) {
        this.valueFn = valueFn;
        this.position = position;
        this.rightAlign = rightAlign;

        this.font = document.getElementById("font");
        this.fontHeight = 7;
        this.fontText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'(),./0123456789:? ";
        this.fontPositions = [0, 7, 14, 21, 28, 35, 42, 49, 56, 60, 67, 74, 81, 90, 98, 105, 112, 120, 127, 134, 142, 149, 156, 165, 172, 180, 187, 191, 198, 207, 214, 224, 233, 237, 242, 247, 252, 256, 262, 269, 273, 280, 287, 294, 301, 308, 315, 322, 329, 333, 341, 346];
    }

    render(view) {
        view.callScaled((ctx) => {
            const indexes = this.valueFn().toUpperCase()
                .split("")
                .map((char) => this.fontText.indexOf(char))
                .filter((i) => i >= 0);

            ctx.translate(this.position.x, this.position.y);
            if (this.rightAlign)
                ctx.translate(-this.stringWidth(indexes), 0);

            let x = 0;
            for (let i of indexes) {
                const pos = this.fontPositions[i];
                const width = this.fontPositions[i + 1] - pos;
                ctx.drawImage(this.font, pos, 0, width, this.fontHeight, x, 0, width, this.fontHeight);
                x += width + 1;
            }
        });
    }

    stringWidth(indexes) {
        return indexes
            .map((i) => this.fontPositions[i + 1] - this.fontPositions[i] + 1)
            .reduce((a, b) => a + b, -1);
    }
}
