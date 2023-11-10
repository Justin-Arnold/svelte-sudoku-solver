<script lang="ts" context="module">
    export type PuzzleBoardCell = {
        value: Sudoku.CellValue<''>
        beingCheckedIfEmpty: boolean,
        beingCheckedForPossibilities: boolean,
        possibilities: Array<Sudoku.CellValue<''>>,
        isOriginal: boolean,
    };
</script>

<script lang="ts">
import type { Sudoku } from "$lib/sudoku";

export let cell: PuzzleBoardCell

$: dynamicStyleString = () => {
    switch(true) {
        case cell.beingCheckedForPossibilities:
            return '!bg-green-200'
        case cell.beingCheckedIfEmpty:
            return '!bg-red-200'
        default:
            return ''
    }
}
</script>

<div class="border border-red-950/20 overflow-hidden relative">
    <input
        value={cell.value}
        class={[
            'h-full w-full text-blue-300  bg-[#ece1dd] text-center font-bold text-lg ',
            dynamicStyleString(),
            cell.isOriginal ? '!text-gray-900' : ''
        ].join(' ')}
    />
    <p class="absolute top-0 left-0 grid grid-rows-3 grid-cols-3 h-full w-full">
        {#each cell.possibilities as possibility}
            <span class="text-xs text-red-950/50">{possibility}</span>
        {/each}
    </p>
</div>
