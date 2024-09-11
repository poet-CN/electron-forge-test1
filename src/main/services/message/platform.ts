/*
 * @Author: 马铭扬
 * @Email：poet_cn@gonxt.com
 * @Date: 2024-09-05 10:51:02
 * @Description: 平台级事件
 * @FilePath: /gonxt-client-fe/src/services/message/platform.ts
 */

import { clearAccessToken, setAccessToken } from '../../../utils/utils'
import ClientMessage from './website'

export default class PlatformMessageListener {
    init () {
        // (客户端)发送accessToken到客户端
        ClientMessage.on('USER_updateAccessToken', (data) => {
            window.$va.setHttpEventHeader({ AccessToken: data.accessToken }).catch(() => {
            })
            setAccessToken(data.accessToken)
        })
        // 清空客户端的accessToken
        ClientMessage.on('USER_clearAccessToken', () => {
            window.$va.setHttpEventHeader({ AccessToken: undefined }).catch(() => {
            })
            clearAccessToken()
        })
    }
}
