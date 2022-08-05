<script>
    // @ts-nocheck
    import { createEventDispatcher } from 'svelte'
    import Dropzone from 'svelte-file-dropzone'

    import Button from './Button.svelte'

    export let accept = undefined, small = false, clearOnChange

    const dispatch = createEventDispatcher()

    let file, container

    $: if ($clearOnChange !== undefined) {
        file = undefined
        dispatch('clear')
    }
</script>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3rem;
        max-width: 100%;
    }

    .container.small {
        gap: 1.5rem;
    }

    .container > span:first-of-type {
        font-weight: 600;
        max-width: 100%;
        margin: auto;
        align-self: flex-start;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    :global(.fileDropzone) {
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

    :global(.fileDropzone.small) {
        height: 12rem;
        gap: 1.5rem;
        padding: 1rem;
    }

    @media (max-width: 500px) {
        :global(.fileDropzone) {
            max-width: 100%;
        }
    }

    @media (min-width: 970px) {
        :global(.fileDropzone) {
            max-width: 30%;
        }

        :global(.fileDropzone.small) {
            max-width: 25%;
        }
    }
</style>

<Dropzone
    accept={accept}
    multiple={false}
    disableDefaultStyles={true}
    containerClasses={'fileDropzone' + (small ? ' small' : '')}
    on:drop={e => {
        file = e.detail?.acceptedFiles?.[0]
        dispatch('change', file)
    }}
>
    <div class="container" class:small bind:this={container}>
        <slot name="content" {file}>
            {#if file?.name}
                <span>{file.name}</span>
            {/if}
        </slot>

        {#if file}
            <Button on:click={e => {
                e.stopPropagation()
                container.parentNode?.blur()
                file = undefined

                dispatch('clear')
            }}>
                <slot name="clearMsg">clear selected file</slot>
            </Button>
        {:else}
            <slot name="message">
                <span>Drag and drop a file here</span>
                <span>Or click to choose</span>
            </slot>
        {/if}
    </div>
</Dropzone>
