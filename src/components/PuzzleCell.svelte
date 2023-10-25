<script lang="ts">
import type { Sudoku } from "$lib/sudoku";

export let value: Sudoku.CellValue<''> = ''
export let active: boolean
</script>

<input value={value} class={active ? '!bg-blue-200' : ''}/>

<style>
input {
    @apply shadow-inner bg-[#ece1dd] text-center font-bold overflow-hidden text-lg border border-red-950/20;
}

</style>