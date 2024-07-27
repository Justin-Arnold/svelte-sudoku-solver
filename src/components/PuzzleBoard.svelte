<script lang="ts">
    import type { Sudoku } from "$lib/sudoku";
    import type { PuzzleBoardCell } from "./PuzzleCell.svelte";
    import PuzzleSection, {type PuzzleBoardSection } from "./PuzzleSection.svelte";

    export let puzzle: Sudoku.Puzzle2D
    export let emptyCellBeingChecked: Sudoku.CellLocation & {value: Sudoku.CellValue}
    export let solveFinder: Sudoku.CellLocation & {possibilities: Sudoku.CellValue<"">[]}

    //watch and log emptyCellBeingChecked
    $: getCellInSectionBeingCheckedForPossibilities = (cellPositionOnBoard: Sudoku.CellLocation, sectionToCheck: Sudoku.GridLocation): Sudoku.GridLocation | null => {
        return cellPositionOnBoard.section === sectionToCheck ? cellPositionOnBoard.position : null
    }

    $: getCellInSectionBeingCheckedIfEmpty = (cellPositionOnBoard: Sudoku.CellLocation, sectionToCheck: Sudoku.GridLocation): Sudoku.GridLocation | null => {
        return cellPositionOnBoard.section === sectionToCheck ? cellPositionOnBoard.position : null
    }

    let originalPuzzle: Sudoku.Puzzle2D | undefined = undefined;


    $: getSectionsFromPuzzle = (puzzle: Sudoku.Puzzle2D): Map<Sudoku.GridLocation, PuzzleBoardSection> => {
        if (originalPuzzle === undefined) {
            originalPuzzle = JSON.parse(JSON.stringify(puzzle))
        }

        let rowStart = 0
        let rowEnd = 0
        let colStart = 0
        let colEnd = 0

        const sections = new Map<Sudoku.GridLocation, PuzzleBoardSection>()
        const sectionLocations: Sudoku.GridLocation[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]




        sectionLocations.forEach((location) => {
            switch(location) {
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
            const cells = new Map<Sudoku.GridLocation, Pick<PuzzleBoardCell, 'value' | 'possibilities' | 'isOriginal'>>()

            for(let row = rowStart; row <= rowEnd; row++) {
                for(let col = colStart; col <= colEnd; col++) {
                    cells.set
                    cells.set(cellIndex as Sudoku.GridLocation, {
                        value: puzzle[row][col] || '',
                        possibilities: solveFinder.section === location && solveFinder.position === cellIndex ? solveFinder.possibilities : [],
                        isOriginal: originalPuzzle[row][col] !== 0 
                    })
                    cellIndex +=1
                }
            }

            sections.set(location, cells)
        })

        return sections
    }
</script>

<div class="h-auto max-w-full aspect-square bg-[#ecdad3] shadow-2xl shadow-black/70 border-[8px] border-red-950/20 rounded">
    <div class="grid grid-cols-3 max-w-full h-auto aspect-square shadow-inner shadow-black/30">
        {#each getSectionsFromPuzzle(puzzle) as [location, section]}
            <PuzzleSection
                puzzleBoardSection={section}
                cellBeingCheckedForPossibilities={getCellInSectionBeingCheckedForPossibilities(solveFinder, location)}
                cellBeingCheckedIfEmpty={getCellInSectionBeingCheckedIfEmpty(emptyCellBeingChecked, location)}
            />
        {/each}
    </div>
</div>