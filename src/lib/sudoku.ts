export namespace Sudoku {
    export type CellValue<BlankValue = 0> = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | BlankValue;
}

export type SudokuRow = [Sudoku.CellValue, Sudoku.CellValue, Sudoku.CellValue, Sudoku.CellValue, Sudoku.CellValue, Sudoku.CellValue, Sudoku.CellValue, Sudoku.CellValue, Sudoku.CellValue];
export type SudokuPuzzle = [SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow, SudokuRow];




export function getCellPossibleValues(
    puzzle: SudokuPuzzle,
    row: number,
    column: number
){
    if (puzzle[row][column] !== 0) {
        return []
    }

    let vals = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

    for (let i = 0; i < 9; i++) {
        vals.delete(puzzle[row][i])
        vals.delete(puzzle[i][column])
    }

    const i = Math.floor(row / 3) * 3
    const j = Math.floor(column / 3) * 3

    for (let x = i; x < i + 3; x++) {
        for (let y = j; y < j + 3; y++) {
            vals.delete(puzzle[x][y])
        }
    }

    return [...vals]
}

export function getPossibilities(puzzle: SudokuPuzzle) {
    let possibilities = Array.from({ length: 9 }, () => Array(9).fill(0))

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            possibilities[row][col] = getCellPossibleValues(puzzle, row, col)
        }
    }

    return possibilities
}

export async function solvePuzzle(
    puzzle: SudokuPuzzle,
    onCellCheckCallback: (row: number, col: number) => void,
    onCellPossibilitiesCallback: (row: number, col: number) => void,
    onFoundCallback: (row: number, col: number, value: number) => void
): Promise<SudokuPuzzle | null> {


    const squareToSolve = await findNextZero(puzzle, onCellCheckCallback)

    if (squareToSolve === null) {
        return puzzle
    }


    const possibleValues = getCellPossibleValues(puzzle, squareToSolve[0], squareToSolve[1])


    for (let i = 0; i < possibleValues.length; i++) {
        let newPuzzleState = JSON.parse(JSON.stringify(puzzle))
        newPuzzleState[squareToSolve[0]][squareToSolve[1]] = possibleValues[i] as PossibleValue
        const filledCells = await fillCells(
            newPuzzleState,
            onCellPossibilitiesCallback,
            onFoundCallback,
        )
        let result = solvePuzzle(
            filledCells,
            onCellCheckCallback,
            onCellPossibilitiesCallback,
            onFoundCallback
        )
        if (result !== null) {
            return result
        }
    }

    return null
}


export async function findNextZero(puzzle: SudokuPuzzle, onSquareCheck: (row: number, col: number) => void) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            onSquareCheck(row, col);
            if (puzzle[row][col] === 0) {
                return [row, col]
            }
        }
    }
    return null
}

export async function fillCells(
    puzzle: SudokuPuzzle,
    callback: (row:number, col:number) => void,
    callback2: (row:number, col:number, value: number) => void,
    loop = true
) {
    const clonedPuzzle = JSON.parse(JSON.stringify(puzzle));
    console.log('filling')
    while (true) {
        let found = false;

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                callback(i, j);
                await new Promise(resolve => setTimeout(resolve, 5));
                if (clonedPuzzle[i][j] !== 0) {
                    continue;
                }

                const possibleValues = getCellPossibleValues(clonedPuzzle, i, j);

                if (possibleValues.length === 1) {
                    clonedPuzzle[i][j] = possibleValues.pop();
                    callback2(i, j, clonedPuzzle[i][j]);
                    found = true;
                    break
                }
            }
            if (found) {
                break
            }
        }

        if (!found || !loop) {
            break;
        }
    }

    return clonedPuzzle;
}

export function validateSolution(initialPuzzle: SudokuPuzzle, solvedPuzzle: SudokuPuzzle) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (initialPuzzle[i][j] !== 0 && initialPuzzle[i][j] !== solvedPuzzle[i][j]) {
                return false;
            }
        }
    }

    for(let n = 0; n < 9; n++) {
        if (new Set(solvedPuzzle[n]).size !== 9) {
            return false;
        }
        if (new Set(solvedPuzzle.map(row => row[n])).size !== 9) {
            return false;
        }
        const square = new Set();
        const x = Math.floor(n / 3) * 3;
        for (let i = x; i < x + 3; i++) {
            for (let j = x; j < x + 3; j++) {
                square.add(solvedPuzzle[i][j]);
            }
        }
        if (square.size !== 9) {
            return false;
        }
    }

    return true;
}
