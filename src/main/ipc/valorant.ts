import { ipcMain } from 'electron'
import { ValorantApi } from '../services/valorant/index'

class ipcVa {
    init() {
        /**
         * 设置http请求事件URL
         */
        ipcMain.handle('valorant:setEventUrl', (event, eventName, url) => {
            return ValorantApi.setEventUrl(eventName, url)
        })

        /**
         * 设置http请求事件Header
         */
        ipcMain.handle('valorant:setHttpEventHeader', (event, headers) => {
            return ValorantApi.setHttpEventHeader(headers)
        })

        /**
         * 重新连接 Riot 客户端
         * @return boolean
         */
        ipcMain.handle('valorant:reconnect', (event, arg) => {
            return ValorantApi.reconnect()
        })

        /**
         * 检测用户是否在游戏大厅
         * @return boolean
         */
        ipcMain.handle('valorant:checkUserInGameParty', (event, arg) => {
            return ValorantApi.checkUserInGameLobby()
        })

        /**
         * 获取玩家信息
         * @return object
         */
        ipcMain.handle('valorant:getPlayerInfo', (event, arg) => {
            return ValorantApi.getPlayerInfo()
        })
        /**
         * 获取玩家当前赛季段位
         * @return object
         */
        ipcMain.handle('valorant:getPlayerMMR', (event, arg) => {
            return ValorantApi.getPlayerMMR()
        })
        /**
         * 获取玩家最近赛季最高段位
         * @return object
         */
        ipcMain.handle('valorant:getPlayerRecentlyBestMMR', (event, arg) => {
            return ValorantApi.getPlayerRecentlyBestMMR()
        })

        /**
         * 获取当前赛季信息
         * @return object
         */
        ipcMain.handle('valorant:getCurrentSeason', (event, arg) => {
            return ValorantApi.getCurrentSeason()
        })
        /**
         * 获取赛季列表
         * @return object
         */
        ipcMain.handle('valorant:getSeasonList', (event, arg) => {
            return ValorantApi.getSeasonList()
        })
        /**
         * 创建自定义房间
         * @return object
         */
        ipcMain.handle('valorant:createCustomRoom', (event, config, httpEventParams) => {
            return ValorantApi.createCustomRoom(config, httpEventParams)
        })
        /**
         * 根据邀请码加入房间
         * @return boolean
         */
        ipcMain.handle('valorant:joinCustomRoomByCode', (event, inviteCode, httpEventParams) => {
            return ValorantApi.joinCustomRoomByCode(inviteCode, httpEventParams)
        })
        /**
         * 开始自定义房间游戏
         * @return boolean
         */
        ipcMain.handle('valorant:startCustomRoomGame', (event, config, httpEventParams) => {
            return ValorantApi.startCustomRoomGame(config, httpEventParams)
        })


    }
}

export default ipcVa

