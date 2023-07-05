// imports~
const sharp = require('sharp');


// Variables to be edited

    // Width and height of the image

        const width = 512;
        const height = 512;

    // Image size using sharp

        const imgSize = 512;
    
    // Perlin Options (Octave Count, Amplitude, Persistence)

        const OTC = 18;                                         
        const AMP = 0.6;
        const PER = 0.8;                                         


// Generating perlin noise

function generatePerlinNoise(width, height, options) {

    options = options || {};

    var octaveCount = options.octaveCount || 4;
    var amplitude = options.amplitude || 0.1;
    var persistence = options.persistence || 0.2;
    var whiteNoise = generateWhiteNoise(width, height);
  
    var smoothNoiseList = new Array(octaveCount);
    var i;

    for (i = 0; i < octaveCount; ++i) {

      smoothNoiseList[i] = generateSmoothNoise(i);

    }

    var perlinNoise = new Array(width * height);
    var totalAmplitude = 0;

    for (i = octaveCount - 1; i >= 0; --i) {

      amplitude *= persistence;
      totalAmplitude += amplitude;
  
      for (var j = 0; j < perlinNoise.length; ++j) {

        perlinNoise[j] = perlinNoise[j] || 0;
        perlinNoise[j] += smoothNoiseList[i][j] * amplitude;

      }

    }

    for (i = 0; i < perlinNoise.length; ++i) {

        perlinNoise[i] /= totalAmplitude;

    }
  
    return perlinNoise;
  


function generateSmoothNoise(octave) {

      var noise = new Array(width * height);
      var samplePeriod = Math.pow(2, octave);
      var sampleFrequency = 1 / samplePeriod;
      var noiseIndex = 0;

      for (var y = 0; y < height; ++y) {

        var sampleY0 = Math.floor(y / samplePeriod) * samplePeriod;
        var sampleY1 = (sampleY0 + samplePeriod) % height;
        var vertBlend = (y - sampleY0) * sampleFrequency;

        for (var x = 0; x < width; ++x) {

          var sampleX0 = Math.floor(x / samplePeriod) * samplePeriod;
          var sampleX1 = (sampleX0 + samplePeriod) % width;
          var horizBlend = (x - sampleX0) * sampleFrequency;
  
          var top = lerp(whiteNoise[sampleY0 * width + sampleX0], whiteNoise[sampleY1 * width + sampleX0], vertBlend);
          var bottom = lerp(whiteNoise[sampleY0 * width + sampleX1], whiteNoise[sampleY1 * width + sampleX1], vertBlend);

          noise[noiseIndex] = lerp(top, bottom, horizBlend);
          noiseIndex += 1;

        }
      }

      return noise;

    }
  }



function generateWhiteNoise(width, height) {

    var noise = new Array(width * height);

    for (var i = 0; i < noise.length; ++i) {

      noise[i] = Math.random();

    }

    return noise;

}



function lerp(x0, x1, y) {

    return x0 * (1 -y) + y * x1;

}


const data = generatePerlinNoise(width, height, {

    octaveCount: OTC,
    amplitude: AMP,
    persistence: PER,

});

// Creating a new image using sharp

const imageBuff = Buffer.alloc(imgSize * imgSize * 3);

// Pixel color from array

for (let y = 0; y < imgSize; y++) {
    for(let x = 0; x < imgSize; x++) {
        const index = Math.floor(y * imgSize + x) * 3;
        const value = data[Math.floor(y / (imgSize / height)) * width + Math.floor(x / (imgSize / width))];
        const color = Math.floor(value * 255);
        
        imageBuff[index + 0] = color; 
        imageBuff[index + 1] = color;   // 0 = R 1 = B 2 = G
        imageBuff[index + 2] = color;

    }


}

// Save image to dir

 sharp(imageBuff, {
    raw: {
        width: imgSize,
        height: imgSize,
        channels: 3,
    },
 })
    .toFile("Noise " + OTC + "-" + AMP + "-" + PER + " " + width + "x" + height + ".png")
    .then(() => {
        console.log("Image has been saved! ");
     })
    .catch((err) =>{
        console.log("Couldnt save the image correctly.", err)
    });
