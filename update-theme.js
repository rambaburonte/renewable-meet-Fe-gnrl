const fs = require('fs');
const path = require('path');

// Directory to recursively search
const srcDir = path.join(__dirname, 'src');

// Color replacements
const replacements = [
  { from: 'text-amber-', to: 'text-green-' },
  { from: 'bg-amber-', to: 'bg-green-' },
  { from: 'border-amber-', to: 'border-green-' },
  { from: 'ring-amber-', to: 'ring-green-' },
  { from: 'focus-visible:ring-amber-', to: 'focus-visible:ring-green-' },
  { from: 'hover:bg-amber-', to: 'hover:bg-green-' },
  { from: 'hover:text-amber-', to: 'hover:text-green-' },
  { from: 'group-hover:text-amber-', to: 'group-hover:text-green-' },
  { from: 'from-amber-', to: 'from-green-' },
  { from: 'to-orange-', to: 'to-emerald-' },
  { from: 'border-t-4 border-blue-', to: 'border-t-4 border-emerald-' }
];

// File extensions to process
const extensions = ['.tsx', '.ts', '.js', '.jsx'];

// Function to recursively process files in a directory
function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      processDirectory(filePath);
    } else if (stats.isFile() && extensions.includes(path.extname(file))) {
      processFile(filePath);
    }
  }
}

// Function to process a single file
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  for (const { from, to } of replacements) {
    const originalContent = content;
    content = content.replace(new RegExp(from, 'g'), to);
    
    if (content !== originalContent) {
      hasChanges = true;
      console.log(`  Replaced "${from}" with "${to}"`);
    }
  }
  
  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Updated file ${filePath}`);
  }
}

// Start processing
console.log('Starting theme color update...');
processDirectory(srcDir);
console.log('Theme update complete!');
