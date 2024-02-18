from lsb_image_steg import BytesIO, Image, LSBImageSteganography
from unittest import TestCase, main


class TestSteg(TestCase):
    def test_short_message(self):
        steg = LSBImageSteganography("sample.jpg")
        steg.encode(b"test")
        self.assertEqual(steg.decode(), b"test")

    def test_long_message(self):
        message = b"abcd_dcba" * 10000
        steg = LSBImageSteganography("sample.jpg")
        steg.encode(message)
        self.assertEqual(steg.decode(), message)

    def test_size_ending_with_zero_byte(self):
        message = b"a" * 256
        steg = LSBImageSteganography("sample.jpg")
        steg.encode(message)
        self.assertEqual(steg.decode(), message)

    def test_empty(self):
        steg = LSBImageSteganography("sample.jpg")
        steg.encode(b"")
        self.assertEqual(steg.decode(), b"")

    def test_no_message_artificial_value(self):
        # create 'artificial' image with pixels forming a message even though it wasn't encoded
        image = Image.new("RGB", (4, 2), 1)
        image.putdata([
            (10, 20, 30), (40, 50, 60), (70, 81, 90), (100, 110, 120),
            (130, 140, 150), (160, 170, 181), (191, 200, 211), (220, 231, 241)
        ])
        ba = BytesIO()
        image.save(ba, 'PNG')

        steg = LSBImageSteganography('test', ba.getvalue())
        self.assertEqual(steg.decode(), b"\x6b")

    def test_too_big(self):
        message = b"a" * 481500
        steg = LSBImageSteganography("sample.jpg")

        with self.assertRaises(ValueError) as e:
            steg.encode(message)
            self.assertEqual(
                str(e.exception), "Image is not big enough to store the message"
            )


if __name__ == "__main__":
    main()
