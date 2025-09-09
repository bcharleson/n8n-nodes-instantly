#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🚀 Installing n8n-nodes-instantly to development environment...');

// Define paths
const sourceDir = path.join(__dirname, 'dist', 'src');
const customDir = path.join(os.homedir(), '.n8n-dev', '.n8n', 'custom');

// Create custom directory structure
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
};

// Copy file with error handling
const copyFile = (src, dest) => {
  try {
    const destDir = path.dirname(dest);
    createDir(destDir);
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied: ${path.basename(src)}`);
  } catch (error) {
    console.error(`❌ Failed to copy ${src}: ${error.message}`);
  }
};

// Copy directory recursively
const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) {
    console.error(`❌ Source directory doesn't exist: ${src}`);
    return;
  }
  
  createDir(dest);
  const items = fs.readdirSync(src);
  
  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  });
};

try {
  // Create main directories
  createDir(customDir);
  createDir(path.join(customDir, 'nodes'));
  createDir(path.join(customDir, 'credentials'));

  // Copy credentials
  const credSrc = path.join(sourceDir, 'credentials');
  const credDest = path.join(customDir, 'credentials');
  console.log('\n📁 Copying credentials...');
  copyDir(credSrc, credDest);

  // Copy nodes
  const nodesSrc = path.join(sourceDir, 'nodes');
  const nodesDest = path.join(customDir, 'nodes');
  console.log('\n📁 Copying nodes...');
  copyDir(nodesSrc, nodesDest);

  console.log('\n🎉 Installation complete!');
  console.log('📍 Files installed to:', customDir);
  console.log('🔄 Please refresh your n8n browser tab to load the new node');
  console.log('🔍 Search for "Instantly" in the node palette');

} catch (error) {
  console.error('❌ Installation failed:', error.message);
  process.exit(1);
}
