const fs = require('fs');
const path = require('path');

const utils = {
    // 递归复制文件夹
    copyFolder(source, target) {
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target);
        }
        fs.readdirSync(source).forEach((file) => {
            const curSource = path.join(source, file);
            const curTarget = path.join(target, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                utils.copyFolder(curSource, curTarget);
            } else {
                fs.copyFileSync(curSource, curTarget);
            }
        });
    },
    // 递归删除文件夹
    deleteFile(targetPath) {
        try {
            const stats = fs.lstatSync(targetPath); // 获取文件或文件夹的状态
        if (stats.isFile()) {
            // 如果是文件，删除文件
            fs.unlinkSync(targetPath);
        } else if (stats.isDirectory()) {
            // 如果是文件夹，递归删除文件夹内容
            const files = fs.readdirSync(targetPath);
            for (const file of files) {
                const curPath = path.join(targetPath, file);
                utils.deleteFile(curPath); // 递归删除
            }
            fs.rmdirSync(targetPath); // 删除空文件夹
        }
        } catch (e) {
            console.error(`删除文件失败: ${ targetPath }`)
        }
    },
    // 移动文件夹
    moveFolder(source, target) {
        utils.copyFolder(source, target);
        utils.deleteFile(source);
    }
}

module.exports = utils