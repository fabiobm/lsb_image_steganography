<script>
    // @ts-nocheck
    import { encode, image, imageFilename, output } from '../stores'
    import Button from './Button.svelte'
    import ImagePreview from './ImagePreview.svelte'
    import Dropzone from 'svelte-file-dropzone'

    let file

    $: if ($encode !== undefined) {
        file = undefined
    }
</script>

<style>
    :global(.imageDropzone) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3rem;
        height: 18rem;
        max-width: 50%;
        padding: 2rem;
        border: 2px dashed #ccc;
        border-radius: 8px;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
    }

    span:first-of-type {
        font-weight: 600;
    }

    @media (max-width: 500px) {
        :global(.imageDropzone) {
            max-width: 100%;
        }
    }

    @media (min-width: 970px) {
        :global(.imageDropzone) {
            max-width: 30%;
        }
    }
</style>

<h2>Image</h2>

<fieldset name="image">
    <legend>image</legend>

    <Dropzone
        accept="image/*"
        multiple={false}
        disableDefaultStyles={true}
        containerClasses="imageDropzone"
        on:drop={e => (file = e.detail?.acceptedFiles?.[0])}
    >
        <ImagePreview
            alt="selected"
            src={file}
            size="sm"
            file={true}
            on:beforeLoad={e => $imageFilename = e.detail.name}
            on:load={e => $image = e.detail}
        >
            <svelte:fragment slot="before" let:hidden>
                {#if hidden}
                    <span>Drag and drop an image here</span>
                    <span>Or click to choose a file</span>
                {/if}
            </svelte:fragment>

            <svelte:fragment slot="after" let:hidden>
                {#if !hidden}
                    <Button on:click={e => {
                        e.stopPropagation();
                        $image.src = ''
                        file = undefined;
                        $output = undefined;

                        $image.parentNode.blur()
                    }}>clear selected image</Button>
                {/if}
            </svelte:fragment>
        </ImagePreview>
    </Dropzone>
</fieldset>
