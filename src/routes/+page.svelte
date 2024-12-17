<script lang="ts">
import { SudokuPuzzle, examplePuzzles } from "$lib/sudoku";
import type { CellLocation, CellValue } from "../types/sudoku";
import { clone } from '../lib/utils'
import BaseButton from "../components/BaseButton.svelte";
import BaseButtonGroup from "../components/BaseButtonGroup.svelte";
import PuzzleBoard from "../components/PuzzleBoard.svelte";

let selectedDifficulty: 'easy' | 'medium' | 'hard' = 'easy';
let selectedMethod: ''
let selectedSpeed = 400;
let lastSolveTime = 0;


$: currentPuzzle = examplePuzzles[selectedDifficulty];

$: sudoku = new SudokuPuzzle(currentPuzzle, {
    onFound: onFoundCallback,
    // onFindEmptyCell: onFindEmptyCallback,
    onCheckCell: onCheckCellCallback,
});

$: localPuzzle = clone(sudoku.puzzle);

let emptyCellFinder: CellLocation & {value: CellValue} = {section: 1, position: 1, value: 0}
let solveFinder: CellLocation & {possibilities: CellValue<"">[]}  = {section: 1, position: 1, possibilities: []}

let visualizerQueue: Array<() => void> = []

$: stepsToSolve = (() => visualizerQueue.length)()

function onFoundCallback(row: number, col: number, value: number):void  { 
    visualizerQueue.push(() => {
        localPuzzle[row][col] = value as CellValue
    })
}

function onFindEmptyCallback(cell: CellLocation) {
    visualizerQueue.push(() => {
            emptyCellFinder.position = cell.position
            emptyCellFinder.section = cell.section
    })
}

function onCheckCellCallback(cell: CellLocation) {
    visualizerQueue.push(() => {
            emptyCellFinder.position = cell.position
            emptyCellFinder.section = cell.section
    })
}

async function onSolveClick() {
    const start = Date.now();
    sudoku.solvePuzzle()
    const end = Date.now();
    lastSolveTime = end - start;
    for(let i = 0; i < visualizerQueue.length; i++) {
        await new Promise(resolve => {
            setTimeout(() => {
                visualizerQueue[i]();
                resolve(null)
            }, selectedSpeed);
        });
    }
}


$:  puzzleString = () => {
    let tempString = ''
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            tempString += localPuzzle[row][col] || '.'
        }
    }
    return tempString
}

</script>
<div class="flex flex-col overflow-hidden bg-base-300 h-screen w-screen">
    <div class="h-16 flex items-center p-4">
        <h1 class="font-extralight text-3xl">🍙 Solved</h1>
    </div>
    <div class="bg-base-100 grow flex p-4">
        <div class="h-full grow bg-[#b7c7cc] rounded-lg grid place-items-center">
            <div class="p-4 h-[50vh] flex justify-center">
                <PuzzleBoard 
                    puzzle={localPuzzle} 
                    emptyCellBeingChecked={emptyCellFinder} 
                    solveFinder={solveFinder}
                />
            </div>
        </div>
        <div class="h-full flex flex-col justify-end items-center w-fit shrink-0">
            <div class="grow w-full items-start justify-top flex flex-col px-4 gap-12">
                <div class="flex flex-col gap-4">
                    <div>
                        <h2 class="text-lg text-neutral font-semibold">Options</h2>
                        <hr />
                    </div>
                    <div>
                        <div class="font-light">
                            <p>Puzzle Difficulty</p>
                        </div>
                        <div class="flex gap-4 justify-start w-full">
                            <BaseButtonGroup
                                options={[
                                    {
                                        label: 'Easy',
                                        value: 'easy'
                                    }, {
                                        label: 'Medium',
                                        value: 'medium'},
                                    {
                                        label: 'Hard',
                                        value: 'hard'
                                    }
                                ]}
                                bind:selectedOption={selectedDifficulty}
                            />
                        </div>
                    </div>
                    <div>
                        <div class="font-light">
                            <p>Method</p>
                        </div>
                        <div class="flex gap-4 justify-start w-full">
                            <BaseButtonGroup
                                options={[
                                    {
                                        label: 'Pure Backtracking',
                                        value: 'backtracking'
                                    }, {
                                        label: 'w/ Constraint Propagation',
                                        value: 'contraint'
                                    }
                                ]}
                                bind:selectedOption={selectedMethod}
                            />
                        </div>
                    </div>
                    <div>
                        <div class="font-light">
                            <p>Speed</p>
                        </div>
                        <div class="flex gap-4 justify-between w-full">
                            <BaseButtonGroup
                                options={[
                                    {
                                        label: 'Slow',
                                        value: 400
                                    }, {
                                        label: 'Medium',
                                        value: 100
                                    }, {
                                        label: 'Fast',
                                        value: 5
                                    }, {
                                        label: 'Instant',
                                        value: 0
                                    }
                                ]}
                                bind:selectedOption={selectedSpeed}
                            />
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-4 w-full">
                    <div>
                        <h2 class="text-lg text-neutral font-semibold">Stats & Data</h2>
                        <hr />
                    </div>
                    <div>
                        <p class="font-light">Puzzle String</p>
                        <div class="flex gap-4 justify-between w-full form-control">
                            <input value="{puzzleString()}" class="input input-bordered rounded" disabled>
                        </div>
                    </div>
                    <div>
                        <p class="font-light">Last Solve Time</p>
                        <div class="flex gap-4 justify-between w-full form-control">
                            <input value="{`${lastSolveTime} ms`}" class="input input-bordered rounded" disabled>
                        </div>
                    </div>
                    <div>
                        <p class="font-light">Steps to Solve</p>
                        <div class="flex gap-4 justify-between w-full form-control">
                            <input value="{`${stepsToSolve}`}" class="input input-bordered rounded" disabled>
                        </div>
                    </div>
                </div>
            </div>
            <BaseButton onClick={onSolveClick} text="Solve"></BaseButton>
        </div>
    </div>
</div>
