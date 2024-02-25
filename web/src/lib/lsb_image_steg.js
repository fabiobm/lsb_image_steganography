// @ts-check

/**
 * Loads an image into a canvas.
 * 
 * Images with transparent/semi-transparent pixels should be avoided as the
 * encode function might create visual artifacts or changes in them
 *
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLImageElement} image
 */
export function loadImage(canvas, image) {
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    const ctx = canvas.getContext('2d')

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
}

/**
 * Encodes a message into the image in the canvas using LSB image steganography
 *
 * @param {HTMLCanvasElement} canvas
 * @param {string | Uint8Array} message
 */
export function encode(canvas, message) {
    const messageBytes = message instanceof Uint8Array ? message : new TextEncoder().encode(message)

    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    const availableBits = canvas.width * canvas.height * 3

    // add the message length in binary at the beginning
    const numBytes = messageBytes.length === 0
        ? 0
        : Math.ceil(Math.floor(Math.log2(messageBytes.length) + 1) / 8)
    const messageWithSize = new Uint8Array(new ArrayBuffer(numBytes + 1 + messageBytes.length))
    for (let i = 0; i < numBytes; i++) {
        messageWithSize[i] = (message.length >> ((numBytes - 1 - i) * 8)) & 0xff
    }

    messageWithSize[numBytes] = 0x0
    messageBytes.forEach((byte, i) => messageWithSize[numBytes + 1 + i] = byte)

    const requiredBits = messageWithSize.byteLength * 8

    if (requiredBits > availableBits) {
        throw new Error('Image is not big enough to store the message')
    }

    messageWithSize.forEach((byte, i) => {
        for (let j = 0; j < 8; j++) {
            const bit = (byte >> (7 - j)) & 1
            const idx = i * 8 + j

            // skip alpha channel bytes (RGBA -> every 4th item)
            const color = pixels[idx + Math.floor(idx / 3)]
            pixels[idx + Math.floor(idx / 3)] = bit ? color | 1 : color & ~1
        }
    })

    // set alpha channel bytes to 255 to avoid problems with
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/putImageData#data_loss_due_to_browser_optimization
    // (e.g.: https://stackoverflow.com/q/71230935)
    // note that this might create visual artifacts/changes when using images with transparency,
    // so it is not recommended to use them with these functions
    for (let i = 0; i < messageWithSize.length * 8 / 3; i++) {
        if (pixels[i * 4 + 3] !== 255) {
            pixels[i * 4 + 3] = 255
        }
    }

    ctx.putImageData(imageData, 0, 0)
}

/**
 * Decode the message in the canvas' image using LSB image steganography
 *
 * @param {HTMLCanvasElement} canvas
 * @param {boolean} [bytes=false] a flag indicating if the message is a string or raw bytes
 * @return {string | ArrayBuffer} 
 */
export function decode(canvas, bytes = false) {
    const ctx = canvas.getContext('2d')
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data

    let foundSeparator = false
    let size = null
    let bytesMessage = []

    for (let i = 0; i < canvas.width * canvas.height * 3; i++) {
        if (size && bytesMessage.length >= size) {
            break
        }

        let nextByte = 0
        for (let j = 0; j < 8; j++) {
            const idx = i * 8 + j

            // skip alpha channel bytes (RGBA -> every 4th item)
            const color = pixels[idx + Math.floor(idx / 3)]
            const bit = color & 1
            nextByte += bit << (7 - j)
        }

        if (size === null) {
            if (nextByte === 0) {
                foundSeparator = true
            } else if (foundSeparator) {
                if (bytesMessage.length === 0) {
                    return bytes ? new ArrayBuffer(0) : ''
                }

                size = 0
                for (let i = 0; i < bytesMessage.length - 1; i++) {
                    size = (size << 8) + bytesMessage[i]
                }
                bytesMessage = []

                if (size === 0) {
                    return bytes ? new ArrayBuffer(0) : ''
                }
            } else {
                let currentSize = 0
                for (let i = 0; i < bytesMessage.length; i++) {
                    currentSize = (currentSize << 8) + bytesMessage[i]
                }

                if (currentSize + bytesMessage.length + 1 > canvas.width * canvas.height * 3) {
                    throw new Error('No stored message found')
                }
            }
        }

        bytesMessage.push(nextByte)
    }

    const buffer = new Uint8Array(bytesMessage)
    return bytes ? buffer : new TextDecoder('utf-8').decode(buffer)
}
