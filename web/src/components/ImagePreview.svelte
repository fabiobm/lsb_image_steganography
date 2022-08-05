<script>
    import { createEventDispatcher } from 'svelte'

    let imageEl, hidden = true, loading = false

    export let alt, src, size, file = false

    const dispatch = createEventDispatcher()

    async function load(src) {
        dispatch('beforeLoad', src)

        hidden = true
        loading = true

        const url = file ? URL.createObjectURL(src) : src
        await new Promise(resolve => {
            imageEl.onload = () => {
                if (file) URL.revokeObjectURL(url)
                loading = false

                dispatch('load', imageEl)

                resolve()
            }

            imageEl.src = url
            hidden = false
        })
    }

    $: src ? load(src) : hidden = true
</script>

<style>
    img {
        border: 2px solid black;
        border-radius: 6px;
        object-fit: cover;
    }

    img.sm {
        width: 12rem;
        height: 12rem;
    }

    img.md {
        width: 18rem;
        height: 18rem;
    }

    img.lg {
        width: 24rem;
        height: 24rem;
    }

    img.hidden {
        display: none;
    }
</style>

<img bind:this={imageEl} alt={loading ? 'loading...' : alt} class:hidden class={size} />
