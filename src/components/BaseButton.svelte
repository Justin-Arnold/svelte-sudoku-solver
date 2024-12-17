<script>
    export let text = '';
    export let onClick = () => {};
    export let outlined = false

    $: buttonClasses = () => {
        const baseClasses = 'btn btn-primary rounded btn-sm'
        const variantClasses = outlined
            ? 'btn-outline'
            : ''

        return `${baseClasses} ${variantClasses}`
    }
</script>

<button 
    on:click={onClick}
    class={buttonClasses()}
>
    {text}
</button>