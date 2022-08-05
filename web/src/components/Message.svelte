<script>
    import { encodeType, message } from '../stores'
    import FileSelector from './FileSelector.svelte'
    import RadioButtonGroup from './RadioButtonGroup.svelte'

    async function readFromFile(e) {
        const fileReader = new FileReader()

        await new Promise((resolve, reject) => {
            fileReader.onload = () => {
                // @ts-ignore
                $message = fileReader.result
                resolve()
            }

            fileReader.onerror = () => reject(fileReader.error)

            fileReader.readAsArrayBuffer(e.detail)
        })
    }

    $: if ($encodeType !== 'undefined') {
        $message = ''
    }
</script>

<style>
    textarea {
        height: 6rem;
        max-width: 80%;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0.4rem 0.8rem;
        margin-left: 0;
    }

    .container {
        display: flex;
		flex-direction: column;
		user-select: none;
		-webkit-user-select: none;
    }

    .container.encodeFile {
        margin-bottom: 2.5rem;
    }

    @media (max-width: 320px) {
        textarea {
            max-width: 100%;
        }
    }

    @media (min-width: 970px) {
        textarea {
            max-width: 70%;
        }
    }
</style>

<h2>Message</h2>

<fieldset name="message">
    <legend>message</legend>

    <p>Choose whether to encode a plain text message or a file</p>

    <div class="container" class:encodeFile={$encodeType === 'file'}>
        <RadioButtonGroup
            group={encodeType}
            items={[
                { value: 'text', label: 'Plain text' },
                { value: 'file', label: 'File' }
            ]}
        />
    </div>

    {#if $encodeType === 'text'}
        <p>Enter the message to be encoded</p>

        <textarea bind:value={$message}></textarea>
    {:else}
        <FileSelector
            small={true}
            on:change={readFromFile}
            on:clear={() => ($message = '')}
            clearOnChange={encodeType}
        />
    {/if}
</fieldset>