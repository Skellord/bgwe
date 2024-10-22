import { defineConfig } from 'vite';
import dtsPlugin from 'vite-plugin-dts';

export default defineConfig({
    // appType: '',
    base: '/',
    build: {
        outDir: 'dist/bgwe',
        lib: {
            name: 'bgwe',
            entry: './src/main.ts',
            fileName: 'bgwe',
        },
    },
    plugins:[dtsPlugin()],
    publicDir: false,
});
