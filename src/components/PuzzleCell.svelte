<script lang="ts" context="module">
    export type PuzzleBoardCell = {
        value: Sudoku.CellValue<''>
        beingCheckedIfEmpty: boolean
    };
</script>

<script lang="ts">
import type { Sudoku } from "$lib/sudoku";

export let cell: PuzzleBoardCell

$: dynamicStyleString = () => {
    switch(true) {
        case cell.beingCheckedIfEmpty:
            return '!bg-red-200'
        default:
            return ''
    }
}
</script>

<input
    value={cell.value}
    class={
        'shadow-inner bg-[#ece1dd] text-center font-bold overflow-hidden text-lg border border-red-950/20'
        + dynamicStyleString()
    }
/>
