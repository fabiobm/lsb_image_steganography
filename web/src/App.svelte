<script>
    import EncodeDecode from './components/EncodeDecode.svelte'
    import EncodeDecodeButton from './components/EncodeDecodeButton.svelte'
    import ImageSelector from './components/ImageSelector.svelte'
    import Output from './components/Output.svelte'
    import Message from './components/Message.svelte'
    import { encode } from './stores'
</script>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 62.5%;
    }

    header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    h1 {
        padding: 1.2rem;
        margin: 0;
    }
    
    main {
        padding-top: 1.2rem;
        padding-bottom: 2rem;
    }

    h1, main {
        max-width: 540px;
        padding-left: 4rem;
        padding-right: 4rem;
        margin: auto;
    }

    @media (max-width: 320px) {
        h1 {
            font-size: 1.5em;
        }

        :global(h2) {
            font-size: 1.2em;
        }
    }

    @media (min-width: 970px) {
        h1, main {
            max-width: 900px;
            padding-left: 8rem;
            padding-right: 8rem;
        }
    }

    :global(html), :global(body) {
        width: 100%;
        height: 100%;
    }

    :global(body) {
        margin: 0;
        padding: 0;
        font-size: 1.6rem;
    }

    :global(h2) {
        margin-top: 4rem;
    }

    :global(fieldset) {
        display: flex;
        flex-direction: column;
        border: none;
        padding: 0;
        margin: 0;
    }
    
    :global(fieldset > legend) {
        display: none;
    }

    :global(pre) {
        max-width: 80%;
    }
</style>

<header>
    <h1>LSB Image Steganography</h1>
</header>

<main>
    <p>
        Encode/decode data into images using least significant bit (LSB) steganography,
        where the least significant bit of each RGB band in each pixel of the image is
        used to store a bit of the data to be encoded.
    </p>

    <EncodeDecode />
    <ImageSelector />
    
    {#if $encode}
        <Message />
    {/if}
    <EncodeDecodeButton />
    
    <Output />
</main>

