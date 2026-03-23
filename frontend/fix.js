const fs = require('fs');
const file = process.argv[2];
try {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/(className\s*=\s*(?:\{`|"|'))([^>]*?)(`\}|"|')/gs, (match, prefix, inner, suffix) => {
        if (/(bg-(indigo|purple|blue|primary|cyan|emerald)-[4567]00|from-(indigo|purple|blue|primary|cyan)-[4567]00)/.test(inner) && /(text-slate-[789]00|text-black)/.test(inner)) {
            let modified = inner.replace(/text-slate-[789]00/g, 'text-white').replace(/text-black/g, 'text-white');
            return prefix + modified + suffix;
        }
        return match;
    });
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Fixed text color for ' + file);
    }
} catch(e) {}
