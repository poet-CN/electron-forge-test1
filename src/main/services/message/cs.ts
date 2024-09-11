/*
 * @Author: 马铭扬
 * @Email：poet_cn@gonxt.com
 * @Date: 2024-09-05 10:55:48
 * @Description: cs事件
 * @FilePath: /gonxt-client-fe/src/services/message/cs.ts
 */

import ClientMessage, { type MessageResponseData } from './website'

export default class CsMessageListener {
    init () {
        // CS-校验练枪图是否存在
        ClientMessage.on('CS_checkWorkshopFireMapExist', (message) => {
            const requestData: MessageResponseData = {
                cmd: 'CS_checkWorkshopFireMapExist',
                seq: message.seq,
            }
            window.$cs.checkWorkshopFireMapExist().then(() => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: true,
                })
            }).catch(() => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: false,
                })
            })
        })
    }
}
