'use strict';

class PlotGrid {
    constructor(width, height) {
        this.w = width;
        this.h = height;

        this.data = Array(this.w * this.h).fill(false);
    }

    getCell(x, y) {
        return this.data[y * this.w + x];
    }

    setCell(x, y, value) {
        this.data[y * this.w + x] = value;
    }
}

const Canvas = document.getElementById('plot');
const Knum = document.querySelector('#knum');

let State = {
    ctx: null,

    // The "plot" is a 106x17 grid of squares.
    squareSize: 6,
    plotWidth: 106,
    plotHeight: 17,

    // The data for the plot on the canvas. Has plotWidth * plotHeight elements;
    // each element is false for blank, true for filled.
    grid: null,

    // The offset of the plot from the left and top boundary of the canvas.
    plotOffsetLeft: 20,
    plotOffsetTop: 20,
};

function init() {
    State.ctx = Canvas.getContext('2d');
    State.grid = new PlotGrid(State.plotWidth, State.plotHeight);

    for (let x = 0; x < State.plotWidth; x++) {
        for (let y = 0; y < State.plotHeight; y++) {
            State.grid.setCell(x, y, x === y);
        }
    }

    drawPlot();
    Knum.addEventListener('input', onNumChange);
}

function drawPlot() {
    State.ctx.clearRect(0, 0, Canvas.width, Canvas.height);

    for (let x = 0; x < State.plotWidth; x++) {
        for (let y = 0; y < State.plotHeight; y++) {
            let cx = State.plotOffsetLeft + x * State.squareSize;
            let cy = State.plotOffsetTop + (State.plotHeight - y - 1) * State.squareSize;

            if (State.grid.getCell(x, y)) {
                State.ctx.fillStyle = 'black';
            } else {
                State.ctx.fillStyle = '#E5E5E5';
            }
            State.ctx.fillRect(cx, cy, State.squareSize, State.squareSize);
        }
    }
}

function onNumChange() {
    let val = Knum.value;
    console.log(val);
}

init();
