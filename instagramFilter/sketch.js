// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var imgFilter;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];

/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
    imgFilter = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    fill(0);
    textSize(20);
    text("Original Image: ", width/4,40);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    // Text Instructions
    text("Filtered Image: ", width-350,40);
    textAlign(CENTER);
    textSize(16);
    noStroke();
    fill(0);
    rect(0,height-80,width/2, 80);
    fill(255);
    text("Click Mouse => Sepia effect with the radial blur and dark corners", width/4,height-60);
    text("Press 1 => Grey Scale Filter", width/4,height-40);
    text("Press 2 => Invert Colours Filter ", width/4,height-20);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
      resultImg = sepiaFilter(resultImg);
      resultImg = darkCorners(resultImg);
      resultImg = radialBlurFilter(resultImg);
      resultImg = borderFilter(resultImg);
  return resultImg;
}
// Step 1.
function sepiaFilter(resultImg){
  imgIn.loadPixels();
  resultImg.loadPixels();

  for(var x = 0; x < resultImg.width; x++){
    for(var y = 0; y < resultImg.height; y++){
      var pixelIndex = ((resultImg.width * y) + x)*4;
      var oldRed = imgIn.pixels[pixelIndex + 0];
      var oldGreen = imgIn.pixels[pixelIndex + 1];
      var oldBlue = imgIn.pixels[pixelIndex + 2];

      // Algorithm provided
      var newRed = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189);
      var newGreen = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168);
      var newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131);

      resultImg.pixels[pixelIndex + 0] = newRed;
      resultImg.pixels[pixelIndex + 1] = newGreen;
      resultImg.pixels[pixelIndex + 2] = newBlue;
      resultImg.pixels[pixelIndex + 3] = 255;
    } 
  } 
  resultImg.updatePixels();
  return resultImg;
}
//Step 2. Vignetting
function darkCorners(resultImg){
  var midX = resultImg.width/2;
  var midY = resultImg.height/2;
  var maxDist = abs(dist(0,0,midX,midY));

  for(var x = 0; x < resultImg.width; x++){
    for(var y = 0; y < resultImg.height; y++){
      var d = abs(dist(x,y,midX,midY));
      if(d>= 300){
        var pixelIndex = ((resultImg.width * y) + x)*4;
        var oldRed = resultImg.pixels[pixelIndex + 0];
        var oldGreen = resultImg.pixels[pixelIndex + 1];
        var oldBlue = resultImg.pixels[pixelIndex + 2];
        var dynLum = 1;
        if(d<450){// 300 to 449
          dynLum = map(d,300,449,1,0.4);
        }
        else{
          dynLum = map(d,450,maxDist,0.4,0);
        }
        var newRed = oldRed*dynLum;
        var newGreen = oldGreen*dynLum;
        var newBlue = oldBlue*dynLum;
        
        resultImg.pixels[pixelIndex + 0] = newRed;
        resultImg.pixels[pixelIndex + 1] = newGreen;
        resultImg.pixels[pixelIndex + 2] = newBlue;
        resultImg.pixels[pixelIndex + 3] = 255;
      }
    }
  }
  resultImg.updatePixels();
  return resultImg;
}
// Convolution function
function convolution(x, y, matrix, matrixSize, img) {
  var totalRed = 0.0;
  var totalGreen = 0.0;
  var totalBlue = 0.0;
  var offset = floor(matrixSize / 2);

  // convolution matrix loop
  for (var i = 0; i < matrixSize; i++) {
      for (var j = 0; j < matrixSize; j++) {
          // Get pixel loc within convolution matrix
          var xloc = x + i - offset;
          var yloc = y + j - offset;
          var index = (xloc + img.width * yloc) * 4;
          // ensure we don't address a pixel that doesn't exist
          index = constrain(index, 0, img.pixels.length - 1);

          // multiply all values with the mask and sum up
          totalRed += img.pixels[index + 0] * matrix[i][j];
          totalGreen += img.pixels[index + 1] * matrix[i][j];
          totalBlue += img.pixels[index + 2] * matrix[i][j];
      }
  }
  // return the new color as an array
  return [totalRed, totalGreen, totalBlue];
}
//Step 3. RadialBlurFilter
function radialBlurFilter(resultImg){
  
  for(var x = 0; x < resultImg.width; x++){
    for(var y = 0; y < resultImg.height; y++){
        var pixelIndex = ((resultImg.width * y) + x)*4;
        var oldRed = resultImg.pixels[pixelIndex + 0];
        var oldGreen = resultImg.pixels[pixelIndex + 1];
        var oldBlue = resultImg.pixels[pixelIndex + 2];
        //c[0] => red, c[1] => green, c[2] => blue
        var c = convolution(x,y,matrix,matrix.length,resultImg);

        var mouseDist = abs(dist(x,y,mouseX,mouseY));
        var dynBlur = map(mouseDist,100,300,0,1);
        dynBlur = constrain(dynBlur,0,1);

        // Formula provided
        var newRed = c[0]*dynBlur + oldRed*(1-dynBlur);
        var newGreen = c[1]*dynBlur + oldGreen*(1-dynBlur);
        var newBlue = c[2]*dynBlur + oldBlue*(1-dynBlur);

        resultImg.pixels[pixelIndex + 0] = newRed;
        resultImg.pixels[pixelIndex + 1] = newGreen;
        resultImg.pixels[pixelIndex + 2] = newBlue;
        resultImg.pixels[pixelIndex + 3] = 255;
      }
  }
  resultImg.updatePixels();
  return resultImg;
}
//Step 4. Create Border Filter
function borderFilter(resultImg){
  //Draw the img onto the buffer 
  var buffer = createGraphics(resultImg.width,resultImg.height);
  buffer.image(resultImg,0,0,resultImg.width,resultImg.height);
  //Draw a big, fat, white rectangle with rounded corners around the image. 
  buffer.noFill();
  buffer.stroke(255);
  buffer.strokeWeight(20);
  buffer.rect(0,0,resultImg.width,resultImg.height,50);
  //Draw another rectangle now, without rounded corners
  buffer.rect(0,0,resultImg.width,resultImg.height);
  return buffer;
}
////////////// Step 5. Further Filter Development ////////////////////////
function keyPressed(){
  if (keyCode == 49) {
    console.log("GRAY SCALE")
    //Grey Scale Filer when pressed "1"
    greyScale();
  } 
  if (keyCode == 50) {
    console.log("Invert Colours Filter")
    //Invert Colours Filters when pressed "2"
    invertFilter();
  }
}
function greyScale(){
  imgFilter.filter(GRAY);
  image(imgFilter, imgFilter.width, 0);
  fill(0);
  textSize(20);
  text("Grey Scale Filter: ", width-350,40);
  noLoop();
}
function invertFilter(){
  imgFilter.filter(INVERT);
  image(imgFilter, imgFilter.width, 0);
  fill(255);
  textSize(20);
  text("INVERT Image Filter: ", width-350,40);
  noLoop();
}