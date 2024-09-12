/*
 * @Author: 马铭扬
 * @Email：poet_cn@gonxt.com
 * @Date: 2024-09-12 16:26:32
 * @Description:
 * @FilePath: /electron-forge-test1/config/electron-builder.ts
 */

const path = require('path')

module.exports = {
    appId: 'com.gonxt.gonxtclient.desktop',
    'directories': {
        'output': 'release',      //打包后文件所在位置
    },
    // 需要原封不动复制的资源文件，打包后会复制到以resources为基础的文件夹下
    extraResources: [
        {
            from: path.join(__dirname, '../src/public/'),
            to: './',
        },
    ],
    protocols: {
        name: 'gonxt-client',
        schemes: [ 'gonxt-client' ],
    },
    nsis: {
        oneClick: false, // 是否为一键安装
        perMachine: true, // 是否让用户选择为哪个windows账户安装。若为false，则需要选择
        allowToChangeInstallationDirectory: true, // 允许修改安装目录
        artifactName: 'gonxt-cilent-setup-${version}.${ext}', // 构建安装包的名称
        installerIcon: path.join(__dirname, '../src/assets/build/gonxt-client-icon-win.ico'), // 安装包的图标
        uninstallerIcon: path.join(__dirname, '../src/assets/build/gonxt-client-icon-win.ico'), // 卸载程序的图标
        shortcutName: 'GoNxt Client', // 快捷方式名称
        uninstallDisplayName: 'GoNxt Client', // 控制面板的卸载程序名称
    },
    win: {
        legalTrademarks: 'GoNxt Client', // 商标和注册商标
        publisherName: 'GoNxt Development Team', // 开发者
        icon: path.join(__dirname, '../src/assets/build/gonxt-client-icon-win.ico'), // 图标
    },
    mac: {
        icon: path.join(__dirname, '../src/assets/build/gonxt-client-icon-mac.icns'),
    },
    dmg: {
        icon: path.join(__dirname, '../src/assets/build/gonxt-client-icon-mac.icns'),
    },
    generateUpdatesFilesForAllChannels: 'true',
    publish: [
        {
            provider: 'generic',
            url: 'https://oss.gonxt.com/client/updates/',
            channel: 'latest',
        },
    ],
}
