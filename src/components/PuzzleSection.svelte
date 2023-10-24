<script lang="ts">
import type { SudokuPuzzle } from "$lib/sudoku";

type SectionRow = 'top' | 'middle' | 'bottom'
type SectionColumn = 'left' | 'middle' | 'right'

type SectionPlacement = {
    row: SectionRow,
    column: SectionColumn
}


export let puzzle: SudokuPuzzle
export let puzzleSection: SectionPlacement



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

    let section = [[0,0,0],[0,0,0],[0,0,0]]

    for(let row = rowStart; row <= rowEnd; row++) {
        for(let col = colStart; col <= colEnd; col++) {
            section[row - rowStart][col - colStart] = puzzle[row][col]
        }
    }

    return section
}
</script>

<div class="grid grid-cols-3 border border-red-950/80 overflow-hidden">
    <input value={getPuzzleSection(puzzle, puzzleSection)[0][0] || ''}/>
    <input value={getPuzzleSection(puzzle, puzzleSection)[0][1] || ''}/>
    <input value={getPuzzleSection(puzzle, puzzleSection)[0][2] || ''}/>
    <input value={getPuzzleSection(puzzle, puzzleSection)[1][0] || ''}/>
    <input value={getPuzzleSection(puzzle, puzzleSection)[1][1] || ''}/>
    <input value={getPuzzleSection(puzzle, puzzleSection)[1][2] || ''}/>
    <input value={getPuzzleSection(puzzle, puzzleSection)[2][0] || ''}/>
    <input value={getPuzzleSection(puzzle, puzzleSection)[2][1] || ''}/>
    <input value={getPuzzleSection(puzzle, puzzleSection)[2][2] || ''}/>
</div>

<style>

input {
    @apply shadow-inner bg-[#ece1dd] text-center font-bold overflow-hidden text-lg border border-red-950/20;
}

</style>