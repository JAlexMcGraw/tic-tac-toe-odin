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
        // const isAvailable = boardData.filter((row) => row[col].getValue() === 0);
        // const isAvailable = boardData[row][col].getValue() === 0;
        // console.log(`isAvailable: ${isAvailable}`)
        // // console.log(`isAvailable Length: ${isAvailable.length}`)
        // if (isAvailable !== true) {
        //     console.log("Spot taken");
        //     return;
        // }

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


function gameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();
    const boardData = board.getBoard();
    let winner;
    let gameOver = winner === undefined ? false: true;

    const player = [
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

    const switchPlayer = () => {
        activePlayer = activePlayer === player[0] ? player[1]: player[0];
    }

    const getActivePlayer = () => activePlayer;

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
                console.log(`${player.name} has won!`)
                winner = player.name;
            }
        }

    }

    const checkIfTied = () => {
        const noneEqualZero = (arr) => arr.every(v => v !== 0)
        
        flattenedArray = boardData.flat(2);
        flattenedValues = flattenedArray.map((cell) => cell.getValue());
        console.log(`flattened array: ${flattenedValues}`)
        if (noneEqualZero(flattenedValues)) {
            console.log("No more spaces to play!")
            winner = "Tied";
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
            checkIfWinner();
            checkIfTied();
            switchPlayer();
            printNewRound();
        } else {
            console.log(`Choose a different spot. (${row}, ${col}) is taken.`)
            console.log(`It is still ${getActivePlayer().name}'s turn`)
        }
        
    } 
    return {playRound, getActivePlayer}
}

const game = gameController();