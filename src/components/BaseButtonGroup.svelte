<script lang="ts">
import BaseButton from "./BaseButton.svelte";

type Option<T = string> = {
    label: string
    value: T
}

type Props<T> = {
    options: Option<T>[];
    selectedOptions: Option<T>;
}
    

export let options: option[]
export let selectedOption: T


$: buttonIsOutlined = (value) => {
    return selectedOption !== value
}

function setSelectedOption(value: T) {
    selectedOption = value
}
</script>

{#each options as option}
    <BaseButton
        text={option.label}
        onClick={() => setSelectedOption(option.value)}
        outlined={buttonIsOutlined(option.value)}
    />
{/each}