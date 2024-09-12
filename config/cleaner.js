const path = require('path')
const { deleteFile } = require('./utils')
const packageJson = require('../package.json')

class Clean {
    init () {
        this.cleanFile()
    }

    cleanFile () {
        deleteFile(path.join(__dirname, '../out'));
        deleteFile(path.join(__dirname, '../dist'))
        deleteFile(path.join(__dirname, '../.webpack'))
        if (process.platform === 'win32') {
            deleteFile(path.join(__dirname, '../release/win-unpacked'))
            deleteFile(path.join(__dirname, `../release/${ packageJson.name }-setup-${ packageJson.version }.exe.blockmap`))
        }
        if (process.platform === 'darwin') {
            deleteFile(path.join(__dirname, '../release/mac'))
        }
        deleteFile(path.join(__dirname, '../release/alpha.yml'))
        deleteFile(path.join(__dirname, '../release/beta.yml'))
        deleteFile(path.join(__dirname, '../release/builder-debug.yml'))
    }
}

new Clean().init()