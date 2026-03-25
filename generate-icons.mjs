import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = './public';

async function generateIcons() {
  try {
    const svgPath = path.join(publicDir, 'favicon.svg');
    
    if (!fs.existsSync(svgPath)) {
      console.error('SVG favicon not found!');
      process.exit(1);
    }

    console.log('Generating PNG icons from SVG...\n');

    // Generate 192x192 icon
    await sharp(svgPath)
      .png()
      .resize(192, 192, { fit: 'contain', background: { r: 139, g: 92, b: 246, alpha: 1 } })
      .toFile(path.join(publicDir, 'icon-192x192.png'));
    console.log('✓ Generated icon-192x192.png');

    // Generate 512x512 icon
    await sharp(svgPath)
      .png()
      .resize(512, 512, { fit: 'contain', background: { r: 139, g: 92, b: 246, alpha: 1 } })
      .toFile(path.join(publicDir, 'icon-512x512.png'));
    console.log('✓ Generated icon-512x512.png');

    // Generate smaller favicons
    await sharp(svgPath)
      .png()
      .resize(32, 32, { fit: 'contain', background: { r: 139, g: 92, b: 246, alpha: 1 } })
      .toFile(path.join(publicDir, 'favicon-32x32.png'));
    console.log('✓ Generated favicon-32x32.png');

    console.log('\n✓ Icon generation complete!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

generateIcons();
