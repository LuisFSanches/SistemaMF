import path from 'path';
import fs from 'fs';

// Encontrar a raiz do projeto procurando por package.json
function findProjectRoot(startPath: string): string {
    let currentPath = startPath;
    
    while (currentPath !== '/') {
        const packageJsonPath = path.join(currentPath, 'package.json');
        
        if (fs.existsSync(packageJsonPath)) {
            return currentPath;
        }
        
        currentPath = path.dirname(currentPath);
    }
    
    return path.resolve(startPath, '..', '..');
}

const isCompiled = __dirname.includes('/dist/');

// console.log('[Paths] __dirname:', __dirname);
// console.log('[Paths] Is compiled:', isCompiled);

export const rootDir = findProjectRoot(__dirname);

export const uploadsDir = path.join(rootDir, 'uploads');
export const productsUploadDir = path.join(uploadsDir, 'products');
export const storesUploadDir = path.join(uploadsDir, 'stores');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('[Paths] Created uploads directory:', uploadsDir);
}

if (!fs.existsSync(productsUploadDir)) {
    fs.mkdirSync(productsUploadDir, { recursive: true });
    console.log('[Paths] Created products upload directory:', productsUploadDir);
}

if (!fs.existsSync(storesUploadDir)) {
    fs.mkdirSync(storesUploadDir, { recursive: true });
    console.log('[Paths] Created stores upload directory:', storesUploadDir);
}

// console.log('[Paths] Root directory:', rootDir);
// console.log('[Paths] Uploads directory:', uploadsDir);
// console.log('[Paths] Products upload directory:', productsUploadDir);
