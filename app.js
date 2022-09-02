// COLORING CUBE STICKERS (only top, right, and front side shown)
const topSide = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"];
const frontSide = ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9"];
const rightSide = ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"];
const colorMap = {"Y": "yellow", "W": "white", "B": "blue", "G": "green", "R": "red", "O": "orange"};
const mapStickerIds = {
    '03': 't1','04': 't2','05': 't3','13': 't4','14': 't5','15': 't6','23': 't7','24': 't8','25': 't9',
    '33': 'f1','34': 'f2','35': 'f3','43': 'f4','44': 'f5','45': 'f6','53': 'f7','54': 'f8','55': 'f9',
    '36': 'r1','37': 'r2','38': 'r3','46': 'r4','47': 'r5','48': 'r6','56': 'r7','57': 'r8','58': 'r9'
};
for (i = 0; i < rightSide.length; i++) {
    document.getElementById(rightSide[i]).style.backgroundColor = "blue";
    document.getElementById(frontSide[i]).style.backgroundColor = "orange";
    document.getElementById(topSide[i]).style.backgroundColor = "yellow";
}

// Keep track of every piece's color on the cube
/*
    Top: cubies[0][3] - cubies[2][5], default = yellow
    Left: cubies[3][0] - cubies[5][2], default = green
    Front: cubies[3][3] - cubies[5][5], default = orange
    Right: cubies[3][6] - cubies[5][8], default = blue
    Back: cubies[3][9] - cubies[5][11], default = red
    Bottom: cubies[6][3] - cubies[8][5], default = white
*/
let cubies = [
    ['X', 'X', 'X', 'Y', 'Y', 'Y', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'Y', 'Y', 'Y', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'Y', 'Y', 'Y', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['G', 'G', 'G', 'O', 'O', 'O', 'B', 'B', 'B', 'R', 'R', 'R'],
    ['G', 'G', 'G', 'O', 'O', 'O', 'B', 'B', 'B', 'R', 'R', 'R'],
    ['G', 'G', 'G', 'O', 'O', 'O', 'B', 'B', 'B', 'R', 'R', 'R'],
    ['X', 'X', 'X', 'W', 'W', 'W', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'W', 'W', 'W', 'X', 'X', 'X', 'X', 'X', 'X'],
    ['X', 'X', 'X', 'W', 'W', 'W', 'X', 'X', 'X', 'X', 'X', 'X']
];

// Updating UI when a move is made by recoloring stickers based on cubies array
function updateStickerColors() {
    for(i = 0; i < 3; i++) {
        for (j = 3; j < 6; j++) {
            const sticker = mapStickerIds[String(i)+String(j)];
            document.getElementById(sticker).style.backgroundColor = colorMap[cubies[i][j]];
        }
    }
    for(i = 3; i < 6; i++) {
        for (j = 3; j < 9; j++) {
            const sticker = mapStickerIds[String(i)+String(j)];
            document.getElementById(sticker).style.backgroundColor = colorMap[cubies[i][j]];
        }
    }
}

// flag for if currently solving cube
let solving = false;

// Move Log
const moveLog = [];

// Move Counter
let numMoves = 0
function updateNumMoves() {
    if (solving) {
        numMoves += 1;
        renderNumMoves(numMoves);
    }
}
function undoNumMoves(n) {
    if (solving) {
        numMoves -= n;
        renderNumMoves(numMoves);
    }
}
function resetNumMoves() {
    numMoves = 0;
    renderNumMoves(numMoves);
}
function renderNumMoves(numMoves) {
    document.getElementById("numMoves").innerHTML = "Number of Moves: " + String(numMoves);
}

// Toggles for prime (counterclockwise) and wide moves
let prime = false;
let wide = false;
function togglePrime() {
    btn = document.getElementById("primeButton")
    if (prime) {
        prime = false;
        btn.style.backgroundColor = "#EEE"
    } else {
        prime = true;
        btn.style.backgroundColor = "#777"
    }
}
function toggleWide() {
    btn = document.getElementById("wideButton")
    if (wide) {
        wide = false;
        btn.style.backgroundColor = "#EEE"
    } else {
        wide = true;
        btn.style.backgroundColor = "#777"
    }
}

// CUBE TURNS AND ROTATIONS
function rotatePieces(a, b, c, d, e, f, g, h) {
    let temp = cubies[a][b];
    cubies[a][b] = cubies[c][d];
    cubies[c][d] = cubies[e][f];
    cubies[e][f] = cubies[g][h];
    cubies[g][h] = temp;
}
function rotateLayer(aa, ab, ac, ad, ae, af, ag, ah,
                     ba, bb, bc, bd, be, bf, bg, bh,
                     ca, cb, cc, cd, ce, cf, cg, ch)
{
    rotatePieces(aa, ab, ac, ad, ae, af, ag, ah);
    rotatePieces(ba, bb, bc, bd, be, bf, bg, bh);
    rotatePieces(ca, cb, cc, cd, ce, cf, cg, ch);
}
function rotateFace(aa, ab, ac, ad, ae, af, ag, ah,
                    ba, bb, bc, bd, be, bf, bg, bh)
{
    rotatePieces(aa, ab, ac, ad, ae, af, ag, ah);
    rotatePieces(ba, bb, bc, bd, be, bf, bg, bh);
}

function uTurn() {
    rotateLayer(3, 6, 3, 9, 3, 0, 3, 3, 3, 7, 3, 10, 3, 1, 3, 4, 3, 8, 3, 11, 3, 2, 3, 5);
    rotateFace(0, 3, 2, 3, 2, 5, 0, 5, 0, 4, 1, 3, 2, 4, 1, 5);
    updateStickerColors();
    moveLog.push("U");
    updateNumMoves();
    checkSolved();
}
function uPrimeTurn() {
    rotateLayer(3, 3, 3, 0, 3, 9, 3, 6, 3, 4, 3, 1, 3, 10, 3, 7, 3, 5, 3, 2, 3, 11, 3, 8);
    rotateFace(0, 5, 2, 5, 2, 3, 0, 3, 1, 5, 2, 4, 1, 3, 0, 4);
    updateStickerColors();
    moveLog.push("U'");
    updateNumMoves();
    checkSolved();
}
function dTurn() {
    rotateLayer(5, 3, 5, 0, 5, 9, 5, 6, 5, 4, 5, 1, 5, 10, 5, 7, 5, 5, 5, 2, 5, 11, 5, 8);
    rotateFace(6, 3, 8, 3, 8, 5, 6, 5, 6, 4, 7, 3, 8, 4, 7, 5)
    updateStickerColors();
    moveLog.push("D");
    updateNumMoves();
    checkSolved();
}
function dPrimeTurn() {
    rotateLayer(5, 6, 5, 9, 5, 0, 5, 3, 5, 7, 5, 10, 5, 1, 5, 4, 5, 8, 5, 11, 5, 2, 5, 5);
    rotateFace(6, 3, 6, 5, 8, 5, 8, 3, 6, 4, 7, 5, 8, 4, 7, 3);
    updateStickerColors();
    moveLog.push("D'");
    updateNumMoves();
    checkSolved();
}
function rTurn() {
    rotateLayer(3, 5, 6, 5, 5, 9, 0, 5, 4, 5, 7, 5, 4, 9, 1, 5, 5, 5, 8, 5, 3, 9, 2, 5);
    rotateFace(3, 6, 5, 6, 5, 8, 3, 8, 3, 7, 4, 6, 5, 7, 4, 8);
    updateStickerColors();
    moveLog.push("R");
    updateNumMoves();
    checkSolved();
}
function rPrimeTurn() {
    rotateLayer(0, 5, 5, 9, 6, 5, 3, 5, 1, 5, 4, 9, 7, 5, 4, 5, 2, 5, 3, 9, 8, 5, 5, 5);
    rotateFace(3, 6, 3, 8, 5, 8, 5, 6, 3, 7, 4, 8, 5, 7, 4, 6);
    updateStickerColors();
    moveLog.push("R'");
    updateNumMoves();
    checkSolved();
}
function lTurn() {
    rotateLayer(0, 3, 5, 11, 6, 3, 3, 3, 1, 3, 4, 11, 7, 3, 4, 3, 2, 3, 3, 11, 8, 3, 5, 3);
    rotateFace(3, 0, 5, 0, 5, 2, 3, 2, 3, 1, 4, 0, 5, 1, 4, 2);
    updateStickerColors();
    moveLog.push("L");
    updateNumMoves();
    checkSolved();
}
function lPrimeTurn() {
    rotateLayer(3, 3, 6, 3, 5, 11, 0, 3, 4, 3, 7, 3, 4, 11, 1, 3, 5, 3, 8, 3, 3, 11, 2, 3);
    rotateFace(3, 0, 3, 2, 5, 2, 5, 0, 3, 1, 4, 2, 5, 1, 4, 0);    
    updateStickerColors();
    moveLog.push("L'");
    updateNumMoves();
    checkSolved();
}
function fTurn() {
    rotateLayer(2, 3, 5, 2, 6, 5, 3, 6, 6, 3, 5, 6, 2, 5, 3, 2, 2, 4, 4, 2, 6, 4, 4, 6);
    rotateFace(3, 3, 5, 3, 5, 5, 3, 5, 3, 4, 4, 3, 5, 4, 4, 5);
    updateStickerColors();
    moveLog.push("F");
    updateNumMoves();
    checkSolved();
}
function fPrimeTurn() {
    rotateLayer(3, 6, 6, 5, 5, 2, 2, 3, 3, 2, 2, 5, 5, 6, 6, 3, 4, 6, 6, 4, 4, 2, 2, 4);
    rotateFace(3, 5, 5, 5, 5, 3, 3, 3, 4, 5, 5, 4, 4, 3, 3, 4);
    updateStickerColors();
    moveLog.push("F'");
    updateNumMoves();
    checkSolved();
}
function bTurn() {
    rotateLayer(3, 8, 8, 5, 5, 0, 0, 3, 3, 0, 0, 5, 5, 8, 8, 3, 4, 8, 8, 4, 4, 0, 0, 4);
    rotateFace(3, 9, 5, 9, 5, 11, 3, 11, 3, 10, 4, 9, 5, 10, 4, 11);
    updateStickerColors();
    moveLog.push("B")
    updateNumMoves();
    checkSolved();
}
function bPrimeTurn() {
    rotateLayer(0, 3, 5, 0, 8, 5, 3, 8, 8, 3, 5, 8, 0, 5, 3, 0, 0, 4, 4, 0, 8, 4, 4, 8);
    rotateFace(3, 11, 5, 11, 5, 9, 3, 9, 4, 11, 5, 10, 4, 9, 3, 10);
    updateStickerColors();
    moveLog.push("B'");
    updateNumMoves();
    checkSolved();
}
function mTurn() {
    rotateLayer(0, 4, 5, 10, 6, 4, 3, 4, 3, 10, 8, 4, 5, 4, 2, 4, 1, 4, 4, 10, 7, 4, 4, 4);
    updateStickerColors();
    moveLog.push("M");
    updateNumMoves();
    checkSolved();
}
function mPrimeTurn() {
    rotateLayer(3, 4, 6, 4, 5, 10, 0, 4, 2, 4, 5, 4, 8, 4, 3, 10, 4, 4, 7, 4, 4, 10, 1, 4);
    updateStickerColors();
    moveLog.push("M'");
    updateNumMoves();
    checkSolved();
}
function sTurn() {
    rotateLayer(1, 3, 5, 1, 7, 5, 3, 7, 1, 4, 4, 1, 7, 4, 4, 7, 1, 5, 3, 1, 7, 3, 5, 7);
    updateStickerColors();
    moveLog.push("S");
    updateNumMoves();
    checkSolved();
}
function sPrimeTurn() {
    rotateLayer(3, 7, 7, 5, 5, 1, 1, 3, 4, 7, 7, 4, 4, 1, 1, 4, 5, 7, 7, 3, 3, 1, 1, 5);
    updateStickerColors();
    moveLog.push("S'");
    updateNumMoves();
    checkSolved();
}
function eTurn() {
    rotateLayer(4, 3, 4, 0, 4, 9, 4, 6, 4, 4, 4, 1, 4, 10, 4, 7, 4, 5, 4, 2, 4, 11, 4, 8);
    updateStickerColors();
    moveLog.push("E");
    updateNumMoves();
    checkSolved();
}
function ePrimeTurn() {
    rotateLayer(4, 6, 4, 9, 4, 0, 4, 3, 4, 7, 4, 10, 4, 1, 4, 4, 4, 8, 4, 11, 4, 2, 4, 5);
    updateStickerColors();
    moveLog.push("E'");
    updateNumMoves();
    checkSolved();
}
function xTurn() {
    rTurn(); moveLog.pop();
    lPrimeTurn(); moveLog.pop();
    mPrimeTurn(); moveLog.pop();
    moveLog.push("x");
    undoNumMoves(3);
}
function xPrimeTurn() {
    rPrimeTurn(); moveLog.pop();
    lTurn(); moveLog.pop();
    mTurn(); moveLog.pop();
    moveLog.push("x'");
    undoNumMoves(3);
}
function yTurn() {
    uTurn(); moveLog.pop();
    dPrimeTurn(); moveLog.pop();
    ePrimeTurn(); moveLog.pop();
    moveLog.push("y");
    undoNumMoves(3);
}
function yPrimeTurn() {
    uPrimeTurn(); moveLog.pop();
    dTurn(); moveLog.pop();
    eTurn(); moveLog.pop();
    moveLog.push("y'");
    undoNumMoves(3);
}
function zTurn() {
    fTurn(); moveLog.pop();
    bPrimeTurn(); moveLog.pop();
    sTurn(); moveLog.pop();
    moveLog.push("z");
    undoNumMoves(3);
}
function zPrimeTurn() {
    fPrimeTurn(); moveLog.pop();
    bTurn(); moveLog.pop();
    sPrimeTurn(); moveLog.pop();
    moveLog.push("z'");
    undoNumMoves(3);
}
function uWideTurn() {
    uTurn(); moveLog.pop();
    ePrimeTurn(); moveLog.pop();
    moveLog.push("u");
    undoNumMoves(1);
    checkSolved();
}
function uWidePrimeTurn() {
    uPrimeTurn(); moveLog.pop();
    eTurn(); moveLog.pop();
    moveLog.push("u'");
    undoNumMoves(1);
    checkSolved();
}
function dWideTurn() {
    dTurn(); moveLog.pop();
    eTurn(); moveLog.pop();
    moveLog.push("d");
    undoNumMoves(1);
    checkSolved();
}
function dWidePrimeTurn() {
    dPrimeTurn(); moveLog.pop();
    ePrimeTurn(); moveLog.pop();
    moveLog.push("d'");
    undoNumMoves(1);
    checkSolved();
}
function rWideTurn() {
    rTurn(); moveLog.pop();
    mPrimeTurn(); moveLog.pop();
    moveLog.push("r");
    undoNumMoves(1);
    checkSolved();
}
function rWidePrimeTurn() {
    rPrimeTurn(); moveLog.pop();
    mTurn(); moveLog.pop();
    moveLog.push("r'");
    undoNumMoves(1);
    checkSolved();
}
function lWideTurn() {
    lTurn(); moveLog.pop();
    mTurn(); moveLog.pop();
    moveLog.push("l");
    undoNumMoves(1);
    checkSolved();
}
function lWidePrimeTurn() {
    lPrimeTurn(); moveLog.pop();
    mPrimeTurn(); moveLog.pop();
    moveLog.push("l'");
    undoNumMoves(1);
    checkSolved();
}
function fWideTurn() {
    fTurn(); moveLog.pop();
    sTurn(); moveLog.pop();
    moveLog.push("f");
    undoNumMoves(1);
    checkSolved();
}
function fWidePrimeTurn() {
    fPrimeTurn(); moveLog.pop();
    sPrimeTurn(); moveLog.pop();
    moveLog.push("f'");
    undoNumMoves(1);
    checkSolved();
}
function bWideTurn() {
    bTurn(); moveLog.pop();
    sPrimeTurn(); moveLog.pop();
    moveLog.push("b");
    undoNumMoves(1);
    checkSolved();
}
function bWidePrimeTurn() {
    bPrimeTurn(); moveLog.pop();
    sTurn(); moveLog.pop();
    moveLog.push("b'");
    undoNumMoves(1);
    checkSolved();
}

// KEYBOARD CONTROLS
function keyPressed(moveIds) {
    let ind = -1
    if (prime && wide) {ind = 3;}
    else if (wide && !prime) {ind = 2;}
    else if (prime && !wide) {ind = 1;}
    else {ind = 0;}
    document.getElementById(moveIds[ind]).click();
    document.getElementById(moveIds[ind]).classList.add("button-active");
}
window.addEventListener("keydown", function(event) {
    if (event.key == "u") {
        keyPressed(['uMove', 'uPrimeMove', 'uWideMove', 'uWidePrimeMove']);
    }
    else if (event.key == "d") {
        keyPressed(['dMove', 'dPrimeMove', 'dWideMove', 'dWidePrimeMove']);
    }
    else if (event.key == "r") {
        keyPressed(['rMove', 'rPrimeMove', 'rWideMove', 'rWidePrimeMove']);
    }
    else if (event.key == "l") {
        keyPressed(['lMove', 'lPrimeMove', 'lWideMove', 'lWidePrimeMove']);
    }
    else if (event.key == "f") {
        keyPressed(['fMove', 'fPrimeMove', 'fWideMove', 'fWidePrimeMove']);
    }
    else if (event.key == "b") {
        keyPressed(['bMove', 'bPrimeMove', 'bWideMove', 'bWidePrimeMove']);
    }
    else if (event.key == "m") {
        keyPressed(['mMove', 'mPrimeMove', 'mMove', 'mPrimeMove']);
    }
    else if (event.key == "s") {
        keyPressed(['sMove', 'sPrimeMove', 'sMove', 'sPrimeMove']);
    }
    else if (event.key == "e") {
        keyPressed(['eMove', 'ePrimeMove', 'eMove', 'ePrimeMove']);
    }
    else if (event.key == "x") {
        keyPressed(['xMove', 'xPrimeMove', 'xMove', 'xPrimeMove']);
    }
    else if (event.key == "y") {
        keyPressed(['yMove', 'yPrimeMove', 'yMove', 'yPrimeMove']);
    }
    else if (event.key == "z") {
        keyPressed(['zMove', 'zPrimeMove', 'zMove', 'zPrimeMove']);
    }
    else if (event.key === "'") {
        togglePrime();
      }
    else if (event.key === "w") {
        toggleWide();
    }
    else if (event.key == "q") {
        document.getElementById('undo').click();
        document.getElementById('undo').classList.add("button-active");
    }
});

function releaseKey(moveIdList) {
    for (id of moveIdList) {
        if (document.getElementById(id).classList.contains("button-active")) {
            document.getElementById(id).classList.toggle("button-active")
        }
    }
}
document.onkeyup = function(e) {
    if (e.key === "u") {
        releaseKey(['uMove', 'uPrimeMove', 'uWideMove', 'uWidePrimeMove'])
    }
    else if (e.key === "d") {
        releaseKey(['dMove', 'dPrimeMove', 'dWideMove', 'dWidePrimeMove'])
    }
    else if (e.key === "r") {
        releaseKey(['rMove', 'rPrimeMove', 'rWideMove', 'rWidePrimeMove'])
    }
    else if (e.key === "l") {
        releaseKey(['lMove', 'lPrimeMove', 'lWideMove', 'lWidePrimeMove'])
    }
    else if (e.key === "f") {
        releaseKey(['fMove', 'fPrimeMove', 'fWideMove', 'fWidePrimeMove'])
    }
    else if (e.key === "b") {
        releaseKey(['bMove', 'bPrimeMove', 'bWideMove', 'bWidePrimeMove'])
    }
    else if (e.key === "m") {
        releaseKey(['mMove', 'mPrimeMove'])
    }
    else if (e.key === "s") {
        releaseKey(['sMove', 'sPrimeMove'])
    }
    else if (e.key === "e") {
        releaseKey(['eMove', 'ePrimeMove'])
    }
    else if (e.key === "x") {
        releaseKey(['xMove', 'xPrimeMove'])
    }
    else if (e.key === "y") {
        releaseKey(['yMove', 'yPrimeMove'])
    }
    else if (e.key === "z") {
        releaseKey(['zMove', 'zPrimeMove'])
    }
    else if (e.key === "q") {
        releaseKey(['undo'])
    }
}

// UNDO MOVES
const reverseMoveMap = {
    "U": uPrimeTurn, "U'": uTurn, "D": dPrimeTurn, "D'": dTurn, 
    "R": rPrimeTurn, "R'": rTurn, "L": lPrimeTurn, "L'": lTurn,
    "F": fPrimeTurn, "F'": fTurn, "B": bPrimeTurn, "B'": bTurn,
    "M": mPrimeTurn, "M'": mTurn, "S": sPrimeTurn, "S'": sTurn,
    "E": ePrimeTurn, "E'": eTurn, "x": xPrimeTurn, "x'": xTurn,
    "y": yPrimeTurn, "y'": yTurn, "z": zPrimeTurn, "z'": zTurn,
    "u": uWidePrimeTurn, "u'": uWideTurn, "d": dWidePrimeTurn, "d'": dWideTurn,
    "r": rWidePrimeTurn, "r'": rWideTurn, "l": lWidePrimeTurn, "l'": lWideTurn,
    "f": fWidePrimeTurn, "f'": fWideTurn, "b": bWidePrimeTurn, "b'": bWideTurn
};
function undoMove() {
    if (moveLog.length === 0) return;
    let lastTurn = moveLog.pop();
    if (!isRotation(lastTurn)) {
        undoNumMoves(2);
    }
    reverseMoveMap[lastTurn]();
    moveLog.pop();
}
function isRotation(move) {
    return (move == "x" || move == "x'" || move == "y" || move == "y'" || move == "z" || move == "z'")
}

// RESET CUBE
function resetCube() {
    cubies = [
        ['X', 'X', 'X', 'Y', 'Y', 'Y', 'X', 'X', 'X', 'X', 'X', 'X'],
        ['X', 'X', 'X', 'Y', 'Y', 'Y', 'X', 'X', 'X', 'X', 'X', 'X'],
        ['X', 'X', 'X', 'Y', 'Y', 'Y', 'X', 'X', 'X', 'X', 'X', 'X'],
        ['G', 'G', 'G', 'O', 'O', 'O', 'B', 'B', 'B', 'R', 'R', 'R'],
        ['G', 'G', 'G', 'O', 'O', 'O', 'B', 'B', 'B', 'R', 'R', 'R'],
        ['G', 'G', 'G', 'O', 'O', 'O', 'B', 'B', 'B', 'R', 'R', 'R'],
        ['X', 'X', 'X', 'W', 'W', 'W', 'X', 'X', 'X', 'X', 'X', 'X'],
        ['X', 'X', 'X', 'W', 'W', 'W', 'X', 'X', 'X', 'X', 'X', 'X'],
        ['X', 'X', 'X', 'W', 'W', 'W', 'X', 'X', 'X', 'X', 'X', 'X']
    ];
    updateStickerColors();
    moveLog.length = 0;
    solving = false;
    resetNumMoves();
    document.getElementById("instructions").innerHTML = "Hit Scramble to Start"
    clearInterval(timer);
    document.getElementById("seconds").innerHTML="00";
    document.getElementById("minutes").innerHTML="00";
}

// TIMER
let sec = 0;
function pad(val) { 
    return val > 9 ? val : "0" + val; 
}
let timer = setInterval( 
    function(){
        if(solving) {
            document.getElementById("seconds").innerHTML=pad(++sec%60);
            document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
        }
    }, 
    1000);
function startTimer() {
    clearInterval(timer);
    timer = setInterval( 
        function(){
            if(solving) {
                document.getElementById("seconds").innerHTML=pad(++sec%60);
                document.getElementById("minutes").innerHTML=pad(parseInt(sec/60,10));
            }
        }, 
        1000);
}

// SCRAMBLE CUBE (40 random moves)
let mapTurns = {
    0: uPrimeTurn, 1: uTurn, 2: dPrimeTurn, 3: dTurn, 
    4: rPrimeTurn, 5: rTurn, 6: lPrimeTurn, 7: lTurn,
    8: fPrimeTurn, 9: fTurn, 10: bPrimeTurn, 11: bTurn
};
function scrambleCube() {
    sec = 0;
    document.getElementById("seconds").innerHTML="00";
    document.getElementById("minutes").innerHTML="00";
    let i = 0;
    while (i < 40) {
        let x = Math.floor(12*Math.random());
        mapTurns[x]();
        moveLog.pop();
        i++;
    }
    moveLog.length = 0;
    solving = true;
    resetNumMoves();
    document.getElementById("instructions").innerHTML = "Turn cube with keyboard or click buttons."
    startTimer();
}

// CHECK IF CUBE IS SOLVED
function checkFace(i, j) {
    return (cubies[i][j] == cubies[i][j+1] && cubies[i][j] == cubies[i][j+2] &&
        cubies[i][j] == cubies[i+1][j] && cubies[i][j] == cubies[i+1][j+1] &&
        cubies[i][j] == cubies[i+1][j+2] && cubies[i][j] == cubies[i+2][j] &&
        cubies[i][j] == cubies[i+2][j+1] && cubies[i][j] == cubies[i+2][j+2]);
}
function isFaceSolved(face) {
    switch(face) {
        case "top":
            return (checkFace(0, 3));
        case "bottom":
            return (checkFace(6, 3));
        case "right":
            return (checkFace(3, 6));
        case "left":
            return (checkFace(3, 0));
        case "front":
            return (checkFace(3, 3));
        case "back":
            return (checkFace(3, 9));
        default:
            return false;
    }
}
function isCubeSolved() {
    return(isFaceSolved("top") && isFaceSolved("bottom") && isFaceSolved("right") && 
           isFaceSolved("left") && isFaceSolved("front") && isFaceSolved("back"))
}
function checkSolved() {
    if (isCubeSolved()) {
        if(solving) {
            document.getElementById("instructions").innerHTML = "Congrats! Hit scramble to play again."
        }
        solving = false;   
    }
}
