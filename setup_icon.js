const fs = require('fs');
const path = require('path');

// Source icon path
const sourceIcon = path.join(__dirname, 'src', 'assets', '2.png');

// Android mipmap directories and their required sizes
const mipmapDirs = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

const androidResPath = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

// Copy icon to all mipmap folders
mipmapDirs.forEach(({ dir, size }) => {
  const targetDir = path.join(androidResPath, dir);
  const targetIcon = path.join(targetDir, 'ic_launcher.png');
  const targetIconRound = path.join(targetDir, 'ic_launcher_round.png');
  
  // Ensure directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Copy icon (Android will handle scaling if needed)
  if (fs.existsSync(sourceIcon)) {
    fs.copyFileSync(sourceIcon, targetIcon);
    fs.copyFileSync(sourceIcon, targetIconRound);
    console.log(`✓ Copied icon to ${dir}`);
  } else {
    console.error(`✗ Source icon not found: ${sourceIcon}`);
  }
});

console.log('\n✅ Icon setup complete!');
console.log('Note: For best results, manually resize icons to exact sizes:');
mipmapDirs.forEach(({ dir, size }) => {
  console.log(`  ${dir}: ${size}x${size}px`);
});




