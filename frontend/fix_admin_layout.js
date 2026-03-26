const fs = require('fs');
const path = require('path');

function processDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            processDir(filePath);
        } else if (file.endsWith('.jsx')) {
            let content = fs.readFileSync(filePath, 'utf8');

            content = content.replace(/flex flex-col sm:flex-row gap-4 relative z-10/g, 'flex flex-col sm:flex-row flex-wrap gap-4 relative z-10 w-full lg:w-auto');
            content = content.replace(/<div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 relative z-10">/g, '<div className="w-full lg:w-auto flex flex-col sm:flex-row flex-wrap gap-4 relative z-10">');
            content = content.replace(/<div className="flex gap-4">/g, '<div className="flex flex-wrap gap-4 w-full sm:w-auto">');

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file}`);
        }
    });
}

processDir(path.join(__dirname, 'src', 'pages', 'Admin'));
