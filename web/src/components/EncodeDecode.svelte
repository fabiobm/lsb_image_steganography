<script>
    import { encode, output } from '../stores'

    function clearOutput() {
        $output = undefined
    }
</script>

<style>
    .container {
        display: flex;
		flex-direction: column;
		user-select: none;
		-webkit-user-select: none;
    }

    .container > div {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    label {
		padding-left: 0.4rem;
	}
</style>

<h2>Encode/Decode</h2>

<p>Choose whether to encode a message into an image or decode one from an image</p>

<fieldset name="encodeDecode">
    <legend>encode/decode</legend>

    <div class="container">
        <div>
            <input type="radio" id="encode" value={true} bind:group={$encode} on:click={clearOutput}>
            <label for="encode">Encode</label>
        </div>

        <div>
            <input type="radio" id="decode" value={false} bind:group={$encode} on:click={clearOutput}>
            <label for="decode">Decode</label>
        </div>
    </div>
</fieldset>