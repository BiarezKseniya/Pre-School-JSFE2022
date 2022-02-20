let origBoard;
const huPlayer = 'X';
const aiPlayer = '0';
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

const cells = document.querySelectorAll('.cell');
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
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, huPlayer);
        setTimeout(() => {
            if (!gameEnd && !checkTie()) turn(bestSpot(), aiPlayer);
        }, 100);
    }
}

function turn(squareId, player) {
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
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').textContent = who;
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    //return minimax(origBoard, aiPlayer).index
    return myAI();
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
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
    if(player === aiPlayer) {
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
    if(isEmpty(4)) {
        return 4;
    }

    winCombos.forEach((combination) => {
        
    });
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