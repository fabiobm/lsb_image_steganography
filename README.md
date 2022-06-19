# LSB Image Steganography

Python and JS implementations of the Least Significant Bit (LSB)
Image Steganography method.

## Python

The dependencies for the Python version can be installed with
`pip install -r requirements.txt`.

The implementation is all in the [lsb_image_steg.py](lsb_image_steg.py) file;
it can be used by importing
(e.g.: `from lsb_image_steg import LSBImageSteganography`) and then
instantiating the class with the image where the data will be encoded/
from which it will be decoded (`lsb = new LSBImageSteganography('image.png')`)
and using its `encode` and `decode` methods. The parameters are documented in
the source code. When encoding new data, the image can be saved with the
`save` method.

The [test_steg.py](test_steg.py) file contains the unit tests for the
implementation and can be run with `python3 -m unittest test_steg.py`.

## JS

The main implementation is in pure JS in the
[lsb_image_steg.js](web/src/lib/lsb_image_steg.js) file, from which the
`loadImage`, `encode` and `decode` functions can be imported and used.
The parameters are documented in the source code. Note that `loadImage` must
be called first, to load the image into a canvas (if running on Node, the
`node-canvas` library is a dependency), and then data can be encoded into/
decoded from the image in the canvas.

Although the functions will execute without errors when using them, images
containing an alpha channel are not recommended, as they can impact the
performance and generate outputs with visual artifacts or changes.

There's also a web app
(available [here](https://fabiobm.github.io/lsb_image_steganography)) with an
interface for applying the steganography method, implemented in Svelte.
To run this app, first install the dependencies with `npm i` then use the
dev server with `npm run dev`, or use `npm run build` to generate the bundle
or `npm run preview` to better test it.
