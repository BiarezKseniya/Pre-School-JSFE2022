let origBoard;
const huPlayer = 'X';
const aiPlayer = 'O';
let currTurn = huPlayer;
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
];
let gameEnd = null;
let history = [];
let bestScore = 0;
let currentScore = 0;



const oSound1 = new Audio();
oSound1.preload = 'auto';
oSound1.src = './assets/cross.mp3';
const oSound2 = new Audio();
oSound2.preload = 'auto';
oSound2.src = './assets/zero.mp3';



const cells = document.querySelectorAll('.cell');

window.addEventListener('beforeunload', saveStorage);
window.addEventListener('load', readStorage);


startGame();

function startGame() {
    gameEnd = null;
    document.querySelector('.endgame').style.display = 'none';
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }

    currTurn = huPlayer;

    drawHistory();
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number' && currTurn === huPlayer) {
        turn(square.target.id, huPlayer);
        setTimeout(() => {
            if (!gameEnd && !checkTie()) turn(bestSpot(), aiPlayer);
        }, 500);
    }
}

function turn(squareId, player) {
    if (player === 'X') {
        oSound1.play();
    } else {
        oSound2.play();
    }

    if (player === aiPlayer) {
        currTurn = huPlayer;
    } else {
        currTurn = aiPlayer;
    }

    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    checkWin(origBoard, player);
    if (gameEnd) gameOver(gameEnd);
}

function checkWin(board, player) {
    let plays = board.reduce(
        (acc, currValue, index) => {
            return (currValue === player) ? acc.concat(index) : acc
        },
        []
    );

    gameEnd = null;

    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameEnd = {
                index: index,
                player: player
            };
            break;
        }
    }
    return gameEnd;
}

function gameOver(gameEnd) {
    for (let index of winCombos[gameEnd.index]) {
        document.getElementById(index).style.backgroundColor =
            gameEnd.player == huPlayer ? 'blue' : 'orange';
    }

    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }

    declareWinner(gameEnd.player == huPlayer ? 'You win!' : 'You lose!');
}

function declareWinner(who) {
    document.querySelector('.endgame').style.display = 'flex';
    document.querySelector('.endgame .text').textContent = who;

    addHistory(gameEnd.player, gameEnd.index);
    drawHistory();
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    //return minimax(origBoard, aiPlayer).index
    return myAI();
    //return emptySquares()[0];
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        gameEnd = {
            index: null,
            player: null
        };
        declareWinner('Tie Game!');
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    const availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, player)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 20 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;
        if (player == aiPlayer) {
            let result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move)
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function myAI() {
    if (isEmpty(4)) {
        return 4;
    }

    for (let i = 0; i < winCombos.length; i++) {
        let combination = winCombos[i];
        let step = null;
        let score = 0;
        combination.forEach((index) => {
            if (isAiPlayer(index)) score++;
            if (isEmpty(index)) step = index;
        });
        if (score === 2 && step !== null) {
            return step;
        }
    }

    for (let i = 0; i < winCombos.length; i++) {
        let combination = winCombos[i];
        let step = null;
        let score = 0;
        combination.forEach((index) => {
            if (isHuPlayer(index)) score++;
            if (isEmpty(index)) step = index;
        });
        if (score === 2 && step !== null) {
            return step;
        }
    }

    let posStep = emptySquares();
    return posStep[getRandomInt(posStep.length)];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function isEmpty(index) {
    return typeof origBoard[index] == "number";
}

function isAiPlayer(index) {
    return origBoard[index] === aiPlayer;
}

function isHuPlayer(index) {
    return origBoard[index] === huPlayer;
}



function addHistory(winner, winIndex) {
    let date = new Date();
    const sTime = date.getHours() + ":" + date.getMinutes() + " " + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
    const frame = {
        time: sTime,
        winner: winner,
        winComb: winCombos[winIndex] ? winCombos[winIndex] : ""
    };

    history.unshift(frame);
    if (history.length > 10) {
        history.splice(10);
    }

    switch (winner) {
        case huPlayer:
            currentScore++;
            break;

        case aiPlayer:
            if (currentScore > bestScore) {
                bestScore = currentScore;
            }
            currentScore = 0;
            break;
    }
}

function readStorage() {
    let lsHistoy = localStorage.getItem('history');
    history = lsHistoy ? JSON.parse(lsHistoy) : [];
    let lsBest = localStorage.getItem('bestScore');
    bestScore = lsBest ? lsBest : 0;
    let lsCurr = localStorage.getItem('currentScore');
    currentScore = lsCurr ? lsCurr : 0;
    drawHistory();
}

function saveStorage() {
    localStorage.setItem('history', JSON.stringify(history));
    localStorage.setItem('bestScore', bestScore);
    localStorage.setItem('currentScore', currentScore);

}

function drawHistory() {
    const historyContainer = document.getElementById("history");
    historyContainer.innerHTML = '';

    let scoreRow = document.createElement("tr");
    let cell = document.createElement("td");
    cell.setAttribute('colspan', 3);
    cell.innerHTML = "Current Score: " + currentScore;
    scoreRow.appendChild(cell);
    historyContainer.appendChild(scoreRow);

    scoreRow = document.createElement("tr");
    cell = document.createElement("td");
    cell.setAttribute('colspan', 3);
    cell.innerHTML = "Best Score: " + bestScore;;
    scoreRow.appendChild(cell);
    historyContainer.appendChild(scoreRow);

    // cell = document.createElement("td");
    // scoreRow.appendChild(cell);

    // cell = document.createElement("td");
    // cell.innerHTML = "Best Score: " + bestScore;
    // scoreRow.appendChild(cell);
    // historyContainer.appendChild(scoreRow);

    if (history.length === 0) {
        const row = document.createElement("tr");
        const msg = document.createElement("td");
        msg.setAttribute('colspan', 3);
        msg.innerHTML = "You never played before :)";
        row.appendChild(msg);
        historyContainer.appendChild(row);
    } else {
        history.forEach((frame) => {
            const row = document.createElement("tr");
            const time = document.createElement("td");
            time.innerHTML = frame.time;
            row.appendChild(time);

            const winner = document.createElement("td");
            winner.innerHTML = !frame.winner ? "Tie Game!" : frame.winner === huPlayer ? "Player won" : "AI won";
            row.appendChild(winner);

            const winComb = document.createElement("td");
            winComb.innerHTML = frame.winComb;
            row.appendChild(winComb);

            historyContainer.appendChild(row);
        });
    }
}