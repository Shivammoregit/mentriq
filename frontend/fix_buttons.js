const fs = require('fs');

function walk(dir) {
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        list.forEach(function(file) {
            file = dir + '/' + file;
            try {
                const stat = fs.statSync(file);
                if (stat && stat.isDirectory()) {
                    results = results.concat(walk(file));
                } else {
                    if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.tsx') || file.endsWith('.ts')) {
                        results.push(file);
                    }
                }
            } catch (e) {}
        });
    } catch(e) {}
    return results;
}

const files = walk('c:/preetamp/MentriQ-Technologies/frontend/src');

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        
        let newContent = content.replace(/("|'|`)([^"'`]+)\1/g, (match, quote, inner) => {
            if (/(bg-indigo-|bg-purple-|bg-blue-|from-indigo-|bg-emerald-|bg-cyan-[56])/.test(inner) && /text-slate-[89]00/.test(inner)) {
                let modified = inner.replace(/text-slate-900/g, 'text-white').replace(/text-slate-800/g, 'text-white');
                return quote + modified + quote;
            }
            return match;
        });

        // Some classNames span multiple lines in template literals.
        // The above regex /[^"'`]+/ will match multi-line template literals! So it handles `` multi-line perfectly.

        // Fix hovering buttons where it shouldn't be dark text on hover
        // e.g. hover:text-slate-900 might need to stay, but usually we don't have hover:bg-indigo-600 with hover:text-slate-900
        
        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log('Fixed button text colors in ' + file);
        }
    } catch (e) {}
});
