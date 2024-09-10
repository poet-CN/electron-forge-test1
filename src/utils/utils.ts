/*
 * @Author: 马铭扬
 * @Email：poet_cn@gonxt.com
 * @Date: 2024-07-29 18:03:06
 * @Description: 全局公共方法文件
 * @FilePath: /gonxt-client-fe/src/utils/utils.ts
 */

// 写入AccessToken
export const setAccessToken = (accessToken: string) => {
    localStorage.setItem('AT', accessToken)
}

// 读取AccessToken
export const getAccessToken = () => {
    return localStorage.getItem('AT')
}

// 清空AccessToken
export const clearAccessToken = () => {
    localStorage.removeItem('AT')
}

// 生成一个websocket的消息id。时间戳-6位随机数
export const wsSeqId = () => {
    return `${ Date.now() }-${ Math.random().toString().slice(2, 8) }`
}
