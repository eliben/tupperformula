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

// Program state
const Canvas = document.getElementById('plot');
const Ctx = Canvas.getContext('2d');
const Knum = document.querySelector('#knum');
Knum.addEventListener('input', onNumChange);

// Our grid is the default 106x17
const SquareSize = 6;
const GridWidth = 106;
const GridHeight = 17;

// Constants for drawing the grid on the canvas
const GridOffsetLeft = 35;
const GridOffsetTop = 20;
const GridOffsetBottom = 20;

let Grid = new PlotGrid(GridWidth, GridHeight);

function drawPlot() {
    Canvas.width = GridOffsetLeft + SquareSize * GridWidth;
    Canvas.height = GridOffsetTop + SquareSize * GridHeight + GridOffsetBottom;

    Ctx.clearRect(0, 0, Canvas.width, Canvas.height);

    // Draw y axis
    Ctx.beginPath();
    Ctx.moveTo(GridOffsetLeft - 1, GridOffsetTop);
    Ctx.lineTo(GridOffsetLeft - 1, GridOffsetTop + GridHeight * SquareSize + 1);
    Ctx.lineWidth = 1;
    Ctx.strokeStyle = 'black';
    Ctx.stroke();

    // y axis labels
    Ctx.font = '8px';
    Ctx.fillText("K+16", GridOffsetLeft - 30, GridOffsetTop + 8);
    Ctx.fillText("K", GridOffsetLeft - 30, GridOffsetTop + GridHeight * SquareSize);

    // Draw x axis
    Ctx.beginPath();
    Ctx.moveTo(GridOffsetLeft - 1, GridOffsetTop + GridHeight * SquareSize);
    Ctx.lineTo(GridOffsetLeft + GridWidth * SquareSize, GridOffsetTop + GridHeight * SquareSize);
    Ctx.lineWidth = 1;
    Ctx.strokeStyle = 'black';
    Ctx.stroke();

    // x axis labels
    Ctx.fillText("0", GridOffsetLeft + 2, GridOffsetTop + GridHeight * SquareSize + 12);
    Ctx.fillText("105", GridOffsetLeft - 3*SquareSize + GridWidth * SquareSize, GridOffsetTop + GridHeight * SquareSize + 12);

    // Fill in the grid
    for (let x = 0; x < GridWidth; x++) {
        for (let y = 0; y < GridHeight; y++) {
            let cx = GridOffsetLeft + x * SquareSize;
            let cy = GridOffsetTop + (GridHeight - y - 1) * SquareSize;

            if (Grid.getCell(x, y)) {
                Ctx.fillStyle = '#030773';
            } else {
                Ctx.fillStyle = '#F2F2F2';
            }
            Ctx.fillRect(cx, cy, SquareSize, SquareSize);
        }
    }
}

function onNumChange() {
    let K = BigInt(Knum.value);
    // TODO: catch conversion exception here and do something intelligent?
    // write error on the canvas?
    for (let x = 0; x < GridWidth; x++) {
        for (let y = 0; y < GridHeight; y++) {
            Grid.setCell(x, y, tupperFormula(BigInt(x), K + BigInt(y)));
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
// This tupper formula comes out inverted on both axes
// 960939379918958884971672962127852754715004339660129306651505519271702802395266424689642842174350718121267153782770623355993237280874144307891325963941337723487857735749823926629715517173716995165232890538221612403238855866184013235585136048828693337902491454229288667081096184496091705183454067827731551705405381627380967602565625016981482083418783163849115590225610003652351370343874461848378737238198224849863465033159410054974700593138339226497249461751545728366702369745461014655997933798537483143786841806593422227898388722980000748404719
//
// Have these as pre-sets.

// Trigger a redraw to get started.
onNumChange();

