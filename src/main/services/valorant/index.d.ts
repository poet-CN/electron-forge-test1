import { ValorantEvent , EventReqUrlKey } from './event'
import { ValorantWebSocket } from './websocket'

declare const ValorantApi : ValorantAPI

type ValorantModeKey = keyof typeof ValorantMode

declare enum ValorantMode {
    Swiftplay = '/Game/GameModes/_Development/Swiftplay_EndOfRoundCredits/Swiftplay_EoRCredits_GameMode.Swiftplay_EoRCredits_GameMode_C' ,
    Bomb = '/Game/GameModes/Bomb/BombGameMode.BombGameMode_C' ,
    Deathmatch = '/Game/GameModes/Deathmatch/DeathmatchGameMode.DeathmatchGameMode_C' ,
    GunGame = '/Game/GameModes/GunGame/GunGameTeamsGameMode.GunGameTeamsGameMode_C' ,
    QuickBomb = '/Game/GameModes/QuickBomb/QuickBombGameMode.QuickBombGameMode_C' ,
    HURM = '/Game/GameModes/HURM/HURMGameMode.HURMGameMode_C'
}

type ValorantServerNodeKey = keyof typeof ValorantServerNode

declare enum ValorantServerNode {
    HongKong = 'aresriot.aws-ape1-prod.ap-gp-hongkong-1' ,
    Singapore = 'aresriot.aws-apse1-prod.ap-gp-singapore-1' ,
    Tokyo = 'aresriot.aws-apne1-prod.ap-gp-tokyo-1' ,
    Mumbai = 'aresriot.aws-apse2-prod.ap-gp-sydney-1' ,
    Sydney = 'aresriot.aws-apse2-prod.ap-gp-sydney-1'
}

type ValorantMapKey = keyof typeof ValorantMap

declare enum ValorantMap {
    Fracture = '/Game/Maps/Canyon/Canyon' ,
    Sunset = '/Game/Maps/Juliett/Juliett' ,
    Bind = '/Game/Maps/Duality/Duality' ,
    Pearl = '/Game/Maps/Pitt/Pitt' ,
    Abyss = '/Game/Maps/Infinity/Infinity' ,
    Icebox = '/Game/Maps/Port/Port' ,
    Ascent = '/Game/Maps/Ascent/Ascent' ,
    Breeze = '/Game/Maps/Foxtrot/Foxtrot' ,
    Lotus = '/Game/Maps/Jam/Jam' ,
    Haven = '/Game/Maps/Triad/Triad' ,
    Split = '/Game/Maps/Bonsai/Bonsai' ,
    Kasbah = '/Game/Maps/HURM/HURM_Bowl/HURM_Bowl' ,
    Drift = '/Game/Maps/HURM/HURM_Helix/HURM_Helix' ,
    Piazza = '/Game/Maps/HURM/HURM_Yard/HURM_Yard' ,
    District = '/Game/Maps/HURM/HURM_Alley/HURM_Alley'
}

declare enum ValorantHURMModeMap {
    Kasbah = '/Game/Maps/HURM/HURM_Bowl/HURM_Bowl' ,
    Drift = '/Game/Maps/HURM/HURM_Helix/HURM_Helix' ,
    Piazza = '/Game/Maps/HURM/HURM_Yard/HURM_Yard' ,
    District = '/Game/Maps/HURM/HURM_Alley/HURM_Alley'
}

type ValorantHURMModeMapKey = keyof typeof ValorantHURMModeMap

declare const ValorantGameRule : {
    //允许密技
    AllowGameModifiers : string
    //延长赛模式：DEUCE制
    IsOvertimeWinByTwo : string
    //完整回合全力尽战
    PlayOutAllRounds : string
    //隐藏对战纪录
    SkipMatchHistory : string
    //锦标赛模式
    TournamentMode : string
}
type ValorantGameRuleConf = typeof ValorantGameRule
type ValorantCustomRoomConfig = {
    serverNode : ValorantServerNodeKey
    mode : ValorantModeKey
    map : ValorantMapKey
    gameRule : ValorantGameRuleConf | null
}

declare enum ValorantApiErrorEnum {
    //无错误
    NotError = 0 ,
    //未知
    Unknown = -1000 ,
    //参数错误
    ParamError = -1001 ,
    //未启动 Riot 登录器
    UnStart = -1002 ,
    //未登录账号
    NotLogged = -1003 ,
    //未进入游戏大厅
    NotInGameLobby = -1004 ,
    //无权限
    NotPermission = -1005 ,
    //websocket错误
    WebSocketError = -1006 ,
    //token 失效
    TokenExpired = -1007 ,
    //未找到比赛记录
    NoMatchRecord = -1008 ,
}

interface ValorantAPIResultStruct {
    code : number
    message : string
    result : any
}

declare class ValorantAPI {
    
    constructor( event : ValorantEvent , websocket : ValorantWebSocket )
    
    /**
     * @description 设置http请求事件URL
     * @param eventName {EventReqUrlKey} 事件名
     * @param url {string} 事件URL
     */
    setEventUrl( eventName : EventReqUrlKey , url : string ) : Promise<ValorantAPIResultStruct>
    
    /**
     * @description 设置http请求事件Header
     * @param reqHeader {Record<string, string>} 请求头
     */
    setHttpEventHeader( reqHeader : Record<string , string> ) : Promise<ValorantAPIResultStruct>
    
    
    /**
     * @description 重新连接Riot 客户端
     */
    reconnect( createWsConnect? : boolean ) : Promise<ValorantAPIResultStruct>
    
    /**
     * @description 检查用户是否在游戏大厅
     */
    checkUserInGameLobby() : Promise<ValorantAPIResultStruct>
    
    
    /**
     * @description 获取用户当前房间或组队信息
     */
    getPartyInfo() : Promise<ValorantAPIResultStruct>
    
    /**
     * @description 获取用户信息
     */
    getPlayerInfo() : Promise<ValorantAPIResultStruct>
    
    /**
     * @description 获取用户当前赛季的段位
     */
    getPlayerMMR( forceRefresh? : boolean ) : Promise<ValorantAPIResultStruct>
    
    getPlayerRecentlyBestMMR( forceRefresh? : boolean ) : Promise<ValorantAPIResultStruct>
    
    
    /**
     * @description 创建自定义房间
     * @param config {ValorantCustomRoomConfig}  房间配置
     * @param httpEventParams {any}  http事件请求返回参数
     */
    createCustomRoom( config : ValorantCustomRoomConfig , httpEventParams : any ) : Promise<ValorantAPIResultStruct>
    
    /**
     * @description 加入自定义房间
     * @param inviteCode {string}  房间邀请码
     * @param httpEventParams {any}  http事件请求返回参数
     */
    joinCustomRoomByCode( inviteCode : string , httpEventParams : any ) : Promise<ValorantAPIResultStruct>
    
    getCurrentGameParams() : any
    
    clearCurrentGameParams() : void
    
    /**
     * @description 开始自定义房间游戏
     * @param config {ValorantCustomRoomConfig}  房间配置
     * @param httpEventParams
     */
    startCustomRoomGame( config : ValorantCustomRoomConfig , httpEventParams : any ) : Promise<ValorantAPIResultStruct>
    
    hasCurrentMatchIntroCache() : boolean
    
    getCurrentMatch() : Promise<any>
    
    removePlayer( puuid : string , httpEventParams : any ) : Promise<ValorantAPIResultStruct>
}

export { EventReqUrlKey , ValorantCustomRoomConfig }

