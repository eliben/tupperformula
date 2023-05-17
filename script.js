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

    clear() {
        this.data.fill(false);
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
    // TODO: set the canvas size based on squareSize

    State.ctx = Canvas.getContext('2d');
    State.grid = new PlotGrid(State.plotWidth, State.plotHeight);

    drawPlot();
    Knum.addEventListener('input', onNumChange);

    // Invoke num event to render whatever the text area is showing on init.
    onNumChange();
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
    let K = BigInt(Knum.value);
    // TODO: catch conversion exception here and do something intelligent?
    // write error on the canvas?
    for (let x = 0; x < State.plotWidth; x++) {
        for (let y = 0; y < State.plotHeight; y++) {
            State.grid.setCell(x, y, tupperFormula(BigInt(x), K + BigInt(y)));
        }
    }

    drawPlot();
}

// Computes the actual Tupper's formula for a given (x,y) with a boolean result.
// Note that it uses JS's built-in BigInt, and therefore doesn't use Math.floor
// and tweaks the formula slightly to make sense with integers.
function tupperFormula(x, y) {
    let powOfTwo = 17n * x + y % 17n;
    let d = (y / 17n) / 2n ** powOfTwo;
    let rhs = d % 2n;
    return rhs == 1n;
}

// TODO: note
// 4858450636189713423582095962494202044581400587983244549483093085061934704708809928450644769865524364849997247024915119110411605739177407856919754326571855442057210445735883681829823754139634338225199452191651284348332905131193199953502413758765239264874613394906870130562295813219481113685339535565290850023875092856892694555974281546386510730049106723058933586052544096664351265349363643957125565695936815184334857605266940161251266951421550539554519153785457525756590740540157929001765967965480064427829131488548259914721248506352686630476300
// produces the formula in the right orientation
//
// 2352035939949658122140829649197960929306974813625028263292934781954073595495544614140648457342461564887325223455620804204796011434955111022376601635853210476633318991990462192687999109308209472315419713652238185967518731354596984676698288025582563654632501009155760415054499960
// produces euler's formula
//
// 144520248970897582847942537337194567481277782215150702479718813968549088735682987348888251320905766438178883231976923440016667764749242125128995265907053708020473915320841631792025549005418004768657201699730466383394901601374319715520996181145249781945019068359500510657804325640801197867556863142280259694206254096081665642417367403946384170774537427319606443899923010379398938675025786929455234476319291860957618345432248004921728033349419816206749854472038193939738513848960476759782673313437697051994580681869819330446336774047268864
// is the pacman thing
//
// Have these as pre-sets.

init();
