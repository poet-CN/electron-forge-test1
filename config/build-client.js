const { exec } = require('child_process')
const path = require('path')
const { moveFolder } = require('./utils')

class BuildClient {
    processArgs = process.argv.slice(2)

    async init() {
        // 使用umi构建网页部分
        await this.runExec('npx umi build')
        console.log('====== 已完成1/6 ======')
        // 使用electron-forge构建。注：原本可以用webpack执行webpack.main.config.ts来代替这一步，但forge有一个ejs-cjs的转码很好用，所以决定牺牲一些打包时的性能来换取构建后的完整性
        await this.runExec('npx electron-forge package')
        console.log('====== 已完成2/6 ======')
        // 移动文件
        moveFolder(path.join(__dirname, '../.webpack/x64'), path.join(__dirname, '../.webpack'))
        console.log('====== 已完成3/6 ======')
        // 使用electron-builder打包
        await this.runExec(`electron-builder --config ${path.resolve(__dirname, 'electron-builder.js')}`)
        this.log('打包完成, 输出地址为release文件夹')
        console.log('====== 已完成4/6 ======')
        // 清理文件
        this.cleanUpFolders()
        console.log('====== 已完成5/6 ======')
        // 打开打包后的文件夹
        this.openReleaseFolder()
        console.log('====== 已完成6/6 ======')
    }

    runExec(command) {
        return new Promise((resolve, reject) => {
            this.log(`开始执行${ command }命令`)
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`执行命令${command}时发生错误:\n${error}\n输出结束\n\n`);
                    reject()
                    return;
                }
                if (stderr) {
                    console.error(`${command}命令的标准错误输出:\n${stderr}\n输出结束\n\n`);
                }
                if (stdout) {
                    this.log(`${command}命令的输出:\n${stdout}\n输出结束\n\n`);
                }
                resolve()
            })
        })
    }

    // 清理文件
    async cleanUpFolders() {
        if (this.processArgs && this.processArgs.includes('noclean')) {
            this.log('无需清理打包时残留的无用文件')
            return
        }
        this.log('开始清理打包时残留的无用文件')
        await this.runExec(`node ${ path.join(__dirname, 'cleaner.js') }`)
        this.log('结束清理打包时残留的无用文件')
    }

    // 打开打包后的文件夹
    openReleaseFolder() {
        const platform = process.platform;
        const releasePath = path.join(__dirname, '../release')
        if (platform === 'win32') {
            this.runExec(`start explorer "${ releasePath }"`)
        }
        if (platform === 'darwin') {
            this.runExec(`open "${ releasePath }"`)
        }
    };

    log (logInfo) {
        if (this.processArgs && this.processArgs.includes('noconsole')) {
            return
        }
        console.log(logInfo)
    }
}

new BuildClient().init()