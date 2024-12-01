function Gameboard() {
    const rows = 3;
    const cols = 3;
    const boardData = [];

    for (let i = 0; i < rows; i++) {
        boardData[i] = [];
        for (let j = 0; j < cols; j++) {
            boardData[i].push(Cell());
        }
    }

    const getBoard = () => boardData;

    const placeMark = (row, col, player) => {
        boardData[row][col].addToken(player.token);
        console.log(`boarddata info: ${boardData[row][col].getValue()}`)
    }

    const printBoard = () => {
        const currentBoard = boardData.map((row) => row.map((cell) =>
        cell.getValue()))

        console.log(currentBoard);
    }

    return {getBoard, placeMark, printBoard}
}

function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {addToken, getValue}
}


function gameController() {
    const board = Gameboard();
    let playerOneName;
    let playerTwoName;
    const boardData = board.getBoard();
    const flattenedBoardArray = boardData.flat(2);
    const flattenedValues = flattenedBoardArray.map((cell) => cell.getValue());
    let winner;
    let gameOver = winner === undefined ? false: true;
    let playerTurnHeader = document.getElementById("player-turn");

    const modal = document.getElementById("modal");
    const startGameButton = document.getElementById("startGameButton");
    const playerNameInputOne = document.getElementById("playerNameOne");
    const playerNameInputTwo = document.getElementById("playerNameTwo");

    window.onload = () => {
        modal.style.display = 'flex';
    }

    startGameButton.addEventListener('click', () => {
        console.log(`player one: ${playerNameInputOne.value.trim()}\nplayer two: ${playerNameInputTwo.value.trim()}`)
        playerOneName = playerNameInputOne.value.trim();
        playerTwoName = playerNameInputTwo.value.trim();
        if ((playerOneName) && (playerTwoName)) {
            updatePlayerNames(playerOneName, playerTwoName)
            modal.style.display = 'none';
        }
    })

    let player = [
        {
            name: playerOneName,
            token: 1
        },
        {
            name: playerTwoName,
            token: 2
        }
    ]

    const winningOrders = [
        [
            [0, 0], [0, 1], [0,2]
        ],
        [
            [1, 0], [1, 1], [1, 2]
        ],
        [
            [2,0], [2,1], [2,2]
        ],
        [
            [0, 0], [1, 0], [2, 0]
        ],
        [
            [0, 1], [1, 1], [2, 1]
        ],
        [
            [0, 2], [1, 2], [2, 2]
        ],
        [
            [0, 0], [1,1], [2, 2]
        ],
        [
            [0, 2], [1, 1], [2, 0]
        ]
    ]

    let activePlayer = player[0];

    function updatePlayerNames(name1, name2) {
        player[0].name = name1;
        player[1].name = name2;
    }

    const switchPlayer = () => {
        activePlayer = activePlayer === player[0] ? player[1]: player[0];
    }

    const getActivePlayer = () => activePlayer;

    const displayBoard = () => {
        for (cellVal in flattenedValues) {
            cell = document.getElementById(`cell${cellVal}`);
            cellValue = flattenedBoardArray[cellVal].getValue()
            console.log(`flattened cell: ${cellValue}`);
            if ((cellValue === 1) && (cell.innerHTML === "")) {
                console.log(`placing X`);
                cell.innerHTML += "X";
            } else if ((cellValue === 2) & (cell.innerHTML === "")) {
                console.log(`placing O`);
                cell.innerHTML += "O";
            }
        }
    }

    const printNewRound = () => {
        board.printBoard();

        if (winner === undefined) {
            console.log(`${getActivePlayer().name}'s turn`);
        } else {
            console.log(`Game Over. Restart!`);
        }
    }

    const checkIfWinner = () => {
        const player = getActivePlayer();

        const allEqual = (arr) => arr.every(v => v === player.token)
        
        for (row in winningOrders) {
            rowValues = winningOrders[row]
            firstVal = boardData[rowValues[0][0]][rowValues[0][1]].getValue()
            secondVal = boardData[rowValues[1][0]][rowValues[1][1]].getValue()
            thirdVal = boardData[rowValues[2][0]][rowValues[2][1]].getValue()
            if (allEqual([firstVal, secondVal, thirdVal])) {
                winner = player.name;
                playerTurnHeader.innerHTML = `${winner} has won!`
                console.log(`${winner} has won!`)
            }
        }

    }

    const checkIfTied = () => {
        // This is in case that there is a winner in the last cell, it doesn't show tied
        if (winner !== undefined) return;

        const noneEqualZero = (arr) => arr.every(v => v !== 0)
        
        console.log(`flattened array: ${flattenedValues}`)
        if (noneEqualZero(flattenedValues)) {
            console.log("No more spaces to play!")
            winner = "Tied";
            playerTurnHeader.innerHTML = winner;
        }

    }

    const checkIfAvailable = (row, col) => {
        const isAvailable = board.getBoard()[row][col].getValue() === 0;
        if (isAvailable === true) {
            console.log(`Spot (${row}, ${col}) is available`);
        } else {
            console.log(`Spot (${row}, ${col}) is not available`)
        }
        return isAvailable
    }

    const playRound = (row, col) => {
        if (checkIfAvailable(row, col) === true) {
            console.log(`${getActivePlayer().name} placed at (${row}, ${col})`);
            board.placeMark(row, col, getActivePlayer());
            displayBoard();
            checkIfWinner();
            checkIfTied();
            if (gameOver === false) {
                switchPlayer();
                printNewRound();
            } else {
                console.log("Game over!")
            }
        } else {
            console.log(`Choose a different spot. (${row}, ${col}) is taken.`)
            console.log(`It is still ${getActivePlayer().name}'s turn`)
        }
        
    } 

    for (cellVal in flattenedValues) {
        const div = document.getElementById(`cell${cellVal}`);
        const location = div.classList[1]
        const parts = location.replace(/[()]/g, '').split(',');
        const numbers = parts.map(Number);

        console.log(`location: ${numbers}`)
        
        div.addEventListener('click', function () {
            playRound(numbers[0], numbers[1])
        })
    }
    return {playRound, getActivePlayer}
}

const game = gameController();