type FixedLengthArray<T, L extends number> = [T, ...T[]] & { length: L };
export type GridLocation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export const GridLocations = [1,2,3,4,5,6,7,8,9] as const

export enum SolveMethod {
    BACKTRACK = 'backtracking',
    PROPAGATION = 'propagation'
}

export type PuzzleBoard = [Row2D, Row2D, Row2D, Row2D, Row2D, Row2D, Row2D, Row2D, Row2D];
export type CellValue<BlankValue = 0> = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | BlankValue;
/** a section based representation of the cells location */
export type CellLocation = {
    section: GridLocation,
    position: GridLocation,
};

/** an XY based representation of the cells location */
export type CellCoordinate = {
    row: GridLocation;
    column: GridLocation
}

export type Coordinate = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8


export type Row2D = [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue];
export type Section2D = FixedLengthArray<CellValue, 9>

