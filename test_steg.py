from lsb_image_steg import LSBImageSteganography
from unittest import TestCase


class TestSteg(TestCase):
    def test_short_message(self):
        steg = LSBImageSteganography('sample.jpg')
        steg.encode(b'test')
        self.assertEqual(steg.decode(), b'test')

    def test_long_message(self):
        message = b'abcd_dcba' * 10000
        steg = LSBImageSteganography('sample.jpg')
        steg.encode(message)
        self.assertEqual(steg.decode(), message)

    def test_empty(self):
        steg = LSBImageSteganography('sample.jpg')
        steg.encode(b'')
        self.assertEqual(steg.decode(), b'')

    def test_too_big(self):
        message = b'a' * 481500
        steg = LSBImageSteganography('sample.jpg')

        with self.assertRaises(ValueError) as e:
            steg.encode(message)
            self.assertEqual(str(e.exception), 'Image is not big enough to store the message')
