(() => {
    const ticTacToeBoard = ((playerOneSymbol, playerTwoSymbol) => {
        const Symbols = {
            PLAYER_1: playerOneSymbol,
            PLAYER_2: playerTwoSymbol,
            EMPTY: ''
        };

        let board = [[Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY],
                    [Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY],
                    [Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY]];
        let currentTurn = Symbols.PLAYER_1;

        const switchPlayerTurn = () => {
            if (currentTurn === Symbols.PLAYER_1) {
                currentTurn = Symbols.PLAYER_2;
            } else {
                currentTurn = Symbols.PLAYER_1;
            }
        };

        const playTurn = (row, column) => {
            const isCellEmpty = board.at(row).at(column) === Symbols.EMPTY;
            const isGameRunning = !checkGameState().isGameOver;
            if (isCellEmpty && isGameRunning) {
                board[row][column] = currentTurn;
                switchPlayerTurn();
                return true;
            } else {
                return false;
            }
        };

        const isBoardFull = () => {
            return board.every((row) => row.every((cell) => cell !== Symbols.EMPTY));
        };

        const checkGameState = () => {
            let winner = Symbols.EMPTY;
            for (let i = 0; i < 3; ++i) {
                const firstInRow = board[i][0];
                if (firstInRow === Symbols.EMPTY) {
                    continue;
                }
                if (board[i].every((cell) => cell === firstInRow)) {
                    winner = firstInRow;
                    break;
                }
            }

            for (let i = 0; i < 3; ++i) {
                const firstInColumn = board[0][i];
                let columnWin = true;
                if (firstInColumn === Symbols.EMPTY) {
                    continue;
                }

                for (let j = 0; j < 3; ++j) {
                    columnWin = columnWin && board[j][i] === firstInColumn;
                }
                if (columnWin) {
                    winner = firstInColumn;
                    break;
                }
            }

            // Both diagonals share the middle spot in common
            const diagonalOccupant = board[1][1];
            let diagonalWin = false;
            
            if (diagonalOccupant !== Symbols.EMPTY) {
                let leftDiagonalWin = true;
                let rightDiagonalWin = true;
                for (let i = 0; i < 3; ++i) {
                    leftDiagonalWin = leftDiagonalWin && board[i][i] === diagonalOccupant;
                    rightDiagonalWin = rightDiagonalWin && board[i][2 - i] === diagonalOccupant;
                }
                diagonalWin = leftDiagonalWin || rightDiagonalWin;
            }

            if (diagonalWin) {
                winner = diagonalOccupant;
            }

            if (winner !== Symbols.EMPTY) {
                return { isGameOver: true, winner };
            } else if (isBoardFull()) {
                return { isGameOver: true, winner: Symbols.EMPTY };
            } else {
                return { isGameOver: false, winner: Symbols.EMPTY };
            }
        };

        const clearBoard = () => {
            board.map((row) => [Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY]);
        };

        return { playTurn, checkGameState, clearBoard };
    })('X', 'O');
})();