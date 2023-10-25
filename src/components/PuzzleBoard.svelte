<script lang="ts">
    import type { Sudoku } from "$lib/sudoku";
    import PuzzleSection, {type PuzzleBoardSection } from "./PuzzleSection.svelte";

    export let puzzle: Sudoku.Puzzle2D
    export let emptyCellBeingChecked: Sudoku.CellLocation & {value: Sudoku.CellValue}

    //watch and log emptyCellBeingChecked

    $: getSectionsFromPuzzle = (puzzle: Sudoku.Puzzle2D): PuzzleBoardSection[] => {
        let rowStart = 0
        let rowEnd = 0
        let colStart = 0
        let colEnd = 0

        let sections: PuzzleBoardSection[] = [
            new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()
        ]

        sections.forEach((section, index) => {
            const sectionLocation = index + 1

            switch(sectionLocation) {
                case 1:
                    rowStart = 0
                    rowEnd = 2
                    colStart = 0
                    colEnd = 2
                    break
                case 2:
                    rowStart = 0
                    rowEnd = 2
                    colStart = 3
                    colEnd = 5
                    break
                case 3:
                    rowStart = 0
                    rowEnd = 2
                    colStart = 6
                    colEnd = 8
                    break
                case 4:
                    rowStart = 3
                    rowEnd = 5
                    colStart = 0
                    colEnd = 2
                    break
                case 5:
                    rowStart = 3
                    rowEnd = 5
                    colStart = 3
                    colEnd = 5
                    break
                case 6:
                    rowStart = 3
                    rowEnd = 5
                    colStart = 6
                    colEnd = 8
                    break
                case 7:
                    rowStart = 6
                    rowEnd = 8
                    colStart = 0
                    colEnd = 2
                    break
                case 8:
                    rowStart = 6
                    rowEnd = 8
                    colStart = 3
                    colEnd = 5
                    break
                case 9:
                    rowStart = 6
                    rowEnd = 8
                    colStart = 6
                    colEnd = 8
                    break
            }

            let cellIndex = 1
            for(let row = rowStart; row <= rowEnd; row++) {
                for(let col = colStart; col <= colEnd; col++) {
                    section.set(cellIndex as Sudoku.GridLocation, {
                        value: emptyCellBeingChecked.section === sectionLocation && emptyCellBeingChecked.position === cellIndex ? emptyCellBeingChecked.value ? emptyCellBeingChecked.value : puzzle[row][col] || '' : puzzle[row][col] || '',
                        beingCheckedIfEmpty: emptyCellBeingChecked.section === sectionLocation && emptyCellBeingChecked.position === cellIndex,
                    })
                    cellIndex +=1
                }
            }
        })

        return sections
    }
</script>

<div class="h-auto max-w-full aspect-square bg-[#ecdad3] shadow-2xl shadow-black/70 border-[8px] border-red-950/20 rounded">
    <div class="grid grid-cols-3 max-w-full h-auto aspect-square shadow-inner shadow-black/30">
        {#each getSectionsFromPuzzle(puzzle) as section}
            <PuzzleSection PuzzleBoardSection={section} />
        {/each}
    </div>
</div>