import { test, expect, describe, beforeEach } from 'vitest';
import { solvePuzzle, getCellsPossibleValues, fillCells, validateSolution, findNextEmptyCell  } from './sudoku';
import type { SudokuPuzzle } from './sudoku';

export let startState: SudokuPuzzle = [
    [7, 0, 0, 0, 0, 4, 0, 9, 0],
    [8, 0, 2, 9, 7, 3, 0, 0, 0],
    [9, 0, 1, 2, 0, 0, 3, 0, 0],
    [0, 0, 0, 0, 4, 9, 1, 5, 7],
    [0, 1, 3, 0, 5, 0, 9, 2, 0],
    [5, 7, 9, 1, 2, 0, 0, 0, 0],
    [0, 0, 7, 0, 0, 2, 6, 0, 3],
    [0, 0, 0, 0, 3, 8, 2, 0, 5],
    [0, 2, 0, 5, 0, 0, 0, 0, 0],
];

let solvedState: SudokuPuzzle = [
    [7, 3, 5, 6, 1, 4, 8, 9, 2],
    [8, 4, 2, 9, 7, 3, 5, 6, 1],
    [9, 6, 1, 2, 8, 5, 3, 7, 4],
    [2, 8, 6, 3, 4, 9, 1, 5, 7],
    [4, 1, 3, 8, 5, 7, 9, 2, 6],
    [5, 7, 9, 1, 2, 6, 4, 3, 8],
    [1, 5, 7, 4, 9, 2, 6, 8, 3],
    [6, 9, 4, 7, 3, 8, 2, 1, 5],
    [3, 2, 8, 5, 6, 1, 7, 4, 9],
]

beforeEach(() => {
    startState = [
        [7, 0, 0, 0, 0, 4, 0, 9, 0],
        [8, 0, 2, 9, 7, 3, 0, 0, 0],
        [9, 0, 1, 2, 0, 0, 3, 0, 0],
        [0, 0, 0, 0, 4, 9, 1, 5, 7],
        [0, 1, 3, 0, 5, 0, 9, 2, 0],
        [5, 7, 9, 1, 2, 0, 0, 0, 0],
        [0, 0, 7, 0, 0, 2, 6, 0, 3],
        [0, 0, 0, 0, 3, 8, 2, 0, 5],
        [0, 2, 0, 5, 0, 0, 0, 0, 0],
    ];

    solvedState = [
        [7, 3, 5, 6, 1, 4, 8, 9, 2],
        [8, 4, 2, 9, 7, 3, 5, 6, 1],
        [9, 6, 1, 2, 8, 5, 3, 7, 4],
        [2, 8, 6, 3, 4, 9, 1, 5, 7],
        [4, 1, 3, 8, 5, 7, 9, 2, 6],
        [5, 7, 9, 1, 2, 6, 4, 3, 8],
        [1, 5, 7, 4, 9, 2, 6, 8, 3],
        [6, 9, 4, 7, 3, 8, 2, 1, 5],
        [3, 2, 8, 5, 6, 1, 7, 4, 9],
    ]
})

test('can find next zero', () => {
    expect(findNextEmptyCell(startState)).toEqual([0, 1]);
})

test('can find possible values for a given cell', () => {
    expect(getCellsPossibleValues(startState, 0, 2)).toEqual([5, 6]);
    expect(getCellsPossibleValues(startState, 1, 4)).toEqual([]);
    expect(getCellsPossibleValues(startState, 7, 7)).toEqual([1,4,7])
})

test('Will return an already solved puzzle'), () => {
    expect(solvePuzzle(solvedState)).toEqual(solvedState);
}

describe('fillCells', () => {
    test('should not mutate the original puzzle', () => {
        const clonedState = JSON.parse(JSON.stringify(startState));
        fillCells(startState);
        expect(startState).toEqual(clonedState);
    });
    test('should fill cells with only one possible value', () => {
        const filledPuzzle = fillCells(startState, false);
        const specificRow = 5;
        const specificCol = 5;
        const specificValue = solvedState[specificRow][specificCol];

        expect(filledPuzzle[specificRow][specificCol]).toBe(specificValue);
    });
    test('should not fill a cell if it has more than one value'), () => {
        const filledPuzzle = fillCells(startState, false);
        const specificRow = 0;
        const specificCol = 1;

        expect(filledPuzzle[specificRow][specificCol]).toBe(0);
    };
});

test('will return an already solved puzzle', () => {
    const solvedPuzzle = solvePuzzle(solvedState);
    expect(solvedPuzzle).toEqual(solvedState);
})

test('can solve a puzzle', () => {
    const solvedPuzzle = solvePuzzle(startState);
    expect(solvedPuzzle).toEqual(solvedState);
})

test('can validate puzzle', () => {
    const solvedPuzzle = solvePuzzle(startState);
    if (solvedPuzzle === null) {
        throw new Error('Puzzle is not valid')
    }
    const isSolutionValid = validateSolution(startState, solvedPuzzle)
    expect(isSolutionValid).toBe(true);
})