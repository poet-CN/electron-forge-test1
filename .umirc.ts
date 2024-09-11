import { defineConfig } from 'umi'

export default defineConfig({
    routes: [
        {
            title: 'introduce.title',
            path: '/',
            component: 'index.tsx',
        },
    ],
    history: {
        type: 'hash',
    },
    npmClient: 'yarn',
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
})
