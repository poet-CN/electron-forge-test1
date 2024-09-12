/*
 * @Author: 马铭扬
 * @Email：poet_cn@gonxt.com
 * @Date: 2024-09-12 10:46:34
 * @Description: 打包配置
 * @FilePath: /electron-forge-test1/config/packager.ts
 */

import type { ForgePackagerOptions } from '@electron-forge/shared-types'

const packagerConfig: ForgePackagerOptions = {
    asar: true,
}

export default packagerConfig
