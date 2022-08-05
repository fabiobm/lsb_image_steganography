import { writable } from 'svelte/store'

export const encode = writable(true)
export const encodeType = writable('text')
export const error = writable()
export const message = writable('')
export const image = writable()
export const imageFilename = writable()
export const decodeFile = writable(false)
export const output = writable()
