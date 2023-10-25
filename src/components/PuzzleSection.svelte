<script lang="ts" context="module">
    export type PuzzleBoardSection = Map<Sudoku.GridLocation, PuzzleBoardCell>;
</script>

<script lang="ts">
    import type { Sudoku } from "$lib/sudoku";
    import PuzzleCell, { type PuzzleBoardCell } from "./PuzzleCell.svelte";

    //Props
    export let PuzzleBoardSection: Map<Sudoku.GridLocation, PuzzleBoardCell> = new Map()
</script>

<div class="grid grid-cols-3 border border-red-950/80 overflow-hidden">
    {#each PuzzleBoardSection.entries() as [location, cell]}
        <PuzzleCell {cell} />
    {/each}
</div>
