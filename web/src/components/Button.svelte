<script>
    export let disabled = false, style = ""
</script>

<style>
    button {
        display: flex;
		align-items: center;
		justify-content: center;
		-webkit-appearance: none;
		max-width: 16rem;
		background-color: #eee;
		box-shadow: none;
		border: 2px solid #ccc;
		margin: 0;
        padding: 0.4rem;
		border-radius: 4px;
		height: 3rem;
		cursor: pointer;
		font-size: 0.8em;
        user-select: none;
        -webkit-user-select: none;
    }

    button:disabled {
        cursor: not-allowed;
    }

    button:hover:not(:disabled) {
		background-color: #ccc;
	}

    button:active {
		border-color: black;
		color: black;
	}
</style>

<button disabled={disabled} style={style} on:click>
    <slot></slot>
</button>
