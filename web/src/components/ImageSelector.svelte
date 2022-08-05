<script>
    import { encode, image, imageFilename, output } from '../stores'
    import FileSelector from './FileSelector.svelte'
    import ImagePreview from './ImagePreview.svelte'
</script>

<style>
    span:first-of-type {
        font-weight: 600;
    }
</style>

<h2>Image</h2>

<fieldset name="image">
    <legend>image</legend>

    <FileSelector
        accept="image/*"
        on:clear={() => {
            if ($image?.src) {
                $imageFilename = ''
            }

            $output = undefined
        }}
        clearOnChange={encode}
    >
        <ImagePreview
            slot="content"
            alt="selected"
            let:file
            src={file}
            size="sm"
            file={true}
            on:beforeLoad={e => $imageFilename = e.detail.name || 'image'}
            on:load={e => $image = e.detail}
        />

        <svelte:fragment slot="message">
            <span>Drag and drop an image here</span>
            <span>Or click to choose a file</span>
        </svelte:fragment>

        <span slot="clearMsg">clear selected image</span>
    </FileSelector>
</fieldset>
