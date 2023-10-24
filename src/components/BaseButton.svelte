<script>
    export let text = '';
    export let onClick = () => {};
</script>

<button on:click={onClick} class="">
    {text}
</button>

<style>
    button {
        background-color: #f5eae6;
        border: none;
        color: rgba(black, .2);
        padding: 12px 24px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 4px;
    }

    button:hover {
        background-color: #dacccc;
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
</style>
