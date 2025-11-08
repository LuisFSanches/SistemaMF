import path from 'path';
import fs from 'fs';

// Em produção (código compilado), __dirname está em dist/
// Em desenvolvimento, __dirname está em src/
// Precisamos garantir que sempre apontamos para a raiz do projeto

const isDevelopment = process.env.NODE_ENV !== 'production';
const isCompiled = __dirname.includes('/dist/');

// Caminho para a raiz do projeto
export const rootDir = isCompiled 
    ? path.resolve(__dirname, '..', '..')  // De dist/config para raiz
    : path.resolve(__dirname, '..', '..');  // De src/config para raiz

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
console.log('[Paths] Products upload directory:', productsUploadDir);
