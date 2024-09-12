/*
 * @Author: 马铭扬
 * @Email：poet_cn@gonxt.com
 * @Date: 2024-09-12 10:46:34
 * @Description: 打包配置
 * @FilePath: /electron-forge-test1/config/packager.ts
 */

import path from 'path'
import type { ForgePackagerOptions } from '@electron-forge/shared-types'

const packagerConfig: ForgePackagerOptions = {
    asar: true,
    name: 'GoNxt Client',
    appVersion: '1.0.0',
    buildVersion: '1.0.0',
    // icon: path.resolve(__dirname, 'src/assets/build/gonxt-client-icon-win.ico'),
    icon: path.resolve(__dirname, 'src/assets/build/gonxt-client-icon-mac.icns'),
    executableName: 'GoNxt Client',
    appBundleId: 'com.gonxt.gonxtclient.desktop',
    /*windowsSign: {
        certificateFile: '',
        certificatePassword: '',
    },*/
}

export default packagerConfig
