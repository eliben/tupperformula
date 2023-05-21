'use strict';

// PlotGrid implements a two dimensional grid [width x height], and provides
// access to the grid's cells. Each cell has a boolean value.
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

    flipCell(x, y) {
        this.data[y * this.w + x] = !this.data[y * this.w + x];
    }

    clear() {
        this.data.fill(false);
    }
}

// Program state
const GridWidth = 106;
const GridHeight = 17;
let Grid = new PlotGrid(GridWidth, GridHeight);

const Canvas = document.getElementById('plot');
const Ctx = Canvas.getContext('2d');
Canvas.addEventListener('click', onCanvasClick, false);
const Knum = document.querySelector('#knum');
Knum.addEventListener('input', onStateChange);
const Samples = document.querySelector("#samples");
document.querySelector("#setsample").addEventListener("mousedown", onSetSample);
const Flipx = document.querySelector("#flipx");
Flipx.addEventListener("change", onStateChange);
const Flipy = document.querySelector("#flipy");
Flipy.addEventListener("change", onStateChange);

// Constants for drawing the grid on the canvas
const SquareSize = 6;
const GridOffsetLeft = 35;
const GridOffsetTop = 20;
const GridOffsetBottom = 20;

const kSamples = [
    { 'name': '', 'value': '' },
    { 'name': 'Zero (clear plot)', 'value': '0' },
    { 'name': "Tupper formula", 'value': '4858450636189713423582095962494202044581400587983244549483093085061934704708809928450644769865524364849997247024915119110411605739177407856919754326571855442057210445735883681829823754139634338225199452191651284348332905131193199953502413758765239264874613394906870130562295813219481113685339535565290850023875092856892694555974281546386510730049106723058933586052544096664351265349363643957125565695936815184334857605266940161251266951421550539554519153785457525756590740540157929001765967965480064427829131488548259914721248506352686630476300' },
    { 'name': "Square smiley", 'value': '6064344935827571835614778444061589919313891311' },
    { 'name': "Euler's formula", 'value': '2352035939949658122140829649197960929306974813625028263292934781954073595495544614140648457342461564887325223455620804204796011434955111022376601635853210476633318991990462192687999109308209472315419713652238185967518731354596984676698288025582563654632501009155760415054499960' },
    { 'name': "Gaussian integral", 'value': '508411814725237793490184685607928051712978709069113963219472322355961889205509647875243182487424548011065302195495255076677579195428341974648257591226943624088561851582362286514668228623643268365545205530024977530231620346490475113424521177721792317416883907382225428124416171767731730432833100919222165896234346422524283458953655483165926745106112524241008306406740167124219895434116142045940981532296849259570821460383355145202351587983360' },
    { 'name': "Pacman", 'value': '144520248970897582847942537337194567481277782215150702479718813968549088735682987348888251320905766438178883231976923440016667764749242125128995265907053708020473915320841631792025549005418004768657201699730466383394901601374319715520996181145249781945019068359500510657804325640801197867556863142280259694206254096081665642417367403946384170774537427319606443899923010379398938675025786929455234476319291860957618345432248004921728033349419816206749854472038193939738513848960476759782673313437697051994580681869819330446336774047268864' },
    { 'name': "Inverted Tupper", 'value': '960939379918958884971672962127852754715004339660129306651505519271702802395266424689642842174350718121267153782770623355993237280874144307891325963941337723487857735749823926629715517173716995165232890538221612403238855866184013235585136048828693337902491454229288667081096184496091705183454067827731551705405381627380967602565625016981482083418783163849115590225610003652351370343874461848378737238198224849863465033159410054974700593138339226497249461751545728366702369745461014655997933798537483143786841806593422227898388722980000748404719' },
    { 'name': "Inverted with Foo", 'value': '960939379918958884971672962127852754715004339660129306651505519271702802395266424689642842174350718121267153782770623355993237280874144307891325963941337723487857735749823926629715517173716995165232890538221612403238855866184013235585136048828693337902491454229288667081096184496091705309087806690564266452326386646008821389746060605965253303014742701354474027791780946968553862253070819385608832768590132403649185614788859567542919861529314447794462973949841385151019888204961408707914855626783089764139102078900158237613270487793175986569199' },
]

// Populate the predefined Ks menu
for (let sample of kSamples) {
    let option = elt("option", sample.name);
    option.setAttribute('value', sample.name);
    Samples.appendChild(option);
}

// Trigger a redraw to get started.
onStateChange();

//------------------

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
    let startYLabel = Flipy.checked ? "K" : "K+16";
    let endYLabel = Flipy.checked ? "K+16" : "K";
    Ctx.fillText(startYLabel, GridOffsetLeft - 30, GridOffsetTop + 8);
    Ctx.fillText(endYLabel, GridOffsetLeft - 30, GridOffsetTop + GridHeight * SquareSize);

    // Draw x axis
    Ctx.beginPath();
    Ctx.moveTo(GridOffsetLeft - 1, GridOffsetTop + GridHeight * SquareSize);
    Ctx.lineTo(GridOffsetLeft + GridWidth * SquareSize, GridOffsetTop + GridHeight * SquareSize);
    Ctx.lineWidth = 1;
    Ctx.strokeStyle = 'black';
    Ctx.stroke();

    // x axis labels
    let startXLabel = Flipx.checked ? "105" : "0";
    let endXLabel = Flipx.checked ? "0" : "105";
    Ctx.fillText(startXLabel, GridOffsetLeft, GridOffsetTop + GridHeight * SquareSize + 12);
    Ctx.fillText(endXLabel, GridOffsetLeft - endXLabel.length * SquareSize + GridWidth * SquareSize, GridOffsetTop + GridHeight * SquareSize + 12);

    // Fill in the grid
    for (let x = 0; x < GridWidth; x++) {
        for (let y = 0; y < GridHeight; y++) {
            let cx = GridOffsetLeft + x * SquareSize;
            let cy = GridOffsetTop + (GridHeight - y - 1) * SquareSize;

            let plotX = Flipx.checked ? (GridWidth - x - 1) : x;
            let plotY = Flipy.checked ? (GridHeight - y - 1) : y;
            if (Grid.getCell(plotX, plotY)) {
                Ctx.fillStyle = '#030773';
            } else {
                Ctx.fillStyle = '#F2F2F2';
            }
            Ctx.fillRect(cx, cy, SquareSize, SquareSize);
        }
    }
}

function onStateChange() {
    try {
        let K = BigInt(Knum.value);

        for (let x = 0; x < GridWidth; x++) {
            for (let y = 0; y < GridHeight; y++) {
                Grid.setCell(x, y, tupperFormula(BigInt(x), K + BigInt(y)));
            }
        }

        Knum.style.background = 'white';
    } catch (error) {
        Knum.style.background = '#f7b7b7';
        Grid.clear();
    }

    drawPlot();
}

function onSetSample() {
    let selectedK = kSamples[Samples.selectedIndex];
    Knum.value = selectedK.value;
    onStateChange();
}

function onCanvasClick(ev) {
    // Find x,y offsets of click within the canvas.
    let canvasRect = Canvas.getBoundingClientRect();
    let x = ev.clientX - canvasRect.left;
    let y = ev.clientY - canvasRect.top;

    // Find square offsets from the Canvas's top-left corner, counting right
    // and down, and ensure the click is in bounds.
    let xc = Math.floor((x - GridOffsetLeft) / SquareSize);
    let yc = Math.floor((y - GridOffsetTop) / SquareSize);
    if (xc < 0 || xc >= GridWidth || yc < 0 || yc >= GridHeight) {
        return;
    }

    // Calculate grid location of the click, depending on the flip status.
    // Note the different order of conditions, because the y position is
    // provided from the top down.
    let gridX = Flipx.checked ? GridWidth - 1 - xc : xc;
    let gridY = Flipy.checked ? yc : GridHeight - 1 - yc;
    Grid.flipCell(gridX, gridY);

    // Update the K value with a new one calculated from the modified grid
    Knum.value = encodeGridToK();
    onStateChange();
}

// Computes the actual Tupper's formula for a given (x,y) with a boolean result.
// Note that it uses JS's built-in BigInt, and therefore doesn't use Math.floor
// and tweaks/simplifies the formula slightly to make sense with integers.
//
// This makes the encoding apparent:
//
// We take the binary representation of the image - 1 for black, 0 for white,
// running from the bottom left corner up until the top of the column, then back
// to the bottom of the next column. Call this number IMG, then K = 17 * IMG.
//
// To decode the image we use x, y as follows: let's represent y as 17q+r where
// r is (y % 17). y starts at K. Some bits of the image:
//
// (x=0, y=K):     q >> (0 + 0) ==> the first lowest bit of IMG
// (x=0, y=K+1):   q >> (0 + 1) ==> the second lowest bit of IMG
// (x=0, y=K+2):   q >> (0 + 2) ==> the third lowest bit of IMG
// ...
// (x=1, y=K):     q >> (17 + 0) ==> the eighteenth lowest bit of IMG
// ... and so on
function tupperFormula(x, y) {
    let d = (y / 17n) >> (17n * x + y % 17n);
    return d % 2n == 1n;
}

// Calculate K value from the grid.
function encodeGridToK() {
    let kval = BigInt(0);

    // Build up K from MSB to LSB, scanning from the top-right corner down and
    // then moving left by column.
    for (let x = GridWidth - 1; x >= 0; x--) {
        for (let y = GridHeight - 1; y >= 0; y--) {
            kval = 2n * kval + BigInt(Grid.getCell(x, y));
        }
    }
    return kval * 17n;
}

// elt creates a new HTML element with the given type and list of children
// elements. If a child is of type string, a text node child is appended with
// that string's contents.
function elt(type, ...children) {
    let node = document.createElement(type);
    for (let child of children) {
        if (typeof child != "string") {
            node.appendChild(child);
        } else {
            node.appendChild(document.createTextNode(child));
        }
    }
    return node;
}
