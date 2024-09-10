// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'
import type { EventReqUrlKey , ValorantCustomRoomConfig } from './services/valorant/index.d'

// 瓦罗兰特专用
contextBridge.exposeInMainWorld('$va', {
    // 设置http请求事件URL
    setEventUrl: async (eventName:EventReqUrlKey , url:string) => {
        return await ipcRenderer.invoke('valorant:setEventUrl' , eventName , url)
    },
    //设置http请求事件Header
    setHttpEventHeader: async ( headers:Record<string , string> ) => {
        return await ipcRenderer.invoke('valorant:setHttpEventHeader' , headers)
    },
    //检测用户是否在游戏大厅
    checkUserInGameParty: async () => {
        return await ipcRenderer.invoke('valorant:checkUserInGameParty')
    },
    //获取玩家信息
    getPlayerInfo: async () => {
        return await ipcRenderer.invoke('valorant:getPlayerInfo')
    },
    //获取玩家当前赛季段位
    getPlayerMMR: async () => {
        return await ipcRenderer.invoke('valorant:getPlayerMMR')
    },
    //获取玩家最近赛季最高段位
    getPlayerRecentlyBestMMR: async () => {
        return await ipcRenderer.invoke('valorant:getPlayerRecentlyBestMMR')
    },
    //获取当前赛季
    getCurrentSeason: async () => {
        return await ipcRenderer.invoke('valorant:getCurrentSeason')
    },
    //获取赛季列表
    getSeasonList: async () => {
        return await ipcRenderer.invoke('valorant:getSeasonList')
    },
    //创建自定义房间
    createCustomRoom: async (config:ValorantCustomRoomConfig , httpEventParams:any) => {
        return await ipcRenderer.invoke('valorant:createCustomRoom' , config , httpEventParams)
    },
    //使用code码加入自定义房间
    joinCustomRoomByCode: async (inviteCode:string, httpEventParams:any) => {
        return await ipcRenderer.invoke('valorant:joinCustomRoomByCode' , inviteCode , httpEventParams)
    },
    //开始自定义房间游戏
    startCustomRoomGame: async (config:ValorantCustomRoomConfig , httpEventParams:any) => {
        return await ipcRenderer.invoke('valorant:startCustomRoomGame', config , httpEventParams)
    },
})
