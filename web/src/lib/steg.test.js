import { createCanvas, loadImage as load, createImageData } from 'canvas'
import { beforeEach, expect, test } from 'vitest'

import { encode, decode, loadImage } from './lsb_image_steg'

let canvas
let image

beforeEach(async () => {
    canvas = createCanvas(200, 200)
    image = await load('../sample.jpg')
})

test('short message', () => {
    loadImage(canvas, image)

    encode(canvas, 'test')
    expect(decode(canvas)).toEqual('test')

    encode(canvas, new Uint8Array([116, 101, 115, 116]))
    expect(new TextDecoder('utf-8').decode(decode(canvas, true))).toEqual('test')
})

test('long message', () => {
    const message = repeat('abcd_dcba', 10000)
    const messageBytes = repeat('abcd_dcba', 10000, true)

    loadImage(canvas, image)

    encode(canvas, message)
    expect(decode(canvas)).toEqual(message)

    encode(canvas, messageBytes)
    expect(new TextDecoder('utf-8').decode(decode(canvas, true))).toEqual(message)
})

test('size ending with zero byte', () => {
    const message = repeat('a', 256)
    const bytesMessage = repeat('a', 256, true)

    loadImage(canvas, image)

    encode(canvas, message)
    expect(decode(canvas)).toEqual(message)

    encode(canvas, bytesMessage)
    expect(new TextDecoder('utf-8').decode(decode(canvas, true))).toEqual(message)
})

test('empty', () => {
    loadImage(canvas, image)

    encode(canvas, '')
    expect(decode(canvas)).toEqual('')

    encode(canvas, new Uint8Array([]))
    expect(new TextDecoder('utf-8').decode(decode(canvas, true))).toEqual('')
})

test('no message artificial value', async () => {
    const canvas2 = createCanvas(4, 2)
    const ctx = canvas2.getContext('2d')

    // create 'artificial' image with pixels forming a message even though it wasn't encoded
    const imageData = createImageData(new Uint8ClampedArray([
        10, 20, 30, 255,    40, 50, 60, 255,    70, 81, 90, 255,    100, 110, 120, 255,
        130, 140, 150, 255,    160, 170, 181, 255,    191, 200, 211, 255,    220, 231, 241, 255
    ]), 4, 2)
    ctx.putImageData(imageData, 0, 0)
    const buffer = canvas2.toBuffer('image/png')
    const artificialImage = await load(buffer)

    loadImage(canvas, artificialImage)

    expect(decode(canvas)).toEqual('k')
    expect(new TextDecoder('utf-8').decode(decode(canvas, true))).toEqual('k')
})

test('no message heuristic', () => {
    loadImage(canvas, image)

    const error = new Error('No stored message found')

    expect(() => decode(canvas)).toThrow(error)
    expect(() => decode(canvas, true)).toThrow(error)
})

test('too big', () => {
    const message = repeat('a', 481500)
    const messageBytes = repeat('a', 481500, true)

    loadImage(canvas, image)

    const error = new Error('Image is not big enough to store the message')

    expect(() => encode(canvas, message)).toThrow(error)
    expect(() => encode(canvas, messageBytes)).toThrow(error)
})


function repeat(message, times, bytes = false) {
    return bytes
        ? new Uint8Array(
            [...Array(times * message.length).keys()].map(i => message.charCodeAt(i % message.length))
        )
        : Array(times + 1).join(message)
}
