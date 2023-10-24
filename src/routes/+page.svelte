<script lang="ts">
import type { SudokuPuzzle } from "$lib/sudoku";
import { solvePuzzle, validateSolution, type Sudoku } from "$lib/sudoku";
import BaseButton from "../components/BaseButton.svelte";
    import PuzzleBoard from "../components/PuzzleBoard.svelte";
import PuzzleSection from '../components/PuzzleSection.svelte'


export let puzzle: SudokuPuzzle = [
    [7, 0, 0, 0, 0, 4, 0, 9, 0],
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
        (row: number, col: number) => {
            // console.log(`checking ${row}, ${col}`)
            cellToCheck = [row, col]
        },
        (row: number, col: number ) => {
            cellPossible = [row, col]
        },
        (row: number, col: number, value) => {
            puzzle[row][col] = value as Sudoku.CellValue
        }
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



</script>
<div class="flex flex-col overflow-hidden bg-[#f5eae6] h-screen w-screen">
    <div class="h-16 flex items-center p-4">
        <h1 class="font-extralight text-3xl">🍙 Solved</h1>
    </div>
    <div class="bg-[#fbf4f5] grow flex p-4">
        <div class="h-full aspect-square bg-[#b7c7cc] rounded-lg grid place-items-center">
            <div class="p-4 h-[50vh] flex justify-center">
                <PuzzleBoard {puzzle} />
            </div>
        </div>
        <div class="h-full flex flex-col justify-end items-center w-full">
            <div class="grow w-full items-start justify-top flex flex-col px-4 gap-2">
                <h2 class="text-lg text-red-950">Options</h2>
                <div class="flex gap-4">
                    <div class="h-full aspect-square rounded-full bg-red-950/20 grid place-items-center">1</div>
                    <p>Speed</p>
                </div>
                <div class="flex gap-4 justify-between w-full">
                    <BaseButton text="slow"></BaseButton>
                    <BaseButton text="medium"></BaseButton>
                    <BaseButton text="fast"></BaseButton>
                </div>
            </div>
            <BaseButton onClick={() => solve()} text="Solve"></BaseButton>
        </div>
    </div>
</div>

<style>
    /* Add your CSS styling for the Sudoku puzzle here */
    .sudoku-puzzle {
        width: fit-content;
        border: 1px solid #000;
    }

    .sudoku-row {
      display: flex;
      flex-direction: row;
    }

    .sudoku-cell {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #000;
        font-size: 20px;
        background: #fff    ;
    }

    .valid {
        background-color: #e08ea0;
    }

    .check-cell {
        background-color: #8ba8c1;
        color: white;
    }

    .sub-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>