import { clone } from './utils'

type FixedLengthArray<T, L extends number> = [T, ...T[]] & { length: L };
type GridLocation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export namespace Sudoku {
    export type GridLocation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    export type Coordinate = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
    export type CellValue<BlankValue = 0> = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | BlankValue;
    export type CellLocation = {
        section: SectionLocation,
        position: GridLocation,
    }
    export type Row2D = [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue];
    export type RowLocation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    export type ColumnLocation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    export type Section2D = FixedLengthArray<CellValue, 9>
    export type SectionLocation = GridLocation
    export type Puzzle2D = [Row2D, Row2D, Row2D, Row2D, Row2D, Row2D, Row2D, Row2D, Row2D];
}

/**
 *  These hooks are meant to visualize the solving process. They are not required for the solver to work.
 *  Each hook takes a callback where the arguments are the information about the step that is being taken.
 */
type SolvingEventHooks = {
    findingNextEmptyCell: (cell: Sudoku.CellLocation) => void,
    onCellPossibilitiesCallback: (cell: Sudoku.CellLocation, possibilities: Sudoku.CellValue<"">[]) => void,
    onFoundCallback: (row: number, col: number, value: number) => void,
    onFindPossibleValuesForCell: (cell: Sudoku.CellLocation, values: Sudoku.CellValue[]) => void
}

export class SudokuPuzzle {
    puzzle: Sudoku.Puzzle2D
    changeStack: {row: number, col: number, value: number}[]

    constructor(puzzle: Sudoku.Puzzle2D) {
        this.puzzle = clone(puzzle)
        this.changeStack = []
    }

    solvePuzzle(): boolean {
        this.fillCells()
        const squareToSolve = this.findNextEmptyCell()

        if (squareToSolve === null) {
            return true // Puzzle is solved
        }

        const [row, col] = squareToSolve
        const possibleValues = this.getPossibleValuesForCell(row, col)

        for (const value of possibleValues) {
            const stackDepth = this.changeStack.length
            
            // Try this value
            this.setCell(row, col, value as PossibleValue)

            // Recursively solve the rest
            if (this.solvePuzzle()) {
                return true // Solution found
            }

            // If we're here, this value didn't work. Undo all changes since this guess
            this.undoToDepth(stackDepth)
        }

        return false // No solution found
    }

    fillCells() {
        let changed = true;
        while (changed) {
            changed = false;
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (this.puzzle[row][col] === 0) {
                        const possibleValues = this.getPossibleValuesForCell(row, col);
                        if (possibleValues.length === 1) {
                            this.setCell(row, col, possibleValues[0] as PossibleValue);
                            changed = true;
                        }
                    }
                }
            }
        }
    }

    setCell(row: number, col: number, value: PossibleValue) {
        this.changeStack.push({row, col, value: this.puzzle[row][col]})
        this.puzzle[row][col] = value
        this.checkImpactedSections({row, column: col})
    }

    undoToDepth(depth: number) {
        while (this.changeStack.length > depth) {
            const change = this.changeStack.pop()!
            this.puzzle[change.row][change.col] = change.value
        }
    }

    getPossibleValuesForCell(
        row: Sudoku.Coordinate,
        column: Sudoku.Coordinate
    ): Sudoku.CellValue[] {
        if (this.puzzle[row][column] !== 0) {
            return []
        }
    
        let vals = new Set<Sudoku.CellValue>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    
        for (let i = 0; i < 9; i++) {
            vals.delete(this.puzzle[row][i])
            vals.delete(this.puzzle[i][column])
        }
    
        const i = Math.floor(row / 3) * 3
        const j = Math.floor(column / 3) * 3
    
        for (let x = i; x < i + 3; x++) {
            for (let y = j; y < j + 3; y++) {
                vals.delete(this.puzzle[x][y])
            }
        }
    
        return [...vals]
    }

    findNextEmptyCell() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.puzzle[row][col] === 0) {    
                    return [row, col] as [Sudoku.Coordinate, Sudoku.Coordinate]
                }
            }
        }
        return null
    }

    checkImpactedSections(solvedCellLocation: {row: Sudoku.RowLocation, column: Sudoku.ColumnLocation}) {
        this.checkAndFillRow(solvedCellLocation.row)
        this.checkAndFillColumn(solvedCellLocation.column)
        this.checkAndFillSection(solvedCellLocation)
    }

    checkAndFillSection(location: {row: Sudoku.RowLocation, column: Sudoku.ColumnLocation}) {
        const row = Math.floor(location.row / 3) * 3 as GridLocation
        const column = Math.floor(location.column / 3) * 3 as GridLocation

        for (let x = row; x < row + 3; x++) {
            for (let y = column; y < column + 3; y++) {
                const result = this.checkAndFillCell(x, y)
                if (!!result) {
                    this.checkImpactedSections({
                        row: x,
                        column: y
                    })
                }
            }
        }
    }

    checkAndFillRow(row: Sudoku.RowLocation) {
        for (let column = 0; column < 9; column++) {
            const result = this.checkAndFillCell(row, column)
            if (!!result) {
                this.checkImpactedSections({
                    row,
                    column
                })
            }
        }
    }

    checkAndFillColumn(column: Sudoku.ColumnLocation) {
        for (let row = 0; row < 9; row++) {
            const result = this.checkAndFillCell(row, column)
            if (!!result) {
                this.checkImpactedSections({
                    row,
                    column
                })
            }
        }
    }

    private checkAndFillCell(row: Sudoku.GridLocation, column: Sudoku.GridLocation): false | {row: Sudoku.RowLocation, column: Sudoku.ColumnLocation} {
        const cellToCheck = this.puzzle[row][column]
        if (cellToCheck !== 0) {
            return false
        }
        
        const possibleValues = this.getPossibleValuesForCell(row, column)
        if (possibleValues.length === 1) {
            this.setCell(row, column, possibleValues[0] as PossibleValue)
            return {
                row: row as Sudoku.RowLocation,
                column: column as Sudoku.ColumnLocation
            }
        }
        return false
    }

}