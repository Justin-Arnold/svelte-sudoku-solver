<script lang="ts">
import type { Sudoku } from "$lib/sudoku";
import PuzzleCell from "./PuzzleCell.svelte";



type FixedLengthArray<T, L extends number> = [T, ...T[]] & { length: L };


export let values: FixedLengthArray<Sudoku.CellValue, 9> = [0,0,0,0,0,0,0,0,0]
export let activeCell: number | null = null


</script>

<div class="grid grid-cols-3 border border-red-950/80 overflow-hidden">
    {#each values as value, index}
        <PuzzleCell value={value || ''} active={activeCell === index + 1}/>
    {/each}
</div>
