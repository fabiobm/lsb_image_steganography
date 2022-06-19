<script>
    import { encode, imageFilename, output } from '../stores'
    import Button from './Button.svelte'
    import ImagePreview from './ImagePreview.svelte'

    const buttonStyle = "margin-top: 1rem;"

    function copy() {
		const textarea = document.createElement('textarea')
		document.body.appendChild(textarea)

		textarea.value = $output
		textarea.select()
		
		document.execCommand('copy')
		document.body.removeChild(textarea)
	}
</script>

<style>
    a {
        text-decoration: none;
        color: black;
        padding: 0.4rem;
    }
</style>

<h2>Output</h2>

{#if $encode}
    <div>
        <ImagePreview alt="output" src={$output} size="md">
            <svelte:fragment slot="after">
                {#if !$output}
                    —
                {:else}
                    <Button style={buttonStyle + "padding: 0;"}>
                        <a href={$output} download={$imageFilename}>
                            Download image
                        </a>
                    </Button>
                {/if}
            </svelte:fragment>
        </ImagePreview>
    </div>
{:else}
    <pre>{$output || '—'}</pre>
    {#if $output}
        <Button style={buttonStyle} on:click={copy}>copy</Button>
    {/if}
{/if}
