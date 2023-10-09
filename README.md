# Image Processing with p5.js - InstagramFilters
It is demo I created using the p5.js image processing functions, i want to try and see if I can apply certain filter effects like those seen on Instagram or Photoshop with just using Javascripts.

### [Instructions]
This is a built using the p5.js library so therefore make sure that the p5 library is installed on your IDE(Visual Studio Code, etc..) before running the project. For VSCode users make sure to install the 'live-server' extension and right click the **index.html** file and choose the `Open with Live Server` option and the game will run on a HTML window on your browser. 

 - The method is to actually apply a `matrix` on the loaded image, each matrix will represent the pixel imformation of the image:
   1. Then take each matrix info and apply RGB values into them
   2. The old RGB values will be formated using the algorithm below to achieve a vintage look
```
// Algorithm provided
var newRed = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189);
var newGreen = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168);
var newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131);
```
 - There are also other effects such as `Vignetting`, `Convolution` and also `Blur`
 - The Greyscale effect is done by inverting the matrix and applying black to all the white parts and vice versa

![2023-10-10 02_00_19-Greenshot](https://github.com/RoninSanta/ImageProcessing_with_p5.js-InstagramFilters/assets/109457795/c8c16d69-f873-4c26-af2a-5a4dd0581c2a)

