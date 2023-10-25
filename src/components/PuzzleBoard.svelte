<script lang="ts">
import PuzzleSection from "./PuzzleSection.svelte";
import type { SudokuPuzzle, Sudoku } from "$lib/sudoku";

export let puzzle: SudokuPuzzle
export const activeCell: [number, number] = [0,0]

type SectionRow = 'top' | 'middle' | 'bottom'
type SectionColumn = 'left' | 'middle' | 'right'

type SectionPlacement = {
    row: SectionRow,
    column: SectionColumn
}

function getPuzzleSection(puzzle: SudokuPuzzle, sectionPlacement: SectionPlacement) {

    let rowStart = 0
    let rowEnd = 0
    let colStart = 0
    let colEnd = 0

    switch(sectionPlacement.row) {
        case 'top':
            rowStart = 0
            rowEnd = 2
            break
        case 'middle':
            rowStart = 3
            rowEnd = 5
            break
        case 'bottom':
            rowStart = 6
            rowEnd = 8
            break
    }

    switch(sectionPlacement.column) {
        case 'left':
            colStart = 0
            colEnd = 2
            break
        case 'middle':
            colStart = 3
            colEnd = 5
            break
        case 'right':
            colStart = 6
            colEnd = 8
            break
    }

    let section = []

    for(let row = rowStart; row <= rowEnd; row++) {
        for(let col = colStart; col <= colEnd; col++) {
            section.push(puzzle[row][col])
        }
    }

    return section
}
</script>

<div class="h-auto max-w-full aspect-square bg-[#ecdad3] shadow-2xl shadow-black/70 border-[8px] border-red-950/20 rounded">
    <div class="grid grid-cols-3 max-w-full h-auto aspect-square shadow-inner shadow-black/30">
        <PuzzleSection values={getPuzzleSection(puzzle, {column: 'left', row: 'top'})} activeCell={1} />
        <PuzzleSection values={getPuzzleSection(puzzle, {column: 'middle', row: 'top'})} activeCell={null} />
        <PuzzleSection values={getPuzzleSection(puzzle, {column: 'right', row: 'top'})} activeCell={null} />
        <PuzzleSection values={getPuzzleSection(puzzle, {column: 'left', row: 'middle'})} activeCell={null} />
        <PuzzleSection values={getPuzzleSection(puzzle, {column: 'middle', row: 'middle'})} activeCell={null}/>
        <PuzzleSection values={getPuzzleSection(puzzle, {column: 'right', row: 'middle'})} activeCell={null} />
        <PuzzleSection values={getPuzzleSection(puzzle, {column: 'left', row: 'bottom'})} activeCell={null} />
        <PuzzleSection values={getPuzzleSection(puzzle, {column: 'middle', row: 'bottom'})} activeCell={null} />
        <PuzzleSection values={getPuzzleSection(puzzle, {column: 'right', row: 'bottom'})} activeCell={null} />
    </div>
</div>