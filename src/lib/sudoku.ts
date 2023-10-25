type FixedLengthArray<T, L extends number> = [T, ...T[]] & { length: L };
type GridLocation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export namespace Sudoku {
    export type GridLocation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    export type CellValue<BlankValue = 0> = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | BlankValue;
    export type CellLocation = {
        section: SectionLocation,
        position: GridLocation,
    }
    export type Row2D = [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue];
    export type Section2D = FixedLengthArray<CellValue, 9>
    export type SectionLocation = GridLocation
    export type Puzzle2D = [Row2D, Row2D, Row2D, Row2D, Row2D, Row2D, Row2D, Row2D, Row2D];
}

/**
 *  These hooks are meant to visualize the solving process. They are not required for the solver to work.
 *  Each hook takes a callback where the arguments are the information about the step that is being taken.
 */
type SolvingEventHooks = {
    findingNextEmptyCell?: (cell: Sudoku.CellLocation) => void,
    onCellPossibilitiesCallback: (row: number, col: number) => void,
    onFoundCallback: (row: number, col: number, value: number) => void,
    onFindPossibleValuesForCell: (cell: Sudoku.CellLocation, values: number[]) => void
}

export function getCellsPossibleValues(
    puzzle: Sudoku.Puzzle2D,
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
    puzzle: Sudoku.Puzzle2D,
    visualizerCallbacks: SolvingEventHooks = {
        findingNextEmptyCell: cell => void 0,
        onCellPossibilitiesCallback: () => {},
        onFoundCallback: () => {},
        onFindPossibleValuesForCell: () => {}
    },
    options: {
        delay: number
    } = {
        delay: 5
    }
): Promise<Sudoku.Puzzle2D | null> {

    const squareToSolve = await findNextEmptyCell(puzzle, visualizerCallbacks.findingNextEmptyCell, options.delay)

    if (squareToSolve === null) {
        return puzzle
    }


    const possibleValues = getCellsPossibleValues(puzzle, squareToSolve[0], squareToSolve[1])
    visualizerCallbacks.onFindPossibleValuesForCell({section: 1, position: 3}, possibleValues) //! TODO: fix this - hard coded location for cell


    for (let i = 0; i < possibleValues.length; i++) {
        let newPuzzleState = JSON.parse(JSON.stringify(puzzle))
        newPuzzleState[squareToSolve[0]][squareToSolve[1]] = possibleValues[i] as PossibleValue

        const filledCells = await fillCells(
            newPuzzleState,
            visualizerCallbacks.onCellPossibilitiesCallback,
            visualizerCallbacks.onFoundCallback,
            options.delay
        )
        let result = solvePuzzle(
            filledCells,
            visualizerCallbacks,
            options
        )
        if (result !== null) {
            return result
        }
    }

    return null
}


export async function findNextEmptyCell(puzzle: SudokuPuzzle2D, onSquareCheck: (cell: Sudoku.CellLocation) => void, delay: number = 5) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (delay > 0) {
                console.log('finding with delay', delay)
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            onSquareCheck({
                section: Math.floor(row / 3) * 3 + Math.floor(col / 3) + 1 as Sudoku.SectionLocation,
                position: (row % 3) * 3 + col % 3 + 1 as Sudoku.GridLocation
            });
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
    delay: number,
    loop = true,

) {
    const clonedPuzzle = JSON.parse(JSON.stringify(puzzle));
    console.log('filling')
    while (true) {
        let found = false;

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                callback(i, j);
                console.log('filling with delay', delay)
                if (delay > 0) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                if (clonedPuzzle[i][j] !== 0) {
                    continue;
                }

                const possibleValues = getCellsPossibleValues(clonedPuzzle, i, j);

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
