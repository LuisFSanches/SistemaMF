// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        exclude: [
            'node_modules',
            'dist',
            'build',
            '.data',
            '**/node_modules/**', // reforço
            '**/dist/**',
            '**/.data/**',
            '**/vendor/**'
        ],
        coverage: {
            reporter: ['text', 'json', 'html'],
            provider: 'v8',
            exclude: ['**/node_modules/**', '**/dist/**', '**/.data/**', '**/vendor/**']
        }
    }
})
