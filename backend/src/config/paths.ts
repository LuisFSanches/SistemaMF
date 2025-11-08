import path from 'path';
import fs from 'fs';

// Encontrar a raiz do projeto procurando por package.json
function findProjectRoot(startPath: string): string {
    let currentPath = startPath;
    
    // Subir até encontrar package.json ou atingir a raiz do sistema
    while (currentPath !== '/') {
        const packageJsonPath = path.join(currentPath, 'package.json');
        
        if (fs.existsSync(packageJsonPath)) {
            return currentPath;
        }
        
        currentPath = path.dirname(currentPath);
    }
    
    // Fallback: assumir que está 2 níveis acima
    return path.resolve(startPath, '..', '..');
}

// Detectar se está compilado
const isCompiled = __dirname.includes('/dist/');

console.log('[Paths] __dirname:', __dirname);
console.log('[Paths] Is compiled:', isCompiled);

// Caminho para a raiz do projeto
export const rootDir = findProjectRoot(__dirname);

// Caminho para uploads
export const uploadsDir = path.join(rootDir, 'uploads');
export const productsUploadDir = path.join(uploadsDir, 'products');

// Criar diretórios se não existirem
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('[Paths] Created uploads directory:', uploadsDir);
}

if (!fs.existsSync(productsUploadDir)) {
    fs.mkdirSync(productsUploadDir, { recursive: true });
    console.log('[Paths] Created products upload directory:', productsUploadDir);
}

console.log('[Paths] Root directory:', rootDir);
console.log('[Paths] Uploads directory:', uploadsDir);
console.log('[Paths] Products upload directory:', productsUploadDir);
