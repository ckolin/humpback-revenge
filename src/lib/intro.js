class Intro {
    constructor() {
        this.stages = [
            [
                new Label(() => "tap to play", {x: 58, y: 48})
            ], [
                new Label(() => "the fishermen", {x: 30, y: 30}),
                new Label(() => "killed your wife", {x: 30, y: 40})
            ], [
                new Label(() => "the fishermen", {x: 30, y: 30}),
                new Label(() => "killed your wife", {x: 30, y: 40}),
                new Label(() => "that crosses", {x: 30, y: 55}),
                new Label(() => "several lines", {x: 30, y: 65})
            ], [
                new Label(() => "you've decided", {x: 30, y: 40}),
                new Label(() => "it's time for", {x: 30, y: 50}),
            ], [
                new Label(() => "humpback revenge", {x: 36, y: 48})
            ]
        ];
        this.stage = dbg() ? this.stages.length : -1;
        this.next();
    }

    next() {
        this.stage++;
        if (this.stage === this.stages.length - 1) state.sfx.startMusic();
        if (this.stage >= this.stages.length) state.game = new Game();
        else this.render();
    }

    render() {
        state.view.callScaled((ctx) => ctx.clearRect(0, 0, options.worldSize.x, options.worldSize.y));
        this.stages[this.stage].forEach((item) => item.render(state.view));
    }
}
