<script lang="ts">
import type { Sudoku } from "$lib/sudoku";

export let value: Sudoku.CellValue<''> = ''
export let active: boolean
export let checked: boolean

$: styleString = () => {
    let classString: string = ''
    classString += active ? ' !bg-blue-200 ' : ' '
    classString += checked ?  '!bg-red-200 ' : ' '
    return classString
}
</script>

<input value={value} class={styleString()}/>

<style>
input {
    @apply shadow-inner bg-[#ece1dd] text-center font-bold overflow-hidden text-lg border border-red-950/20;
}

</style>