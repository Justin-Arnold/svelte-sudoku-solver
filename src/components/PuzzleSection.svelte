<script lang="ts" context="module">
    export type PuzzleBoardSection = Map<Sudoku.GridLocation, Pick<PuzzleBoardCell, "value" | "possibilities" | "isOriginal">>

</script>

<script lang="ts">
    import type { Sudoku } from "$lib/sudoku";
    import PuzzleCell, { type PuzzleBoardCell } from "./PuzzleCell.svelte";

    export let puzzleBoardSection: PuzzleBoardSection
    export let cellBeingCheckedForPossibilities: Sudoku.GridLocation | null
    export let cellBeingCheckedIfEmpty: Sudoku.GridLocation | null


    $: sectionWithCells = (): PuzzleBoardCell[] => {
        let section: PuzzleBoardCell[] = [];

        puzzleBoardSection.forEach((cell, location) => {
            section.push({
                ...cell,
                beingCheckedForPossibilities: cellBeingCheckedForPossibilities === location,
                beingCheckedIfEmpty: cellBeingCheckedIfEmpty === location
            })
        })

        return section
    }
</script>

<div class="grid grid-cols-3 border border-red-950/80 overflow-hidden">
    {#each sectionWithCells() as cell}
        <PuzzleCell cell={cell} />
    {/each}
</div>
