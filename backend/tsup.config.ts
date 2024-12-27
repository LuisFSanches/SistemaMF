import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/server.ts'],
    outDir: 'dist',
    loader: {
        '.crt': 'file',
        '.pem': 'file',
    },
    clean: true,
    external: ['src/certs/*.crt', 'src/certs/*.pem'],
});
