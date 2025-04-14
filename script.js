(() => {
    const ticTacToeBoardModel = ((playerOneSymbol, playerTwoSymbol) => {
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
            board.forEach((row, i) => row.forEach((col, j) => board[i][j] = Symbols.EMPTY));
        };

        const getCurrentTurn = () => {
            return currentTurn;
        }

        const getCellAt = (row, column) => {
            return board.at(row).at(column);
        }

        return { playTurn, getCurrentTurn, checkGameState, clearBoard, getCellAt, Symbols };
    })('X', 'O');

    const ticTacToeBoardView = ((document, model) => {
        const boardElement = document.querySelector(".game-view");
        const boardCellElements = boardElement.querySelectorAll(".game-view__board button");
        const messageElement = boardElement.querySelector(".game-view__state-message");
        const playAgainButtonElement = boardElement.querySelector(".game-view__play-again");

        const render = () => {
            const { isGameOver, winner } = model.checkGameState();

            const renderMessage = (isGameOver, winner) => {
                if (!isGameOver) {
                    messageElement.textContent = `${model.getCurrentTurn()}'s turn`;
                } else if (winner === model.Symbols.EMPTY) {
                    messageElement.textContent = `Game Tie`;
                } else {
                    messageElement.textContent = `${winner} wins!`;
                }
            };
    
            const renderBoardButtons = () => {
                boardCellElements.forEach((cellElement, index) => {
                    const row = Math.floor(index / 3);
                    const column = index % 3;
                    cellElement.textContent = model.getCellAt(row, column);
                });
            };

            const renderPlayAgainButton = (isGameOver) => {
                if (!isGameOver) {
                    playAgainButtonElement.classList.add("game-view__play-again_hidden");
                } else {
                    playAgainButtonElement.classList.remove("game-view__play-again_hidden");
                }
            };

            renderMessage(isGameOver, winner);
            renderBoardButtons();
            renderPlayAgainButton(isGameOver);
        };

        boardCellElements.forEach((cellElement, index) => {
            const row = Math.floor(index / 3);
            const column = index % 3;
            cellElement.addEventListener("click", (event) => {
                model.playTurn(row, column);
                render();
            });
        });

        playAgainButtonElement.addEventListener("click", (event) => {
            model.clearBoard();
            render();
        });

        render();

        return {};
    })(document, ticTacToeBoardModel);
})();