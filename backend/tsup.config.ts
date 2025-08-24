import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/server.ts'],
    target: "es2020",
    outDir: 'dist',
    loader: {
        '.crt': 'file',
        '.pem': 'file',
    },
    clean: true,
    external: ['src/certs/*.crt', 'src/certs/*.pem'],
});
