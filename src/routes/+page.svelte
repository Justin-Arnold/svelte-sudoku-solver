<script lang="ts">
import type { SudokuPuzzle } from "$lib/sudoku";
import { solvePuzzle, validateSolution, type Sudoku } from "$lib/sudoku";
import BaseButton from "../components/BaseButton.svelte";
    import PuzzleBoard from "../components/PuzzleBoard.svelte";
import PuzzleSection from '../components/PuzzleSection.svelte'


export let puzzle: SudokuPuzzle = [
    [7, 3, 0, 0, 0, 4, 0, 9, 0],
    [8, 0, 2, 9, 7, 3, 0, 0, 0],
    [9, 0, 1, 2, 0, 0, 3, 0, 0],
    [0, 0, 0, 0, 4, 9, 1, 5, 7],
    [0, 1, 3, 0, 5, 0, 9, 2, 0],
    [5, 7, 9, 1, 2, 0, 0, 0, 0],
    [0, 0, 7, 0, 0, 2, 6, 0, 3],
    [0, 0, 0, 0, 3, 8, 2, 0, 5],
    [0, 2, 0, 5, 0, 0, 0, 0, 0],
    // [5, 0, 0, 0, 3, 8, 0, 0, 9],
    // [4, 0, 0, 0, 6, 0, 0, 0, 0],
    // [0, 3, 0, 0, 0, 0, 6, 0, 0],
    // [1, 0, 5, 6, 0, 9, 0, 0, 4],
    // [0, 4, 0, 0, 0, 0, 0, 7, 0],
    // [9, 0, 0, 3, 0, 7, 5, 0, 8],
    // [0, 0, 4, 0, 0, 0, 0, 2, 0],
    // [0, 0, 0, 0, 9, 0, 0, 0, 3],
    // [6, 0, 0, 4, 7, 0, 0, 0, 1]
];

let initialState = JSON.parse(JSON.stringify(puzzle))
let solvedPuzzle: SudokuPuzzle | null

let cellToCheck: [number, number] = [0,0]
let cellPossible: [number, number] = [0,0]

async function solve() {
    solvedPuzzle = await solvePuzzle(
        puzzle,
        {
            onCellCheckCallback: (row: number, col: number) => {
                // console.log(`checking ${row}, ${col}`)
                cellToCheck = [row+1, col+1]
            },
            onCellPossibilitiesCallback: (row: number, col: number ) => {
                cellPossible = [row+1, col+1]
            },
            onFoundCallback: (row: number, col: number, value) => {
                puzzle[row][col] = value as Sudoku.CellValue
            },
            onFindPossibleValuesForCell(cell, values) {
                console.log(`possible values for ${cell.section}, ${cell.position}: ${values}`)
            },
        },{delay}
    )
    if(solvedPuzzle === null) {
        alert("This puzzle is unsolvable")
    }
    else {
        if (validateSolution(initialState, solvedPuzzle)) {
            console.log("This puzzle is solved")
            puzzle = solvedPuzzle
        }
        else {
            console.log("This puzzle is not solved")
        }
    }
}

let delay = 5

function setSpeed(speed: number) {
    console.log(speed)
    delay = speed
}



</script>
<div class="flex flex-col overflow-hidden bg-[#f5eae6] h-screen w-screen">
    <div class="h-16 flex items-center p-4">
        <h1 class="font-extralight text-3xl">🍙 Solved</h1>
    </div>
    <div class="bg-[#fbf4f5] grow flex p-4">
        <div class="h-full grow bg-[#b7c7cc] rounded-lg grid place-items-center">
            <div class="p-4 h-[50vh] flex justify-center">
                <PuzzleBoard {puzzle}  activeCell={cellPossible} emptyCellBeingChecked={cellToCheck}/>
            </div>
        </div>
        <div class="h-full flex flex-col justify-end items-center w-fit shrink-0">
            <div class="grow w-full items-start justify-top flex flex-col px-4 gap-2">
                <h2 class="text-lg text-red-950">Options</h2>
                <div class="flex gap-4">
                    <div class="h-full aspect-square rounded-full bg-red-950/20 grid place-items-center">1</div>
                    <p>Speed</p>
                </div>
                <div class="flex gap-4 justify-between w-full">
                    <BaseButton text="slow"  onClick={() => setSpeed(100)}></BaseButton>
                    <BaseButton text="medium" onClick={() => setSpeed(20)}></BaseButton>
                    <BaseButton text="fast" onClick={() => setSpeed(5)}></BaseButton>
                    <BaseButton text="instant" onClick={() => setSpeed(0)}></BaseButton>
                </div>
            </div>
            <BaseButton onClick={() => solve()} text="Solve"></BaseButton>
        </div>
    </div>
</div>
