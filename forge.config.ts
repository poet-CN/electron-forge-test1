import fs from 'fs-extra'
import path from 'path'
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { FuseV1Options, FuseVersion } from '@electron/fuses'
import { mainConfig } from './webpack.main.config'
import { rendererConfig } from './webpack.renderer.config'

import type { ForgeConfig } from '@electron-forge/shared-types'

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
    },
    rebuildConfig: {},
    makers: [],
    plugins: [
        new AutoUnpackNativesPlugin({}),
        new WebpackPlugin({
            mainConfig,
            devContentSecurityPolicy: 'connect-src \'self\' * \'unsafe-eval\'',
            renderer: {
                config: rendererConfig,
                entryPoints: [
                    {
                        name: 'main_window',
                        preload: {
                            js: './src/main/preload.ts',
                        },
                    },
                ],
            },
        }),
        // Fuses are used to enable/disable various Electron functionality
        // at package time, before code signing the application
        new FusesPlugin({
            version: FuseVersion.V1,
            [FuseV1Options.RunAsNode]: false,
            [FuseV1Options.EnableCookieEncryption]: true,
            [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
            [FuseV1Options.EnableNodeCliInspectArguments]: false,
            [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
            [FuseV1Options.OnlyLoadAppFromAsar]: true,
        }),
    ],
    /*hooks: {
        async packageAfterCopy (_, buildPath) {
            const umiBuildPath = path.join(__dirname, 'dist') // Umi 构建输出路径
            const destinationPath = path.join(__dirname, '.webpack/dist') // Electron 打包输出路径
            console.log(umiBuildPath)
            console.log(destinationPath)
            try {
                await fs.copy(umiBuildPath, destinationPath) // 复制 Umi 打包输出文件到 Electron 的输出目录
                console.log('复制Umi打包输出文件到Electron的输出目录完毕')
            } catch (e) {
                console.error(e)
            }
        },
    },*/
}

export default config
