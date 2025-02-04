const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const svgPath = path.join(__dirname, '../public/icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Remplacer la couleur currentColor par du noir
const svgWithColor = svgContent.replace(/currentColor/g, '#000000');

async function generateIcons() {
  for (const size of sizes) {
    await sharp(Buffer.from(svgWithColor))
      .resize(size, size)
      .toFile(path.join(__dirname, `../public/icon-${size}x${size}.png`));
    
    console.log(`Generated ${size}x${size} icon`);
  }
}

generateIcons().catch(console.error); 