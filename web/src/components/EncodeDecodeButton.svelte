<script>    
    import { loadImage, encode as encodeMessage, decode as decodeMessage } from '../lib/lsb_image_steg'
    import { encode, image, message, output } from '../stores'
    import Button from './Button.svelte'

    let canvasEl, promise = new Promise(resolve => resolve())

    async function encodeOrDecode() {
        await new Promise(resolve => setTimeout(resolve, 100))
        loadImage(canvasEl, $image)

        if ($encode) {
            encodeMessage(canvasEl, $message)
            $output = canvasEl.toDataURL()
        } else {
            $output = decodeMessage(canvasEl)
        }
    }
</script>

<style>
    canvas {
        display: none;
    }
</style>

<Button disabled={!$image?.src || ($encode && !$message)} style="margin-top: 2rem;" on:click={() => promise = encodeOrDecode()}>
    {#await promise}
        {($encode ? 'Encoding' : 'Decoding') + '...'}
    {:then}
        {$encode ? 'Encode message' : 'Decode message'}
    {/await}
    <canvas bind:this={canvasEl}></canvas>
</Button>
