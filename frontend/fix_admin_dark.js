const fs = require('fs');
const path = require('path');

// 1. Fix glass-premium in index.css back to dark
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(
    /\.glass-premium \{[\s\S]*?\}/,
    `.glass-premium {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%);
        backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8),
            inset 0 0 1px 1px rgba(56, 189, 248, 0.05);
    }`
);
fs.writeFileSync('src/index.css', css);
console.log('Fixed glass-premium in index.css');

// 2. Fix all Admin pages to use dark classes
function walk(dir) {
    let results = [];
    try {
        fs.readdirSync(dir).forEach(file => {
            const full = dir + '/' + file;
            try {
                const stat = fs.statSync(full);
                if (stat.isDirectory()) results = results.concat(walk(full));
                else if (full.endsWith('.jsx') || full.endsWith('.js')) results.push(full);
            } catch(e) {}
        });
    } catch(e) {}
    return results;
}

const adminFiles = [
    ...walk('src/pages/Admin'),
    'src/components/layout/AdminLayout.jsx',
    'src/components/common/AdminLoader.jsx',
];

function sr(str, from, to) { return str.split(from).join(to); }

adminFiles.forEach(file => {
    try {
        let c = fs.readFileSync(file, 'utf8');
        let n = c;
        n = sr(n, 'bg-slate-50',            'bg-[#0f172a]');
        n = sr(n, 'bg-slate-100',           'bg-[#1e293b]');
        n = sr(n, 'bg-white',               'bg-[#0b1120]');
        n = sr(n, 'bg-slate-200',           'bg-white/10');
        n = sr(n, 'bg-gray-50',             'bg-[#0f172a]');
        n = sr(n, 'bg-gray-100',            'bg-[#1e293b]');
        n = sr(n, 'bg-gray-200',            'bg-white/10');
        n = sr(n, 'border-slate-100',       'border-white/5');
        n = sr(n, 'border-slate-200',       'border-white/10');
        n = sr(n, 'border-slate-300',       'border-white/20');
        n = sr(n, 'border-gray-100',        'border-white/5');
        n = sr(n, 'border-gray-200',        'border-white/10');
        n = sr(n, 'text-slate-900',         'text-white');
        n = sr(n, 'text-slate-800',         'text-white/90');
        n = sr(n, 'text-slate-700',         'text-slate-300');
        n = sr(n, 'text-slate-600',         'text-slate-400');
        n = sr(n, 'text-slate-500',         'text-slate-400');
        n = sr(n, 'text-gray-900',          'text-white');
        n = sr(n, 'text-gray-800',          'text-white/90');
        n = sr(n, 'text-gray-700',          'text-slate-300');
        n = sr(n, 'text-gray-600',          'text-slate-400');
        n = sr(n, 'text-gray-500',          'text-slate-400');
        n = sr(n, 'placeholder:text-slate-600', 'placeholder:text-slate-400');
        n = sr(n, 'focus:bg-slate-50',      'focus:bg-[#0b1120]');
        n = sr(n, 'bg-slate-50/50',         'bg-[#0f172a]/50');
        n = sr(n, 'hover:bg-slate-100',     'hover:bg-[#1e293b]');
        n = sr(n, 'hover:bg-slate-200',     'hover:bg-white/10');
        if (c !== n) { fs.writeFileSync(file, n); console.log('Fixed: ' + file); }
    } catch(e) {}
});

console.log('Done!');
