import { test, expect, beforeEach } from 'vitest';
import { Sudoku, SudokuPuzzle } from './sudoku';

let easyStartState: Sudoku.Puzzle2D = [
    [7, 0, 0, 0, 0, 4, 0, 9, 0],
    [8, 0, 2, 9, 7, 3, 0, 0, 0],
    [9, 0, 1, 2, 0, 5, 3, 0, 0],
    [0, 0, 0, 0, 4, 9, 1, 5, 7],
    [0, 1, 3, 0, 5, 0, 9, 2, 0],
    [5, 7, 9, 1, 2, 6, 0, 3, 8],
    [0, 0, 7, 0, 0, 2, 6, 0, 3],
    [0, 0, 0, 0, 3, 8, 2, 0, 5],
    [0, 2, 0, 5, 0, 1, 0, 0, 0],
];

let mediumStartState: Sudoku.Puzzle2D = [ 
    [5, 0, 0, 0, 3, 8, 0, 0, 9],
    [4, 0, 0, 0, 6, 0, 0, 0, 0],
    [0, 3, 0, 0, 0, 0, 6, 0, 0],
    [1, 0, 5, 6, 0, 9, 0, 0, 4],
    [0, 4, 0, 0, 0, 0, 0, 7, 0],
    [9, 0, 0, 3, 0, 7, 5, 0, 8],
    [0, 0, 4, 0, 0, 0, 0, 2, 0],
    [0, 0, 0, 0, 9, 0, 0, 0, 3],
    [6, 0, 0, 4, 7, 0, 0, 0, 1]
]

let hardStartState: Sudoku.Puzzle2D = [
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

let easySolvedState: Sudoku.Puzzle2D = [
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

let mediumSolvedState: Sudoku.Puzzle2D = [
    [5, 6, 7, 2, 3, 8, 1, 4, 9],
    [4, 8, 9, 7, 6, 1, 3, 5, 2],
    [2, 3, 1, 9, 5, 4, 6, 8, 7],
    [1, 7, 5, 6, 8, 9, 2, 3, 4],
    [8, 4, 3, 1, 2, 5, 9, 7, 6],
    [9, 2, 6, 3, 4, 7, 5, 1, 8],
    [3, 9, 4, 8, 1, 6, 7, 2, 5],
    [7, 1, 8, 5, 9, 2, 4, 6, 3],
    [6, 5, 2, 4, 7, 3, 8, 9, 1]
]

let hardSolvedState: Sudoku.Puzzle2D = [ 
    [2, 7, 8, 3, 9, 6, 1, 4, 5],
    [4, 1, 5, 7, 2, 8, 3, 9, 6],
    [9, 6, 3, 4, 1, 5, 7, 2, 8],
    [8, 5, 9, 2, 4, 7, 6, 1, 3],
    [3, 2, 7, 6, 5, 1, 4, 8, 9],
    [1, 4, 6, 8, 3, 9, 5, 7, 2],
    [5, 3, 2, 1, 8, 4, 9, 6, 7],
    [7, 9, 1, 5, 6, 2, 8, 3, 4],
    [6, 8, 4, 9, 7, 3, 2, 5, 1]
]


test('it can get possible values for a given cell', () => {
    const sudoku = new SudokuPuzzle(easyStartState)
    let possibleValues = sudoku.getPossibleValuesForCell(0, 1)
    expect(possibleValues).toEqual([3,5,6])
    possibleValues = sudoku.getPossibleValuesForCell(0, 8)
    expect(possibleValues).toEqual([1,2,6])
})

test('it can find the next empty cell', () => {
    const sudoku = new SudokuPuzzle(easyStartState)
    const nextEmptyCell = sudoku.findNextEmptyCell()

    expect(nextEmptyCell).toEqual([0,1])
})

test('it can solve impacted cells after a cell is solved', () => {
    const sudoku = new SudokuPuzzle(easyStartState)

    sudoku.checkImpactedSections({
        row: 6, column: 7
    })

    const postImpactPuzzle = [
        [7, 3, 5, 6, 1, 4, 8, 9, 2],
        [8, 4, 2, 9, 7, 3, 5, 6, 1],
        [9, 6, 1, 2, 8, 5, 3, 7, 4],
        [2, 8, 6, 3, 4, 9, 1, 5, 7],
        [4, 1, 3, 8, 5, 7, 9, 2, 6],
        [5, 7, 9, 1, 2, 6, 4, 3, 8],
        [1, 5, 7, 4, 9, 2, 6, 8, 3],
        [6, 9, 4, 7, 3, 8, 2, 1, 5],
        [3, 2, 8, 5, 6,1, 7, 4, 9]
    ]

    expect(sudoku.puzzle).toEqual(postImpactPuzzle)
})

test('it can check and fill a given section'), () => {
    const sudoku = new SudokuPuzzle(easyStartState)
}

test('it can solve an easy puzzles', () => {
    const sudoku = new SudokuPuzzle(easyStartState)
    sudoku.solvePuzzle()
    expect(sudoku.puzzle).toEqual(easySolvedState)
})

test('it can solve a medium puzzles', () => {
    const sudoku = new SudokuPuzzle(mediumStartState)
    sudoku.solvePuzzle()
    expect(sudoku.puzzle).toEqual(mediumSolvedState)
})

test('it can solve a hard puzzles', () => {
    const sudoku = new SudokuPuzzle(hardStartState)
    sudoku.solvePuzzle()
    expect(sudoku.puzzle).toEqual(hardSolvedState)
})


