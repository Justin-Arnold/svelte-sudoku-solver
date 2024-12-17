import { test, expect, describe  } from 'vitest';
import { SudokuPuzzle, gridToSection, sectionToGrid } from './sudoku';
import type { CellCoordinate, PuzzleBoard } from '../types/sudoku'

let easyStartState: PuzzleBoard = [
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

let mediumStartState: PuzzleBoard = [ 
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

let hardStartState: PuzzleBoard = [
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

let easySolvedState: PuzzleBoard = [
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

let mediumSolvedState: PuzzleBoard = [
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

let hardSolvedState: PuzzleBoard = [ 
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
    let possibleValues = sudoku.getPossibleValuesForCell({
        section: 1,
        position: 5
    })
    expect(possibleValues).toEqual([4,5,6])
    possibleValues = sudoku.getPossibleValuesForCell({
        section: 3,
        position: 9
    })
    expect(possibleValues).toEqual([4,6])
    possibleValues = sudoku.getPossibleValuesForCell({
        section: 1,
        position: 1
    })
    expect(possibleValues).toEqual([])
})

test('it can find the next empty cell', () => {
    const sudoku = new SudokuPuzzle(easyStartState)
    const nextEmptyCell = sudoku.findNextEmptyCell()

    expect(nextEmptyCell).toEqual([1,2])
})

test('it can check and fill a cell', () => {
    const sudoku = new SudokuPuzzle(easyStartState)

    const returnedValue = sudoku.checkAndFillCell({section: 6,position: 7})
    expect(returnedValue).toEqual(4)
    
})

// test('it can solve impacted cells after a cell is solved', () => {
//     const sudoku = new SudokuPuzzle(easyStartState)

//     sudoku.checkImpactedSections({
//         section: 5, position: 9
//     })

//     const postImpactPuzzle = [
//         [7, 3, 5, 6, 1, 4, 8, 9, 2],
//         [8, 4, 2, 9, 7, 3, 5, 6, 1],
//         [9, 6, 1, 2, 8, 5, 3, 7, 4],
//         [2, 8, 6, 3, 4, 9, 1, 5, 7],
//         [4, 1, 3, 8, 5, 7, 9, 2, 6],
//         [5, 7, 9, 1, 2, 6, 4, 3, 8],
//         [1, 5, 7, 4, 9, 2, 6, 8, 3],
//         [6, 9, 4, 7, 3, 8, 2, 1, 5],
//         [3, 2, 8, 5, 6, 1, 7, 4, 9]
//     ]

//     console.log(sudoku.puzzle)

//     expect(sudoku.puzzle).toEqual(postImpactPuzzle)
// })

test('it can solve an easy puzzles', () => {
    const sudoku = new SudokuPuzzle(easyStartState)
    sudoku.solvePuzzle()
    expect(sudoku.puzzle).toEqual(easySolvedState)
})

// test('it can solve a medium puzzles', () => {
//     const sudoku = new SudokuPuzzle(mediumStartState)
//     sudoku.solvePuzzle()
//     expect(sudoku.puzzle).toEqual(mediumSolvedState)
// })

// test('it can solve a hard puzzles', () => {
//     const sudoku = new SudokuPuzzle(hardStartState)
//     sudoku.solvePuzzle()
//     expect(sudoku.puzzle).toEqual(hardSolvedState)
// })


// describe('coordinate conversion', () => {
//     const sectionCoordinate = {
//         section: 7, position: 4
//     }

//     const gridCoordinate: CellCoordinate = {
//         row: 8, column: 1
//     }

//     test('it can convert grid coordinates to section coordinates', () => {
//         const convertedGridToSection = gridToSection(gridCoordinate)
//         expect(convertedGridToSection).toEqual(sectionCoordinate)
//     })
    
//     test('it can convert section coordinates to grid coordinates', () => {
//         const convertedSectionToSection = sectionToGrid(sectionCoordinate)
//         expect(convertedSectionToSection).toEqual(gridCoordinate)
//     })
// })





