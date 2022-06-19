<script>
    import { message } from '../stores'
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

<p>Enter the message to be encoded</p>

<fieldset name="message">
    <legend>message</legend>

    <textarea bind:value={$message}></textarea>
</fieldset>