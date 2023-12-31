<script lang="ts">
import type { SudokuPuzzle } from "$lib/sudoku";
import { solvePuzzle, validateSolution, type Sudoku } from "$lib/sudoku";
import BaseButton from "../components/BaseButton.svelte";
    import PuzzleBoard from "../components/PuzzleBoard.svelte";
import PuzzleSection from '../components/PuzzleSection.svelte'
    import Layout from "./+layout.svelte";


export let puzzle: SudokuPuzzle = [
    // [7, 3, 0, 0, 0, 4, 0, 9, 0],
    // [8, 0, 2, 9, 7, 3, 0, 0, 0],
    // [9, 0, 1, 2, 0, 0, 3, 0, 0],
    // [0, 0, 0, 0, 4, 9, 1, 5, 7],
    // [0, 1, 3, 0, 5, 0, 9, 2, 0],
    // [5, 7, 9, 1, 2, 0, 0, 0, 0],
    // [0, 0, 7, 0, 0, 2, 6, 0, 3],
    // [0, 0, 0, 0, 3, 8, 2, 0, 5],
    // [0, 2, 0, 5, 0, 0, 0, 0, 0],
    // [5, 0, 0, 0, 3, 8, 0, 0, 9],
    // [4, 0, 0, 0, 6, 0, 0, 0, 0],
    // [0, 3, 0, 0, 0, 0, 6, 0, 0],
    // [1, 0, 5, 6, 0, 9, 0, 0, 4],
    // [0, 4, 0, 0, 0, 0, 0, 7, 0],
    // [9, 0, 0, 3, 0, 7, 5, 0, 8],
    // [0, 0, 4, 0, 0, 0, 0, 2, 0],
    // [0, 0, 0, 0, 9, 0, 0, 0, 3],
    // [6, 0, 0, 4, 7, 0, 0, 0, 1]
    [0, 0, 8, 0, 0, 6, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 3, 9, 6],
    [0, 0, 3, 0, 1, 0, 0, 0, 8],
    [0, 5, 0, 2, 0, 0, 0, 1, 0],
    [0, 0, 0, 6, 0, 1, 0, 0, 0],
    [0, 4, 0, 0, 0, 9, 0, 7, 0],
    [5, 0, 0, 0, 8, 0, 9, 0, 0],
    [7, 9, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 9, 0, 0, 2, 0, 0]
];

let initialState = JSON.parse(JSON.stringify(puzzle))
let solvedPuzzle: SudokuPuzzle | null

let emptyCellFinder: Sudoku.CellLocation & {value: Sudoku.CellValue} = {section: 1, position: 1, value: 0}
let solveFinder: Sudoku.CellLocation & {possibilities: Sudoku.CellValue<"">[]}  = {section: 1, position: 1, possibilities: []}

let visualizerQueue: Array<() => void> = []

async function solve() {
    solvedPuzzle = solvePuzzle(
        puzzle,{
            findingNextEmptyCell: cell => { // RED LOCATION
                visualizerQueue.push(() => {
                    emptyCellFinder.position = cell.position
                    emptyCellFinder.section = cell.section
                })
            },
            onFindPossibleValuesForCell(cell, values) { //RED VALUE
                visualizerQueue.push(() => {
                    emptyCellFinder.value = values[0]
                })
            },
            onCellPossibilitiesCallback: (cell, possibilities) => { // BLUE LOCATION
                visualizerQueue.push(() => {
                    solveFinder.position = cell.position
                    solveFinder.section = cell.section,
                    solveFinder.possibilities = possibilities
                })
            },
            onFoundCallback: (row: number, col: number, value) => { // UNKNOWN VALUE
                visualizerQueue.push(() => {
                    puzzle[row][col] = value as Sudoku.CellValue
                })
            }
        }
    )
    if(solvedPuzzle === null) {
        alert("This puzzle is unsolvable")
    }
    else {
        if (validateSolution(initialState, solvedPuzzle)) {
            console.log("This puzzle is solved")
            console.log(visualizerQueue)

            for(let i = 0; i < visualizerQueue.length; i++) {
                await new Promise(resolve => setTimeout(resolve, delay))
                visualizerQueue[i]()
            }
        }
        else {
            console.log("This puzzle is not solved")
        }
    }
}

let delay = 5
$:  puzzleString = () => {
    let tempString = ''
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            tempString += puzzle[row][col] || '.'
        }
    }
    return tempString
}

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
                <PuzzleBoard {puzzle} emptyCellBeingChecked={emptyCellFinder} solveFinder={solveFinder}/>
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
                    <BaseButton text="medium" onClick={() => setSpeed(25)}></BaseButton>
                    <BaseButton text="fast" onClick={() => setSpeed(5)}></BaseButton>
                    <BaseButton text="instant" onClick={() => setSpeed(0)}></BaseButton>
                </div>
                <div class="flex gap-4 w-full">
                    <div class="h-full aspect-square rounded-full bg-red-950/20 grid place-items-center">1</div>
                    <p>Puzzle String</p>
                </div>
                <div class="flex gap-4 justify-between w-full">
                    <input value="{puzzleString()}" class="p-2 rounded w-full shadow-inner bg-[#e8dfdc] shadow-red-950/20" disabled>
                </div>
            </div>
            <BaseButton onClick={() => solve()} text="Solve"></BaseButton>
        </div>
    </div>
</div>
