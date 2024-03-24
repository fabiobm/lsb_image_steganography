import numpy as np
from PIL import Image, ImageCms
from io import BytesIO
from math import ceil


class LSBImageSteganography:
    """
    Encodes/decodes a bytes message in an image using the least-significant bits
    of each pixel's RGB channels.
    """

    def __init__(self, filename, img_bytes=None):
        if img_bytes is not None and isinstance(img_bytes, bytes):
            self.image = Image.open(BytesIO(img_bytes))
        else:
            self.image = Image.open(filename)

        if self.image.mode != "RGB":
            self.image = self.image.convert("RGB")

        if "icc_profile" in self.image.info:
            self.image = ImageCms.profileToProfile(
                self.image,
                BytesIO(self.image.info["icc_profile"]),
                ImageCms.createProfile("sRGB"),
            )

    def encode(self, message):
        """
        Encodes a bytes `message` into the image.

        Raises `ValueError` if the message's length is too big to encode
        in the current image.
        """

        pixels = np.array(self.image).flatten()

        available_bits = self.image.width * self.image.height * 3

        # add the message length in binary at the beginning
        message_length = len(message).to_bytes(
            ceil(len(message).bit_length() / 8), "big"
        )
        message_with_size = message_length + b"\x00" + message

        required_bits = len(message_with_size) * 8

        if required_bits > available_bits:
            raise ValueError("Image is not big enough to store the message")

        encoded_data = (pixels[:required_bits] & ~1) | [int(bit) for byte in message_with_size for bit in f'{byte:08b}']
        encoded_data = [(
            encoded_data[i],
            encoded_data[i + 1] if i + 1 < len(encoded_data) else pixels[i + 1],
            encoded_data[i + 2] if i + 2 < len(encoded_data) else pixels[i + 2]
        ) for i in range(0, len(encoded_data), 3)]

        self.image.putdata(encoded_data)

    def decode(self):
        """
        Decodes the message in the image.

        Returns a `bytes` object with the decoded message.
        """
        pixels = np.array(self.image).flatten()
        image_size = self.image.width * self.image.height

        found_separator = False
        size = None
        message = b""

        for i in range(image_size * 3):
            if size:
                break

            next_byte = 0
            for j in range(8):
                idx = i * 8 + j
                if idx // 3 >= image_size:
                    return message
                color = pixels[idx]
                bit = color & 1
                next_byte += bit << (7 - j)

            if next_byte == 0:
                found_separator = True
            elif found_separator:
                size = int.from_bytes(message[:-1], "big")
                message = b""

                if size == 0:
                    return b""
            elif int.from_bytes(message, "big") + len(message) + 1 > image_size * 3:
                raise ValueError("No stored message found")

            message += bytes([next_byte])

        size_length = ceil(size.bit_length() / 8)
        lsbs = pixels[(size_length + 1) * 8:(size + size_length + 1) * 8] & 1

        binary_message = ''.join(map(str, lsbs))
        message = bytes([int(binary_message[i:i + 8], 2) for i in range(0, len(binary_message), 8)])

        return message

    def save(self, filename, format):
        """
        Saves the current image.

        Saves to the path or bytearray provided in `filename` or the
        original path from the constructor, with the format provided in
        `format` or the original format.
        """

        self.image.save(
            filename or self.filename,
            format=format or self.image.format,
            icc_profile=self.image.info.get("icc_profile", ""),
        )
