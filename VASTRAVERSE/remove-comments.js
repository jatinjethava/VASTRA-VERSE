const fs = require('fs');
const glob = require('glob');
const strip = require('strip-comments');

const files = glob.sync('src/**/*.{js,jsx,ts,tsx}');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove JSX comments: {/* ... */}
    content = content.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');

    // 2. Remove HTML comments if any
    content = content.replace(/<!--[\s\S]*?-->/g, '');

    // 3. Use strip-comments to safely remove // and /* */ without breaking strings/URLs
    try {
        content = strip(content);
        fs.writeFileSync(file, content, 'utf8');
    } catch (e) {
        console.error("Error stripping comments from: " + file, e);
    }
});
console.log("Finished removing comments from " + files.length + " files.");
