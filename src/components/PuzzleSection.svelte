<script lang="ts">
import type { Sudoku } from "$lib/sudoku";
import PuzzleCell from "./PuzzleCell.svelte";

export let values: Sudoku.Section2D = [0,0,0,0,0,0,0,0,0]
export let activeCell: number | null = null
export let checkedCell: number | null = null
export let checkedCellPossibilities: Array<1|2|3|4|5|6|7|8|9> = []
console.log(checkedCellPossibilities)


</script>

<div class="grid grid-cols-3 border border-red-950/80 overflow-hidden">
    {#each values as value, index}
        <PuzzleCell value={value || ((checkedCell === index + 1) ? checkedCellPossibilities : '')} active={activeCell === index + 1} checked={checkedCell === index + 1}/>
    {/each}
</div>
