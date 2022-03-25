from PIL import Image
from math import ceil


class LSBImageSteganography:
    """
    Encodes/decodes a bytes message in an image using the least-significant bits
    of each pixel's RGB channels.
    """

    def __init__(self, filename):
        self.image = Image.open(filename)

        if self.image.mode != 'RGB':
            self.image = self.image.convert('RGB')

    def encode(self, message):
        """
        Encode `message` into the image.

        Raises `ValueError` if the message's length is too big to encode
        in the current image.
        """

        pixels = self.image.load()

        available_bits = self.image.width * self.image.height * 3

        # add the message length in bytes at the beginning
        message_length = len(message).to_bytes(
            ceil(len(message).bit_length() / 8), "big"
        )
        message_with_size = message_length + b"\x00" + message

        required_bits = len(message_with_size) * 8

        if required_bits > available_bits:
            raise ValueError("Image is not big enough to store the message")

        for i, byte in enumerate(message_with_size):
            for j in range(8):
                bit = (byte >> (7 - j)) & 1
                idx = i * 8 + j
                xy = ((idx // 3) % self.image.width, idx // (3 * self.image.width))
                color = pixels[xy][idx % 3]

                pixels[xy] = (
                    *pixels[xy][: idx % 3],
                    color | 1 if bit else color & ~1,
                    *pixels[xy][(idx % 3) + 1 :],
                )

    def decode(self):
        """
        Decodes the message in the image.

        Returns a `bytes` object with the decoded message.
        """

        pixels = self.image.load()

        size = None
        message = b""

        for i in range(self.image.width * self.image.height * 3):
            if size and len(message) >= size:
                break

            next_byte = 0
            for j in range(8):
                idx = i * 8 + j
                color = pixels[
                    (idx // 3) % self.image.width, idx // (3 * self.image.width)
                ][idx % 3]
                bit = color & 1
                next_byte += bit << (7 - j)

            if size is None and next_byte == 0:
                size = int.from_bytes(message, "big")
                message = b""

                if size == 0:
                    return b""
            else:
                message += bytes([next_byte])

        return message

    def save(self, filename, format):
        """
        Saves the current image.

        Saves to the path provided in `filename` or the original path from the
        constructor, with the format provided in `format` or the original
        format.
        """

        self.image.save(filename or self.filename, format or self.image.format)
