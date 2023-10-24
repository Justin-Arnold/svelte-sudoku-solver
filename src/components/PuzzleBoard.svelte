<script lang="ts">
import PuzzleSection from "./PuzzleSection.svelte";
import type { SudokuPuzzle } from "$lib/sudoku";

export let puzzle: SudokuPuzzle
</script>

<div class="h-auto max-w-full aspect-square bg-[#ecdad3] shadow-2xl shadow-black/70 border-[8px] border-red-950/20 rounded">
    <div class="grid grid-cols-3 max-w-full h-auto aspect-square shadow-inner shadow-black/30">
        <PuzzleSection {puzzle} puzzleSection={{column: 'left', row: 'top'}}/>
        <PuzzleSection {puzzle} puzzleSection={{column: 'middle', row: 'top'}}/>
        <PuzzleSection {puzzle} puzzleSection={{column: 'right', row: 'top'}}/>
        <PuzzleSection {puzzle} puzzleSection={{column: 'left', row: 'middle'}}/>
        <PuzzleSection {puzzle} puzzleSection={{column: 'middle', row: 'middle'}}/>
        <PuzzleSection {puzzle} puzzleSection={{column: 'right', row: 'middle'}}/>
        <PuzzleSection {puzzle} puzzleSection={{column: 'left', row: 'bottom'}}/>
        <PuzzleSection {puzzle} puzzleSection={{column: 'middle', row: 'bottom'}}/>
        <PuzzleSection {puzzle} puzzleSection={{column: 'right', row: 'bottom'}}/>
    </div>
</div>