/*
 * @Author: 马铭扬
 * @Email：poet_cn@gonxt.com
 * @Date: 2024-09-12 11:10:01
 * @Description: windows-squirrel打包配置文件
 * @FilePath: /electron-forge-test1/config/maker-squirrel.ts
 */

import path from 'path'
import projectPackage from '../package.json'
import type { MakerSquirrelConfig } from '@electron-forge/maker-squirrel'

const makerSquirrelConfig: MakerSquirrelConfig = {
    authors: 'GoNxt Frontend Development Team',
    exe: `gonxt-client-setup-${ projectPackage.version }.exe`,
    setupExe: `gonxt-client-setup-${ projectPackage.version }.exe`,
    setupIcon: path.resolve(__dirname, 'src/assets/build/gonxt-client-icon-mac.icns'),
}

export default makerSquirrelConfig
