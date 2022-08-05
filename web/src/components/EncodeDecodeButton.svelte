<script>    
    import { loadImage, encode as encodeMessage, decode as decodeMessage } from '../lib/lsb_image_steg'
    import { encode, encodeType, error, image, imageFilename, message, decodeFile, output } from '../stores'
    import Button from './Button.svelte'

    let canvasEl, promise = new Promise(resolve => resolve())

    async function encodeOrDecode() {
        await new Promise(resolve => setTimeout(resolve, 100))
        loadImage(canvasEl, $image)

        try {
            if ($encode) {
                // @ts-ignore
                encodeMessage(canvasEl, $encodeType === 'text' ? $message : new Uint8Array($message))
                $output = canvasEl.toDataURL()
            } else {
                if ($decodeFile) {
                    $output = decodeMessage(canvasEl, true)
                    const file = new File([$output], 'decoded')
                    const url = URL.createObjectURL(file)
                    $output = url
                } else {
                    $output = decodeMessage(canvasEl)
                }
            }
        } catch (err) {
            console.error(`Error ${$encode ? 'encoding' : 'decoding'}:`, err)
            $error = err.message
        }
    }
</script>

<style>
    canvas {
        display: none;
    }

    .decodeFileContainer, .error {
        margin-top: 2rem;
    }

    .error {
        display: block;
        font-size: 0.8em;
        color: rgb(216, 58, 58);
    }

    input[type="checkbox"] {
        vertical-align: middle;
    }
</style>

{#if !$encode}
    <div class="decodeFileContainer">
        <input type="checkbox" id="decodeFile" bind:checked={$decodeFile} />
        <label for="decodeFile">Encoded message is a file</label>
    </div>
{/if}

{#if $error}
    <span class="error">{$error}</span>
{/if}

<Button disabled={!$imageFilename || ($encode && !$message)} style="margin-top: 2rem;" on:click={() => promise = encodeOrDecode()}>
    {#await promise}
        {($encode ? 'Encoding' : 'Decoding') + '...'}
    {:then}
        {$encode ? 'Encode message' : 'Decode message'}
    {:catch}
        {$encode ? 'Encode message' : 'Decode message'}
    {/await}
    <canvas bind:this={canvasEl}></canvas>
</Button>
