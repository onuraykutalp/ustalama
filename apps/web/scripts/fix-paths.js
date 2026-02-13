const fs = require('fs');
const path = require('path');

function fixPaths(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      fixPaths(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Calculate relative path depth
      const depth = filePath.split(path.sep).length - dir.split(path.sep).length - 1;
      const relativePrefix = depth > 0 ? '../'.repeat(depth) : './';
      
      // Replace absolute paths with relative paths
      content = content.replace(/href="\/_next\//g, `href="${relativePrefix}_next/`);
      content = content.replace(/src="\/_next\//g, `src="${relativePrefix}_next/`);
      content = content.replace(/url\(/_next\//g, `url(${relativePrefix}_next/`);
      content = content.replace(/url\("\/_next\//g, `url("${relativePrefix}_next/`);
      content = content.replace(/url\('\/_next\//g, `url('${relativePrefix}_next/`);
      
      // Fix image paths
      content = content.replace(/src="\/(?!\/)/g, `src="${relativePrefix}`);
      content = content.replace(/href="\/(?!\/)/g, `href="${relativePrefix}`);
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed paths in: ${filePath}`);
    } else if (file.endsWith('.css')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Calculate relative path depth for CSS files
      const depth = filePath.split(path.sep).length - dir.split(path.sep).length - 1;
      const relativePrefix = depth > 0 ? '../'.repeat(depth) : './';
      
      // Fix font and image URLs in CSS
      content = content.replace(/url\(/_next\//g, `url(${relativePrefix}_next/`);
      content = content.replace(/url\("\/_next\//g, `url("${relativePrefix}_next/`);
      content = content.replace(/url\('\/_next\//g, `url('${relativePrefix}_next/`);
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed paths in CSS: ${filePath}`);
    }
  });
}

const outDir = path.join(__dirname, '../out');
if (fs.existsSync(outDir)) {
  console.log('Fixing paths for local file access...');
  fixPaths(outDir);
  console.log('Done! You can now open HTML files directly.');
} else {
  console.error('out directory not found. Run "pnpm build" first.');
  process.exit(1);
}

