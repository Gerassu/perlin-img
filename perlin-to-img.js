// imports~
const perlin = require('perlin-noise');
const sharp = require('sharp');


// Variables to be edited

    // Width and height of the image

        const width = 32;
        const height = 32;

    // Image size using sharp

        const imgSize = 1024;
    
    // Perlin Options (Octave Count, Amplitude, Persistence)

        const OTC = 3;                                          // 1 - 32
        const AMP = 0.8;
        const PER = 0.4;                                         // 0.1 - 1 


// Generating a perlin noise

const data = perlin.generatePerlinNoise(width, height, {
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
        imageBuff[index + 1] = color;
        imageBuff[index + 2] = color

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
    .toFile("noise " + OTC + "-" + AMP + "-" + PER + " " + width + "x" + height + ".png")
    .then(() => {
        console.log("Image saved!");
     })
    .catch((err) =>{
        console.log("Couldnt save the image correctly.", err)
    });
