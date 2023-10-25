<script lang="ts">
import type { SudokuPuzzle, Sudoku, GameBoardSection } from "$lib/sudoku";
import PuzzleSection from "./PuzzleSection.svelte";

export let puzzle: SudokuPuzzle
export const activeCell: [number, number] = [0,0]

type SectionRow = 'top' | 'middle' | 'bottom'
type SectionColumn = 'left' | 'middle' | 'right'

type SectionPlacement = {
    row: SectionRow,
    column: SectionColumn
}

function getPuzzleSection(puzzle: SudokuPuzzle, sectionPlacement: SectionPlacement): GameBoardSection {

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

    return section as GameBoardSection
}

function getSectionsFromPuzzle(puzzle: SudokuPuzzle): GameBoardSection[] {
    const sections: GameBoardSection[] = [
        getPuzzleSection(puzzle, {column: 'left', row: 'top'}),
        getPuzzleSection(puzzle, {column: 'middle', row: 'top'}),
        getPuzzleSection(puzzle, {column: 'right', row: 'top'}),
        getPuzzleSection(puzzle, {column: 'left', row: 'middle'}),
        getPuzzleSection(puzzle, {column:'middle', row: 'middle'}),
        getPuzzleSection(puzzle, {column: 'right', row: 'middle'}),
        getPuzzleSection(puzzle, {column: 'left', row: 'bottom'}),
        getPuzzleSection(puzzle, {column: 'middle', row: 'bottom'}),
        getPuzzleSection(puzzle, {column: 'right', row: 'bottom'})
    ]

    return sections

}
</script>

<div class="h-auto max-w-full aspect-square bg-[#ecdad3] shadow-2xl shadow-black/70 border-[8px] border-red-950/20 rounded">
    <div class="grid grid-cols-3 max-w-full h-auto aspect-square shadow-inner shadow-black/30">
        {#each getSectionsFromPuzzle(puzzle) as section, index}
            <PuzzleSection values={section} activeCell={index + 1} />
        {/each}
    </div>
</div>