const fs = require('fs');
const path = require('path');

/**
 * Recursively scans a directory and filters files ending with '0.cif'.
 * @param {string} dir - The directory to scan.
 * @param {Array} results - Accumulator for matching files.
 * @returns {Array} - List of file paths ending with '0.cif'.
 */
function scanDirectory(dir, results = []) {
    const filesAndDirs = fs.readdirSync(dir, { withFileTypes: true });
    
    filesAndDirs.forEach(entry => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            scanDirectory(fullPath, results);
        } else {
            if (entry.name.endsWith('0.cif')) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

/**
 * Copies a list of files to a destination directory.
 * @param {Array} files - Array of source file paths.
 * @param {string} destDir - Destination directory.
 */
function copyFilesToFolder(files, destDir) {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    files.forEach(file => {
        const fileName = path.basename(file);
        const destPath = path.join(destDir, fileName);

        fs.copyFileSync(file, destPath);
        console.log(`Copied: ${file} -> ${destPath}`);
    });
}

// Usage
const folderPath = './alphafold'; 
const targetFolder = './model0s'; 

const filteredFiles = scanDirectory(folderPath);
copyFilesToFolder(filteredFiles, targetFolder);

console.log(`Total files copied: ${filteredFiles.length}`);