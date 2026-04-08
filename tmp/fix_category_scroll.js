const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/components/home/HomeView.js');
let content = fs.readFileSync(file, 'utf8');

let changes = 0;

// Remove scale from image entirely - this is what causes the "jumping" on filter change
// The dark overlay (already present) is enough hover feedback
const old1 = 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform';
const new1 = 'w-full h-full object-cover transition-opacity duration-300';
if (content.includes(old1)) {
  content = content.replace(old1, new1);
  changes++;
  console.log('✓ Removed image scale animation (root cause of movement)');
}

// Also remove the floating action button translate-y-12 which can cause visual shift on mount
const old2 = 'translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700';
const new2 = 'opacity-0 group-hover:opacity-100 transition-opacity duration-300';
if (content.includes(old2)) {
  content = content.replace(old2, new2);
  changes++;
  console.log('✓ Simplified floating action button animation (removed translate-y shift)');
}

fs.writeFileSync(file, content, 'utf8');
console.log(`\nDone. Applied ${changes}/2 changes.`);
