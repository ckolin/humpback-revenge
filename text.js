class Text {
    constructor(value, position) {
        this.value = value;
        this.position = position;

        this.font = document.getElementById("font");
        this.fontHeight = 7;
        this.fontText = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&'(),./0123456789:? ";
        this.fontPositions = [0, 7, 14, 21, 28, 35, 42, 49, 56, 60, 67, 74, 81, 90, 98, 105, 112, 120, 127, 134, 142, 149, 156, 165, 172, 180, 187, 191, 198, 207, 214, 224, 233, 237, 242, 247, 252, 256, 262, 269, 273, 280, 287, 294, 301, 308, 315, 322, 329, 333, 341, 346];
    }

    draw(ctx) {
        ctx.translate(this.position.x, this.position.y);
        let x = 0;
        for (let char of this.value.toUpperCase()) {
            const i = this.fontText.indexOf(char);
            if (i < 0) continue;
            const pos = this.fontPositions[i];
            const width = this.fontPositions[i + 1] - pos;
            ctx.drawImage(this.font, pos, 0, width, this.fontHeight, x, 0, width, this.fontHeight);
            x += width + 1;
        }
    }
}
