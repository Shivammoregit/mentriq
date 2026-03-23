const fs = require('fs');
const path = require('path');

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
            } catch (e) {
                // Ignore invalid files
            }
        });
    } catch (e) {
        // Ignore read errors
    }
    return results;
}

const files = walk('c:/preetamp/MentriQ-Technologies/frontend/src');

function safeReplace(str, search, alt) {
    return str.split(search).join(alt);
}

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let newContent = content;
        
        newContent = safeReplace(newContent, 'bg-[#070b14]', 'bg-slate-50');
        newContent = safeReplace(newContent, 'bg-[#0b1120]', 'bg-slate-100');
        newContent = safeReplace(newContent, 'bg-[#0f172a]', 'bg-white');
        newContent = safeReplace(newContent, 'bg-slate-950', 'bg-slate-50');
        newContent = safeReplace(newContent, 'bg-slate-900', 'bg-slate-100');
        newContent = safeReplace(newContent, 'bg-slate-800', 'bg-white');
        newContent = safeReplace(newContent, 'border-white/10', 'border-slate-200');
        newContent = safeReplace(newContent, 'border-white/5', 'border-slate-100');
        newContent = safeReplace(newContent, 'border-white/20', 'border-slate-300');
        newContent = safeReplace(newContent, 'text-white', 'text-slate-900');
        newContent = safeReplace(newContent, 'text-slate-400', 'text-slate-600');
        newContent = safeReplace(newContent, 'text-slate-300', 'text-slate-700');
        newContent = safeReplace(newContent, 'text-slate-200', 'text-slate-800');
        newContent = safeReplace(newContent, 'bg-white/5', 'bg-slate-100');
        newContent = safeReplace(newContent, 'bg-white/10', 'bg-slate-200');
        newContent = safeReplace(newContent, 'bg-black/20', 'bg-slate-200/50');
        
        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log('Updated ' + file);
        }
    } catch (e) {
        // Ignore write errors
    }
});
console.log('Done mapping components to bright theme');
