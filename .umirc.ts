import { defineConfig } from 'umi'

export default defineConfig({
    routes: [
        {
            title: 'introduce.title',
            path: '/',
            component: 'index.tsx',
        },
    ],
    outputPath: './src/main/umi-build',
    npmClient: 'yarn',
})
