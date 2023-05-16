'use strict';

let State = {
    canvas: null,
    ctx: null,

    // The "plot" is a 106x17 grid of squares.
    squareSize: 4,
    plotWidth: 106,
    plotHeight: 17,

    // The data for the plot on the canvas. Has plotWidth * plotHeight elements;
    // each element is false for blank, true for filled.
    plotData: [],

    // The offset of the plot from the left and bottom boundary of the canvas.
    plotOffsetLeft: 20,
    plotOffsetBottom: 20,
};

function init() {
    State.canvas = document.getElementById('plot');
    State.ctx = State.canvas.getContext('2d');

    State.plotData = Array(State.plotWidth * State.plotHeight).fill(false);

    drawPlot();
}

function drawPlot() {
    for (let x = 0; x < State.plotWidth; x++) {
        for (let y = 0; y < State.plotHeight; y++) {
            
        }
    }
}

init();
