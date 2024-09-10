/*
 * @Author: 马铭扬
 * @Email：poet_cn@gonxt.com
 * @Date: 2024-09-05 10:59:25
 * @Description: va事件
 * @FilePath: /gonxt-client-fe/src/services/message/va.ts
 */

import ClientMessage , { type MessageResponseData } from './website'

export default class VaMessageListener {
    init () {
        // VA-检测用户是否在游戏大厅
        ClientMessage.on('VA_checkUserInGameParty', (message) => {
            const requestData: MessageResponseData = {
                cmd: 'VA_checkUserInGameParty',
                seq: message.seq,
            }
            window.$va.checkUserInGameParty().then((response) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: response,
                })
            }).catch((reason) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: reason,
                })
            })
        })
        // VA-获取玩家信息
        ClientMessage.on('VA_getPlayerInfo', (message) => {
            const requestData: MessageResponseData = {
                cmd: 'VA_getPlayerInfo',
                seq: message.seq,
            }
            window.$va.getPlayerInfo().then((response) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: response,
                })
            }).catch((reason) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: reason,
                })
            })
        })
        // VA-获取玩家当前赛季段位
        ClientMessage.on('VA_getPlayerMMR', (message) => {
            const requestData: MessageResponseData = {
                cmd: 'VA_getPlayerMMR',
                seq: message.seq,
            }
            window.$va.getPlayerMMR().then((response) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: response,
                })
            }).catch((reason) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: reason,
                })
            })
        })
        // VA-获取玩家最近赛季最高段位
        ClientMessage.on('VA_getPlayerRecentlyBestMMR', (message) => {
            const requestData: MessageResponseData = {
                cmd: 'VA_getPlayerRecentlyBestMMR',
                seq: message.seq,
            }
            window.$va.getPlayerRecentlyBestMMR().then((response) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: response,
                })
            }).catch((reason) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: reason,
                })
            })
        })
        // VA-获取当前赛季
        ClientMessage.on('VA_getCurrentSeason', (message) => {
            const requestData: MessageResponseData = {
                cmd: 'VA_getCurrentSeason',
                seq: message.seq,
            }
            window.$va.getCurrentSeason().then((response) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: response,
                })
            }).catch((reason) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: reason,
                })
            })
        })
        // VA-获取赛季列表
        ClientMessage.on('VA_getSeasonList', (message) => {
            const requestData: MessageResponseData = {
                cmd: 'VA_getSeasonList',
                seq: message.seq,
            }
            window.$va.getSeasonList().then((response) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: response,
                })
            }).catch((reason) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: reason,
                })
            })
        })
        // VA-创建自定义房间
        ClientMessage.on('VA_createCustomRoom', (message) => {
            const { data, seq } = message
            const requestData: MessageResponseData = {
                cmd: 'VA_createCustomRoom',
                seq,
            }
            window.$va.createCustomRoom(data.config, data.httpEventParams).then((response) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: response,
                })
            }).catch((reason) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: reason,
                })
            })
        })
        // VA-使用code码加入自定义房间
        ClientMessage.on('VA_joinCustomRoomByCode', (message) => {
            const { data, seq } = message
            const requestData: MessageResponseData = {
                cmd: 'VA_joinCustomRoomByCode',
                seq,
            }
            window.$va.joinCustomRoomByCode(data.inviteCode, data.httpEventParams).then((response) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: response,
                })
            }).catch((reason) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: reason,
                })
            })
        })
        // VA-开始自定义房间游戏
        ClientMessage.on('VA_startCustomRoomGame', (message) => {
            const { data, seq } = message
            const requestData: MessageResponseData = {
                cmd: 'VA_startCustomRoomGame',
                seq,
            }
            window.$va.startCustomRoomGame(data.config, data.httpEventParams).then((response) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: response,
                })
            }).catch((reason) => {
                ClientMessage.sendMessageOnce({
                    ...requestData,
                    data: reason,
                })
            })
        })
    }
}
