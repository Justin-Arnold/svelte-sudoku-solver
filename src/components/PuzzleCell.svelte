<script lang="ts">
import type { Sudoku } from "../types/sukoku";

export let value: Sudoku.CellValue
</script>

<input value={value} />

<style>
input {
    @apply shadow-inner bg-[#ece1dd] text-center font-bold overflow-hidden text-lg border border-red-950/20;
}

</style>