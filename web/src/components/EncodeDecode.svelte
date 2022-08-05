<script>
    import { encode, error, output } from '../stores'
    import RadioButtonGroup from './RadioButtonGroup.svelte'

    function handleClick() {
        $output = undefined
        $error = undefined
    }
</script>

<style>
    .container {
        display: flex;
		flex-direction: column;
		user-select: none;
		-webkit-user-select: none;
    }
</style>

<h2>Encode/Decode</h2>

<p>Choose whether to encode a message into an image or decode one from an image</p>

<fieldset name="encodeDecode">
    <legend>encode/decode</legend>

    <div class="container">
        <RadioButtonGroup
            group={encode}
            items={[
                { value: true, label: 'Encode' },
                { value: false, label: 'Decode' }
            ]}
            on:click={handleClick}
        />
    </div>
</fieldset>