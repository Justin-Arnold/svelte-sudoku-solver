import { clone } from './utils'
import type { 
    CellLocation,
    CellValue,
    PuzzleBoard,
    GridLocation,
    CellCoordinate
} from '../types/sudoku'

import { SolveMethod, GridLocations } from '../types/sudoku' 

/**
 *  These hooks are meant to visualize the solving process. They are not required for the solver to work.
 *  Each hook takes a callback where the arguments are the information about the step that is being taken.
 */
type SolvingEventHooks = {
    onFindEmptyCell?: (cell: CellLocation) => void,
    onCheckCell?: (cell: CellLocation) => void,
    onCellPossibilitiesCallback?: (cell: CellLocation, possibilities: CellValue<"">[]) => void,
    onFound?: (row: number, col: number, value: number) => void,
    onFindPossibleValuesForCell?: (cell: CellLocation, values: CellValue[]) => void
}

export class SudokuPuzzle {
    puzzle: PuzzleBoard
    private changeStack: {row: GridLocation, col: GridLocation, value: CellValue}[]
    private callbacks: SolvingEventHooks
    private solveMethod: SolveMethod

    constructor(
        puzzle: PuzzleBoard,
        eventHooks: SolvingEventHooks = {},
        solveMethod: SolveMethod = SolveMethod.PROPAGATION
    ) {
        this.puzzle = clone(puzzle)
        this.callbacks = eventHooks
        this.solveMethod = solveMethod
        this.changeStack = []
    }

    solvePuzzle(): boolean {
        this.fillCells()
        const squareToSolve = this.findNextEmptyCell()
        if (squareToSolve === null) {
            return true // Puzzle is solved
        }
        const [row, col] = squareToSolve
        const cellLocation = gridToSection({row, column: col})
        const possibleValues = this.getPossibleValuesForCell(cellLocation)
        for (const value of possibleValues) {
            const stackDepth = this.changeStack.length
            // Try this value
            this.setCell(row, col, value)
            // Recursively solve the rest
            if (this.solvePuzzle()) {
                return true // Solution found
            }
            // If we're here, this value didn't work. Undo all changes since this guess
            this.undoToDepth(stackDepth)
        }
        return false // No solution found
    }

    private fillCells() {
        let changed: boolean;
        do {
            changed = this.fillOneCellIfPossible();
        } while (changed);
    }

    private fillOneCellIfPossible(): boolean {
        for (const [row, column] of eachCellInPuzzle) {
            this.notifyCheckCell(row, column)
            if (this.fillCellIfEmpty({row, column})) {
                return true;
            }
        }
        return false;
    }

    private notifyCheckCell(row: GridLocation, col: GridLocation) {
        if (this.callbacks.onCheckCell) {
            const coordinates = gridToSection({row, column: col});
            this.callbacks.onCheckCell({
                section: coordinates.section,
                position: coordinates.position
            });
        }
    }
    
    private fillCellIfEmpty(cellLocation: CellCoordinate): boolean {
        const {row, column} = cellLocation 
        if (this.puzzle[row-1][column-1] !== 0) {
            return false;
        }
        const cellPosition = gridToSection({row, column})
        const possibleValues = this.getPossibleValuesForCell(cellPosition);
        if (possibleValues.length === 1) {
            this.setCell(row, column, possibleValues[0]);
            return true;  // We filled this cell
        }
        return false;  // We couldn't fill this cell
    }

    setCell(row: GridLocation, col:GridLocation, value: CellValue) {
        if (this.callbacks.onFound) {
            this.callbacks.onFound(row, col, value)
        }
        this.changeStack.push({row, col, value: this.puzzle[row-1][col-1]})
        this.puzzle[row-1][col-1] = value
        if (this.solveMethod === SolveMethod.PROPAGATION) {
            const cellLocation = gridToSection({row, column: col})
            this.checkImpactedSections(cellLocation)
        }
    }

    undoToDepth(depth: number) {
        while (this.changeStack.length > depth) {
            const change = this.changeStack.pop()!
            this.puzzle[change.row-1][change.col-1] = change.value
        }
    }

    getPossibleValuesForCell(cellLocation: CellLocation): CellValue[] {
        const coordinates = sectionToGrid(cellLocation)
        if (this.puzzle[coordinates.row-1][coordinates.column-1] !== 0) {
            return []
        }
        let vals = new Set<CellValue>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        for (let i = 0; i < 9; i++) {
            vals.delete(this.puzzle[coordinates.row-1][i])
            vals.delete(this.puzzle[i][coordinates.column-1])
        }
        const i = Math.floor(coordinates.row / 3) * 3
        const j = Math.floor(coordinates.column / 3) * 3
        for (let x = i; x < i + 3; x++) {
            for (let y = j; y < j + 3; y++) {
                vals.delete(this.puzzle[x][y])
            }
        }
        return [...vals]
    }

    findNextEmptyCell() {
        for (const [row, column] of eachCellInPuzzle) {
            if (this.puzzle[row-1][column-1] === 0) { 
                if (this.callbacks.onFindEmptyCell) {
                    const coordinates = gridToSection({row, column})
                    this.callbacks.onFindEmptyCell(coordinates)
                }
                return [row, column]
            }
        }
        return null
    }

    checkImpactedSections(cellLocation: CellLocation): void {
        this.checkAndFillRow(cellLocation)
        this.checkAndFillColumn(cellLocation)
        this.checkAndFillSection(cellLocation)
    }

    checkAndFillSection(coordinates: CellLocation) {
        for (const location of eachCellInSection(coordinates)) {
            if (this.callbacks.onCheckCell) {      
                this.callbacks.onCheckCell(location)
            }

            const result = this.checkAndFillCell(location)
            if (!!result) {
                this.checkImpactedSections(location)
            }
        }
    }

    checkAndFillRow(cellLocation: CellLocation) {
        const { row } = sectionToGrid(cellLocation)
        for (const column of eachCellInColumn) {
            const coordinates = gridToSection({row, column})
            if (this.callbacks.onCheckCell) {
                this.callbacks.onCheckCell({
                    section: coordinates.section,
                    position: coordinates.position
                })
            }
            const result = this.checkAndFillCell(cellLocation)
            if (!!result) {
                this.checkImpactedSections(coordinates)
            }
        }
    }

    checkAndFillColumn(cellLocation: CellLocation) {
        const { column } = sectionToGrid(cellLocation)
        for (const row of eachCellInRow) {
            const coordinates = gridToSection({row, column})
            if (this.callbacks.onCheckCell) {
                
                this.callbacks.onCheckCell({
                    section: coordinates.section,
                    position: coordinates.position
                })
            }
            const result = this.checkAndFillCell(cellLocation)
            if (!!result) {
                this.checkImpactedSections(coordinates)
            }
        }
    }

    checkAndFillCell(cellLocation: CellLocation): false | CellValue {
        const { row, column } = sectionToGrid(cellLocation)
        const cellToCheck = this.puzzle[row-1][column-1]
        if (cellToCheck !== 0) {
            return false
        }
        
        const possibleValues = this.getPossibleValuesForCell(cellLocation)
        if (possibleValues.length === 1) {
            this.setCell(row, column, possibleValues[0])
            return possibleValues[0]
        }
        return false
    }
}

export const examplePuzzles: Record<'easy' | 'medium' | 'hard', PuzzleBoard> = {
    easy: [
        [7, 3, 0, 0, 0, 4, 0, 9, 0],
        [8, 0, 2, 9, 7, 3, 0, 0, 0],
        [9, 0, 1, 2, 0, 0, 3, 0, 0],
        [0, 0, 0, 0, 4, 9, 1, 5, 7],
        [0, 1, 3, 0, 5, 0, 9, 2, 0],
        [5, 7, 9, 1, 2, 0, 0, 0, 0],
        [0, 0, 7, 0, 0, 2, 6, 0, 3],
        [0, 0, 0, 0, 3, 8, 2, 0, 5],
        [0, 2, 0, 5, 0, 0, 0, 0, 0],
    ],
    medium: [
        [5, 0, 0, 0, 3, 8, 0, 0, 9],
        [4, 0, 0, 0, 6, 0, 0, 0, 0],
        [0, 3, 0, 0, 0, 0, 6, 0, 0],
        [1, 0, 5, 6, 0, 9, 0, 0, 4],
        [0, 4, 0, 0, 0, 0, 0, 7, 0],
        [9, 0, 0, 3, 0, 7, 5, 0, 8],
        [0, 0, 4, 0, 0, 0, 0, 2, 0],
        [0, 0, 0, 0, 9, 0, 0, 0, 3],
        [6, 0, 0, 4, 7, 0, 0, 0, 1]
    ],
    hard: [
        [0, 0, 8, 0, 0, 6, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 9, 6],
        [0, 0, 3, 0, 1, 0, 0, 0, 8],
        [0, 5, 0, 2, 0, 0, 0, 1, 0],
        [0, 0, 0, 6, 0, 1, 0, 0, 0],
        [0, 4, 0, 0, 0, 9, 0, 7, 0],
        [5, 0, 0, 0, 8, 0, 9, 0, 0],
        [7, 9, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 9, 0, 0, 2, 0, 0]
    ]
}

function isGridLocation(num: number): num is GridLocation {
    return num >= 1 && num <= 9;
}

export function gridToSection(coordinate: { row: GridLocation; column: GridLocation }): CellLocation {
    const sectionRow = Math.floor((coordinate.row - 1) / 3);
    const sectionColumn = Math.floor((coordinate.column - 1) / 3);
    const sectionValue = sectionRow * 3 + sectionColumn + 1;
    if (!isGridLocation(sectionValue)) throw new Error(`Invalid section value: ${sectionValue}`);
    const section = sectionValue;

    const cellRow = (coordinate.row - 1) % 3;
    const cellColumn = (coordinate.column - 1) % 3;
    const cellValue = cellRow * 3 + cellColumn + 1;
    if (!isGridLocation(cellValue)) throw new Error(`Invalid cell value: ${cellValue}`);
    const position = cellValue;

    return { section, position };
}

export function sectionToGrid(cellLocation: CellLocation): CellCoordinate {
    const { section, position }  = cellLocation
    // Calculate the starting row and column of the section
     const sectionRowStart = Math.floor((section - 1) / 3) * 3;
     const sectionColumnStart = ((section - 1) % 3) * 3;
 
     // Calculate the row and column within the section
     const cellRowOffset = Math.floor((position - 1) / 3);
     const cellColumnOffset = (position - 1) % 3;
 
     // Calculate the absolute row and column in the grid
     const row = sectionRowStart + cellRowOffset + 1;
     const column = sectionColumnStart + cellColumnOffset + 1;
 
     return { row, column } as { row: GridLocation, column: GridLocation};
}


enum TypeOfIteration {
    IN_PUZZLE = 'in-puzzle',
    IN_SECTION = 'in-section',
    IN_ROW_COL = 'in-row-col'
}

const eachCellInPuzzle = {
    *[Symbol.iterator](): Generator<[GridLocation, GridLocation]> {
        for (const row of GridLocations) {
            for (const column of GridLocations) {
                yield [row, column];
            }
        }
    }
};

const eachCellInRow = {
    *[Symbol.iterator](): Generator<GridLocation> {
        for (const row of GridLocations) {
            yield row;
        }
    }
};

const eachCellInColumn = {
    *[Symbol.iterator](): Generator<GridLocation> {
        for (const col of GridLocations) {
            yield col;
        }
    }
};

const eachCellInSection = (location: CellLocation) => ({
    *[Symbol.iterator](): Generator<CellLocation> {

        const startRow = 3 * Math.floor((location.section - 1) / 3) + 1;;
        const startCol = 3 * (location.section % 3 || 3) - 2;

        for (let row = startRow; row < startRow + 3; row++) {
            for (let column = startCol; column < startCol +3; column++) {
                const location = gridToSection({
                    row, column
                } as {row: GridLocation, column: GridLocation})
                yield location;     
            }
        }
    }
});