import { writable } from 'svelte/store'

export const encode = writable(true)
export const message = writable('')
export const image = writable()
export const imageFilename = writable()
export const output = writable()
