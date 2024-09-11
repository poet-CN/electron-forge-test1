import { AxiosError } from 'axios'
import {
    createValorantApiClient , provideAuthViaLocalApi ,
    provideClientVersionViaVAPI ,
    provideLockFile , provideLogFile ,
    useProviders , ValorantApiClient ,
} from '@tqman/valorant-api-client'
import { ValorantEvent , EventReqUrlKey } from './event'
import { ValorantWebSocket } from './websocket'
import { CustomLogger } from '../logger'

type ValorantModeKey = keyof typeof ValorantMode

enum ValorantMode {
    //超速衝點
    Swiftplay = '/Game/GameModes/_Development/Swiftplay_EndOfRoundCredits/Swiftplay_EoRCredits_GameMode.Swiftplay_EoRCredits_GameMode_C' ,
    //標準模式
    Bomb = '/Game/GameModes/Bomb/BombGameMode.BombGameMode_C' ,
    //死鬥模式
    Deathmatch = '/Game/GameModes/Deathmatch/DeathmatchGameMode.DeathmatchGameMode_C' ,
    //超激進戰
    GunGame = '/Game/GameModes/GunGame/GunGameTeamsGameMode.GunGameTeamsGameMode_C' ,
    //輻能搶攻戰
    QuickBomb = '/Game/GameModes/QuickBomb/QuickBombGameMode.QuickBombGameMode_C' ,
    //團隊死鬥模式
    HURM = '/Game/GameModes/HURM/HURMGameMode.HURMGameMode_C'
}

type ValorantServerNodeKey = keyof typeof ValorantServerNode

enum ValorantServerNode {
    //香港
    HongKong = 'aresriot.aws-ape1-prod.ap-gp-hongkong-1' ,
    //新加坡
    Singapore = 'aresriot.aws-apse1-prod.ap-gp-singapore-1' ,
    //东京
    Tokyo = 'aresriot.aws-apne1-prod.ap-gp-tokyo-1' ,
    //孟买
    Mumbai = 'aresriot.aws-apse2-prod.ap-gp-sydney-1' ,
    //悉尼
    Sydney = 'aresriot.aws-apse2-prod.ap-gp-sydney-1' ,
}

type ValorantMapKey = keyof typeof ValorantMap

enum ValorantMap {
    // 天漠之峽
    Fracture = '/Game/Maps/Canyon/Canyon' ,
    // 日落之城
    Sunset = '/Game/Maps/Juliett/Juliett' ,
    // 劫境之地
    Bind = '/Game/Maps/Duality/Duality' ,
    // 深海遺珠
    Pearl = '/Game/Maps/Pitt/Pitt' ,
    // 深窟幽境
    Abyss = '/Game/Maps/Infinity/Infinity' ,
    // 極地寒港
    Icebox = '/Game/Maps/Port/Port' ,
    // 義境空島
    Ascent = '/Game/Maps/Ascent/Ascent' ,
    // 熱帶樂園
    Breeze = '/Game/Maps/Foxtrot/Foxtrot' ,
    // 蓮華古城
    Lotus = '/Game/Maps/Jam/Jam' ,
    // 遺落境地
    Haven = '/Game/Maps/Triad/Triad' ,
    // 雙塔迷城
    Split = '/Game/Maps/Bonsai/Bonsai' ,
    
    // 團隊死鬥模式 支持的地图
    //阿拉伯堡壘
    Kasbah = '/Game/Maps/HURM/HURM_Bowl/HURM_Bowl' ,
    //浮木港灣
    Drift = '/Game/Maps/HURM/HURM_Helix/HURM_Helix' ,
    //義式廣場
    Piazza = '/Game/Maps/HURM/HURM_Yard/HURM_Yard' ,
    //鐵蹄特區
    District = '/Game/Maps/HURM/HURM_Alley/HURM_Alley' ,
    
}

const ValorantHURMModeMapKey = [ 'Kasbah' , 'Drift' , 'Piazza' , 'District' ]

const ValorantGameRule = {
    //允许密技
    AllowGameModifiers : 'false' ,
    //延长赛模式：DEUCE制
    IsOvertimeWinByTwo : 'true' ,
    //完整回合全力尽战
    PlayOutAllRounds : 'false' ,
    //隐藏对战纪录
    SkipMatchHistory : 'false' ,
    //锦标赛模式
    TournamentMode : 'false' ,
}

type ValorantGameRuleConf = typeof ValorantGameRule

type ValorantCustomRoomConfig = {
    serverNode : ValorantServerNodeKey, //服务器节点
    mode : ValorantModeKey, //游戏模式
    map : ValorantMapKey, //地图
    gameRule : ValorantGameRuleConf | null //游戏规则
}


enum ValorantApiErrorEnum {
    //无错误
    NotError = 0 ,
    //未知
    Unknown = -1000 ,
    //参数错误
    ParamError = -1001 ,
    //未启动 Riot 登录器
    UnStart = -1002 ,
    //未登录 Riot 账号
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


interface PlayerInfoStruct {
    sub : string
}

class ValorantApiError extends AxiosError {
    errorNo : number
    errorMsg : string
    
    constructor( code : number , message : string ) {
        super( message )
        this.errorNo = code
        this.errorMsg = message
    }
}


interface SeasonMMRInfoStruct {
    'SeasonID' : string,
    'NumberOfWins' : number,
    'NumberOfWinsWithPlacements' : number,
    'NumberOfGames' : number,
    'Rank' : number,
    'CapstoneWins' : number,
    'LeaderboardRank' : number,
    'CompetitiveTier' : number,
    'RankedRating' : number,
    'WinsByTier' : Record<string , number>,
    'GamesNeededForRating' : number,
    'TotalWinsNeededForRank' : number
}

interface MMRInfoStruct {
    Subject : string
    QueueSkills : {
        competitive : {
            SeasonalInfoBySeasonID : Record<string , SeasonMMRInfoStruct>
        }
    }
}

interface ValorantAPIResultStruct {
    code : number
    message : string
    result : any
}

const logger = new CustomLogger( 'ValorantApi' )


export class ValorantAPI {
    
    private _client : ValorantApiClient = null as unknown as ValorantApiClient
    private _playerInfo : PlayerInfoStruct | null = null
    private _connectInfo : ValorantAPIResultStruct = {
        code : ValorantApiErrorEnum.NotError ,
        message : 'Success' ,
        result : true ,
    }
    private _websocket : ValorantWebSocket = null as unknown as ValorantWebSocket
    private _connected : boolean = false
    private _event : ValorantEvent = null as unknown as ValorantEvent
    private _currentPartyId : string = ''
    private _currentMatchIntroCache : any = null
    private _currentSeasonId : string = ''
    private _cacheMMRInfo : MMRInfoStruct | any = null
    private _currentGameParamsCache : any = null
    private _error : ValorantAPIResultStruct | null = null
    
    
    constructor( event : ValorantEvent , websocket : ValorantWebSocket ) {
        this._event = event
        this._websocket = websocket
        this._createValorantApiClient( true )
        logger.debug( 'event url : ' , event.getEventReqUrl() )
    }
    
    public setEventUrl( eventName : EventReqUrlKey , url : string ) : Promise<ValorantAPIResultStruct> {
        return (async () => {
            this._event.setEventReqUrl( eventName , url )
            return this._returnPackage( ValorantApiErrorEnum.NotError , 'Set event url success' , true )
        })().catch( ( e : any ) => {
            logger.error( 'setEventUrl Error :' , e )
            return this._returnPackage( ValorantApiErrorEnum.Unknown , 'Set event url fail' , false )
        } )
    }
    
    public setHttpEventHeader( reqHeader : Record<string , string> ) : Promise<ValorantAPIResultStruct> {
        return (async () => {
            this._event.setEventReqHeader( reqHeader )
            return this._returnPackage( ValorantApiErrorEnum.NotError , 'Set event url success' , true )
        })().catch( ( e : any ) => {
            logger.error( 'setEventUrl Error :' , e )
            return this._returnPackage( ValorantApiErrorEnum.Unknown , 'Set event url fail' , false )
        } )
    }
    
    public getError() : ValorantAPIResultStruct | null {
        return this._error
    }
    
    private _returnPackage<T>( code : number , message : string , result : T = null as T ) : ValorantAPIResultStruct {
        return { code : code , message : message , result : result }
    }
    
    public reconnect( createWsConnect : boolean = true ) : Promise<ValorantAPIResultStruct> {
        return (async () => {
            await this._createValorantApiClient( createWsConnect )
            logger.debug( 'reconnect : ' , this._connected )
            return this._connectInfo
        })().catch( ( e ) => {
            logger.error( 'reconnect Error : ' , e )
            return this._returnPackage( e.errorNo ? e.errorNo : ValorantApiErrorEnum.Unknown , e.message , false )
        } )
    }
    
    public setConnectInfo( status : boolean , connectInfo : ValorantAPIResultStruct | null = null ) : void {
        this._connected = status
        if ( connectInfo !== null ) {
            this._connectInfo = connectInfo
        }
    }
    
    private _createValorantApiClient( createWsConnect : boolean = false ) : Promise<void> {
        return (async () => {
            this._client = await createValorantApiClient( {
                auth : useProviders( provideClientVersionViaVAPI() ) ,
                local : useProviders( provideLockFile() ) ,
                remote : useProviders( [ provideLogFile() , provideAuthViaLocalApi() ] ) ,
            } )
            const { data : rsoUserInfo } = await this._client.local.getrsoUserInfo()
            if ( !rsoUserInfo ) {
                throw new ValorantApiError( ValorantApiErrorEnum.Unknown , 'Can\'t get rsoUserInfo' )
            }
            this._playerInfo = JSON.parse( rsoUserInfo.userInfo )
            logger.debug( 'rsoUserInfo : ' , this._playerInfo )
            if ( createWsConnect ) {
                const websocketConn = this._websocket.connect( this._client.local.options )
                if ( websocketConn === false ) {
                    throw new ValorantApiError( ValorantApiErrorEnum.WebSocketError , 'Websocket connect fail' )
                }
            }
            this._connected = true
            this._connectInfo = {
                code : ValorantApiErrorEnum.NotError ,
                message : 'Create valorant client success' ,
                result : true ,
            }
        })().catch( ( e : ValorantApiError ) => {
            logger.error( 'createValorantApiClient Error: ' , e )
            this._connected = false
            this._connectInfo = this._returnPackage( ValorantApiErrorEnum.Unknown , e.message , this._connected )
            if ( e.message.includes( 'lockfile' ) || e.message.includes( 'connect ECONNREFUSED' ) ) {
                this._connectInfo = this._returnPackage( ValorantApiErrorEnum.UnStart , 'Riot Client is not started' , this._connected )
            } else if ( e.message.includes( 'logfile' ) ) {
                this._connectInfo = this._returnPackage( ValorantApiErrorEnum.UnStart , 'valorant has not been started' , this._connected )
            } else if ( e.code !== undefined && e.code === 'ERR_BAD_REQUEST' ) {
                this._connectInfo = this._returnPackage( ValorantApiErrorEnum.NotLogged , 'Riot Client is not logged in' , this._connected )
            } else if ( e.errorNo !== undefined && e.errorNo === ValorantApiErrorEnum.WebSocketError ) {
                this._connectInfo = this._returnPackage( ValorantApiErrorEnum.WebSocketError , 'Websocket connect fail' , this._connected )
            }
        } )
    }
    
    
    public checkUserInGameLobby() : Promise<ValorantAPIResultStruct> {
        return (async () => {
            const puuid = this._client.remote.puuid
            logger.debug( 'checkUserInGameLobby UUID : ' , puuid )
            const { data : partyPlayer } = await this._client.remote.getPartyPlayer( {
                data : {
                    puuid : puuid ,
                } ,
            } )
            logger.debug( 'checkUserInGameParty : ' , partyPlayer )
            this._currentPartyId = partyPlayer.CurrentPartyID
            return this._returnPackage( ValorantApiErrorEnum.NotError , 'checkUserInGameParty success' , true )
        })().catch( ( e ) => {
            logger.warn( 'checkUserInGameParty Error :' , e )
            if ( e.response ) {
                this._error = this._getErrorDetail( e )
            }
            const error = this._getErrorDetail(e)
            error.result = false
            return error
        } )
    }
    
    private async _checkApiIsAvailableThrowError( onlyCheckConnected : boolean = false ) : Promise<void> {
        if ( !this._connected ) {
            const connResult = await this.reconnect( true )
            if ( connResult.result === false ) {
                throw new ValorantApiError( connResult.code , connResult.message )
            }
        }
        if ( !onlyCheckConnected ) {
            const inGameLobby = await this.checkUserInGameLobby()
            if ( inGameLobby.result === false )  {
                if ( this._error !== null && this._error.code === ValorantApiErrorEnum.TokenExpired ) {
                    logger.debug( 'Token Expired  , Reconnect' )
                    await this.reconnect( false )
                    return
                }
                const errCode = this._error !== null && this._error.code ? this._error.code : ValorantApiErrorEnum.Unknown
                const msg = this._error !== null && this._error.message ? this._error.message : 'Not in game lobby'
                throw new ValorantApiError( errCode , msg )
            }
        }
    }
    
    private _getErrorDetail( e : any ) : ValorantAPIResultStruct {
        let errorCode = e.errorNo ? e.errorNo : ValorantApiErrorEnum.Unknown
        let message = e.errorMsg ? e.errorMsg : e.message
        if ( e.response ) {
            [ errorCode , message ] = this._convertErrorInfo( e.response.data.errorCode , e.response.data.message )
            if ( errorCode === ValorantApiErrorEnum.Unknown && e.response.data.message ) {
                message = e.response.data.errorCode + '-' + e.response.data.message
            }
        }
        return {
            code : errorCode ,
            message : message ,
            result : null ,
        }
    }
    
    private _convertErrorInfo( errorCode : string , message : string ) : unknown[] {
        let errCode = ValorantApiErrorEnum.Unknown
        let msg = message
        switch (errorCode) {
            case 'PLAYER_DOES_NOT_EXIST' :
                errCode = ValorantApiErrorEnum.NotInGameLobby
                msg = 'Not in game lobby'
                break
            case 'RESOURCE_NOT_FOUND' :
                errCode = ValorantApiErrorEnum.NotInGameLobby
                msg = 'Not in game lobby'
                break
            case 'NOT_PARTY_OWNER' :
                errCode = ValorantApiErrorEnum.NotPermission
                break
            case 'BAD_CLAIMS' :
                errCode = ValorantApiErrorEnum.TokenExpired
                break
            case 'MATCH_NOT_FOUND' :
                errCode = ValorantApiErrorEnum.NoMatchRecord
                break
        }
        if ( errCode === ValorantApiErrorEnum.Unknown ) {
            msg = `${ errCode } - ${ message }`
        }
        return [ errCode , msg ]
    }
    
    public getPlayerInfo() : Promise<ValorantAPIResultStruct> {
        return (async () => {
            if ( this._playerInfo ) {
                return this._returnPackage( ValorantApiErrorEnum.NotError , 'Get player info success' , this._playerInfo )
            }
            return this._returnPackage( this._connectInfo.code , this._connectInfo.message , this._playerInfo )
        })().catch( ( e ) => {
            return this._returnPackage( ValorantApiErrorEnum.Unknown , e.message , null )
        } )
    }
    
    public getPartyInfo() : Promise<ValorantAPIResultStruct> {
        return (async () => {
            await this._checkApiIsAvailableThrowError()
            const puuid = this._client.remote.puuid
            const { data : partyPlayer } = await this._client.remote.getPartyPlayer( {
                data : {
                    puuid : puuid ,
                } ,
            } )
            const { data : partyResult } = await this._client.remote.getParty( {
                data : {
                    partyId : partyPlayer.CurrentPartyID ,
                } ,
            } )
            this._currentPartyId = partyPlayer.CurrentPartyID
            logger.debug( 'getPartyInfo : ' , partyResult )
            return this._returnPackage( ValorantApiErrorEnum.NotError , 'Get party info success' , partyResult )
        })().catch( ( e ) => {
            logger.error( 'getPartyInfo Error :  ' , e )
            const error = this._getErrorDetail( e )
            return this._returnPackage( error.code , error.message , null )
        } )
    }
    
    private _getMMRList( forceRefresh : boolean = false ) : Promise<MMRInfoStruct> {
        return (async () => {
            if ( !forceRefresh && this._cacheMMRInfo ) {
                return this._cacheMMRInfo
            }
            const { data : mmrInfo } = await this._client.remote.getPlayerMmr( {
                data : {
                    puuid : this._client.remote.puuid ,
                } ,
            } )
            this._cacheMMRInfo = mmrInfo
            return mmrInfo
        })().catch( ( e ) => {
            throw e
        } )
    }
    
    public getPlayerMMR( forceRefresh : boolean = false ) : Promise<ValorantAPIResultStruct> {
        return (async () => {
            await this._checkApiIsAvailableThrowError( true )
            if ( !this._currentSeasonId ) {
                await this.getCurrentSeason()
            }
            const mmrInfo = await this._getMMRList( forceRefresh )
            logger.debug( 'getPlayerMMR : ' , mmrInfo )
            for ( const [ seasonId , seasonMmr ] of Object.entries( mmrInfo.QueueSkills.competitive.SeasonalInfoBySeasonID ) ) {
                if ( seasonId === this._currentSeasonId ) {
                    return this._returnPackage( ValorantApiErrorEnum.NotError , 'Get player mmr success' , seasonMmr.CompetitiveTier )
                }
            }
            throw new ValorantApiError( ValorantApiErrorEnum.Unknown , 'Not found player mmr' )
        })().catch( ( e ) => {
            logger.error( 'getPlayerMMR Error :' , e )
            const error = this._getErrorDetail( e )
            return this._returnPackage( error.code , error.message , 0 )
        } )
    }
    
    public getPlayerRecentlyBestMMR( forceRefresh : boolean = false ) : Promise<ValorantAPIResultStruct> {
        return (async () => {
            await this._checkApiIsAvailableThrowError( true )
            const mmrInfo = await this._getMMRList( forceRefresh )
            logger.debug( 'getPlayerMMR : ' , mmrInfo )
            let maxCompetitiveTier = 0
            for ( const [ seasonId , seasonMmr ] of Object.entries( mmrInfo.QueueSkills.competitive.SeasonalInfoBySeasonID ) ) {
                if ( seasonMmr.CompetitiveTier > maxCompetitiveTier ) {
                    maxCompetitiveTier = seasonMmr.CompetitiveTier
                }
            }
            throw new ValorantApiError( ValorantApiErrorEnum.Unknown , 'Not found player mmr' )
        })().catch( ( e : ValorantApiError ) => {
            logger.error( 'getPlayerMMR Error :' , e )
            const error = this._getErrorDetail( e )
            return this._returnPackage( error.code , error.message , 0 )
        } )
    }
    
    public getCurrentMatchDetail() : Promise<any> {
        return (async () => {
            await this._checkApiIsAvailableThrowError()
            if ( !this._currentMatchIntroCache ) {
                logger.warn( 'getCurrentMatchDetail : no current match intro cache' )
                return null
            }
            const { data : matchDetail } = await this._client.remote.getMatchDetails( {
                data : {
                    matchId : this._currentMatchIntroCache.MatchID ,
                } ,
            } )
            logger.debug( 'getCurrentMatchDetail : ' , matchDetail )
            this._currentMatchIntroCache = null
            return matchDetail
        })().catch( ( e : ValorantApiError ) => {
            logger.error( 'getCurrentMatchDetail Error :' , e )
            this._error = this._getErrorDetail( e )
            const matchId = this._currentMatchIntroCache.MatchID
            this._currentMatchIntroCache = null
            return {
                matchInfo : {
                    matchId : matchId ,
                } ,
            }
        } )
    }
    
    public getCurrentSeason() : Promise<ValorantAPIResultStruct> {
        return (async () => {
            const res = await this.getSeasonList()
            const seasonList = res.result
            logger.debug( 'getCurrentSeason : ' , seasonList )
            if ( seasonList && seasonList.length > 0 ) {
                for ( const season of seasonList ) {
                    if ( season.IsActive ) {
                        this._currentSeasonId = season.ID
                        return this._returnPackage( ValorantApiErrorEnum.NotError , 'Get current season success' , season )
                    }
                }
            }
            return this._returnPackage( ValorantApiErrorEnum.NotError , 'Not found current season' , null )
        })().catch( ( e ) => {
            logger.error( 'getCurrentSeason Error :' , e )
            let message = e.message
            if ( e.response && e.response.data ) {
                message = e.response.data?.message
            }
            return this._returnPackage( e.errorNo ? e.errorNo : ValorantApiErrorEnum.Unknown , message , null )
        } )
    }
    
    public getSeasonList() : Promise<ValorantAPIResultStruct> {
        return (async () => {
            await this._checkApiIsAvailableThrowError( true )
            const { data : result } = await this._client.remote.getFetchContent( { parseResponseData : true } )
            logger.debug( 'getSeasonList : ' , result )
            if ( result?.Seasons && result.Seasons.length > 0 ) {
                return this._returnPackage( ValorantApiErrorEnum.NotError , 'Get current season success' , result.Seasons )
            }
            return this._returnPackage( ValorantApiErrorEnum.NotError , 'Not found current season' , [] )
        })().catch( ( e ) => {
            logger.error( 'getSeasonList Error :' , e )
            const error = this._getErrorDetail( e )
            return this._returnPackage( error.code , error.message , [] )
        } )
    }
    
    private _getCustomGameSettingsBody( config : ValorantCustomRoomConfig ) : any {
        if ( !ValorantMode.hasOwnProperty( config.mode ) ) {
            throw new ValorantApiError( ValorantApiErrorEnum.ParamError , `Invalid mode : ${ config.mode }` )
        }
        if ( !ValorantMap.hasOwnProperty( config.map ) ) {
            throw new ValorantApiError( ValorantApiErrorEnum.ParamError , `Invalid map : ${ config.map }` )
        }
        if ( config.mode === 'HURM' && ValorantHURMModeMapKey.includes( config.map ) === false ) {
            throw new ValorantApiError( ValorantApiErrorEnum.ParamError , `Invalid map for HURM mode : ${ config.map }` )
        }
        const map = ValorantMap[config.map]
        const mode = ValorantMode[config.mode]
        const serverNode = ValorantServerNode[config.serverNode]
        const gameRules = ValorantGameRule
        return {
            Map : map ,
            Mode : mode ,
            UseBots : false ,
            GamePod : serverNode ,
            GameRules : gameRules ,
        }
    }
    
    public createCustomRoom( config : ValorantCustomRoomConfig , httpEventParams : any ) : Promise<ValorantAPIResultStruct> {
        return (async () => {
            await this._checkApiIsAvailableThrowError()
            if ( this._currentPartyId.length === 0 ) {
                const puuid = this._client.remote.puuid
                const { data : partyPlayer } = await this._client.remote.getPartyPlayer( {
                    data : {
                        puuid : puuid ,
                    } ,
                } )
                this._currentPartyId = partyPlayer.CurrentPartyID
                await this._sleep( this._getRandomInt( 500 , 1500 ) )
            }
            logger.debug( 'currentPartyId : ' , this._currentPartyId )
            const makecustomgameResult = await this._client.remote.callEndpoint(
                'glz' ,
                `parties/v1/parties/${ this._currentPartyId }/makecustomgame` ,
                { method : 'POST' } ,
            )
            logger.debug( 'makecustomgameResult : ' , makecustomgameResult )
            await this._sleep( this._getRandomInt( 500 , 1500 ) )
            
            let customGameSettingsBody = this._getCustomGameSettingsBody( config )
            logger.debug( 'customGameSettingsBody : ' , customGameSettingsBody )
            customGameSettingsBody.partyId = this._currentPartyId
            const { data : customGameSettingsResult } = await this._client.remote.postSetCustomGameSettings( {
                data : customGameSettingsBody ,
            } )
            logger.debug( 'customGameSettingsResult : ' , customGameSettingsResult )
            await this._sleep( this._getRandomInt( 500 , 1500 ) )
            
            const { data : createRoomResult } = await this._client.remote.postPartyGenerateCode( {
                data : {
                    partyId : this._currentPartyId ,
                } ,
            } )
            logger.debug( 'createCustomRoom : ' , createRoomResult )
            
            let data = {
                'partyId' : createRoomResult.ID ,
                'inviteCode' : createRoomResult.InviteCode ,
            }
            this._event.trigger( 'CreateCustomRoom' , createRoomResult , httpEventParams )
            return this._returnPackage( ValorantApiErrorEnum.NotError , 'Create room success' , data )
        })().catch( ( e ) => {
            logger.error( 'createCustomRoom Error : ' , e )
            const error = this._getErrorDetail( e )
            const returnPackage = this._returnPackage( error.code , error.message , null )
            this._event.trigger( 'CreateCustomRoom' , null , httpEventParams , returnPackage )
            return returnPackage
        } )
    }
    
    public joinCustomRoomByCode( inviteCode : string , httpEventParams : any ) : Promise<ValorantAPIResultStruct> {
        return (async () => {
            await this._checkApiIsAvailableThrowError()
            const inviteCodeTrim = inviteCode.trim()
            if ( inviteCodeTrim.length !== 6 ) {
                return this._returnPackage( ValorantApiErrorEnum.ParamError , 'inviteCode must be 6 characters' , null )
            }
            const { data : joinCustomRoomResult } = await this._client.remote.postPartyJoinByCode( {
                data : {
                    code : inviteCodeTrim ,
                } ,
            } )
            logger.debug( 'joinCustomRoomByCode : ' , joinCustomRoomResult )
            this._currentPartyId = joinCustomRoomResult.CurrentPartyID
            await this._sleep( this._getRandomInt( 1000 , 2000 ) )
            const partyInfo = await this.getPartyInfo()
            logger.debug( 'partyInfo : ' , partyInfo.result )
            this._event.trigger( 'JoinCustomRoom' , joinCustomRoomResult , httpEventParams )
            return this._returnPackage( ValorantApiErrorEnum.NotError , 'Join room success' , true )
        })().catch( ( e ) => {
            logger.error( 'joinCustomRoomByCode Error : ' , e )
            const error = this._getErrorDetail( e )
            const returnPackage = this._returnPackage( error.code , error.message , null )
            this._event.trigger( 'JoinCustomRoom' , null , httpEventParams , returnPackage )
            return returnPackage
        } )
    }
    
    private _sleep( ms : number ) : Promise<void> {
        logger.debug( `sleep ${ ms }ms` )
        return new Promise( ( resolve , reject ) => {
            try {
                setTimeout( resolve , ms )
            } catch ( e ) {
                reject( e )
            }
        } )
    }
    
    private _getRandomInt( min : number , max : number ) : number {
        const minC = Math.ceil( min )
        const maxF = Math.floor( max )
        return Math.floor( Math.random() * (minC - maxF + 1) ) + min
    }
    
    public getCurrentGameParams() : any {
        return this._currentGameParamsCache
    }
    
    public clearCurrentGameParams() {
        this._currentGameParamsCache = null
    }
    
    public startCustomRoomGame( config : ValorantCustomRoomConfig , httpEventParams : any ) : Promise<ValorantAPIResultStruct> {
        return (async () => {
            await this._checkApiIsAvailableThrowError()
            let customGameSettingsBody = this._getCustomGameSettingsBody( config )
            logger.debug( 'customGameSettingsBody : ' , customGameSettingsBody )
            const { data : customGameSettingsResult } = await this._client.remote.postSetCustomGameSettings( {
                data : { ...{ partyId : this._currentPartyId } , ...customGameSettingsBody } ,
            } )
            logger.debug( 'customGameSettingsResult : ' , customGameSettingsResult )
            const { data : startCustomGameResult } = await this._client.remote.postStartCustomGame( {
                data : { partyId : this._currentPartyId } ,
            } )
            logger.debug( 'startCustomGameResult : ' , startCustomGameResult )
            this._currentGameParamsCache = httpEventParams
            this._event.trigger( 'StartGame' , { status : true , message : '' } , httpEventParams )
            return this._returnPackage( ValorantApiErrorEnum.NotError , 'Start room success' , true )
        })().catch( ( e ) => {
            logger.error( 'startCustomRoomGame Error : ' , e )
            const error = this._getErrorDetail( e )
            const returnPackage = this._returnPackage( error.code , error.message , false )
            this._event.trigger( 'StartGame' , {
                status : false ,
                message : error.message ,
            } , httpEventParams , returnPackage )
            return returnPackage
        } )
    }
    
    public hasCurrentMatchIntroCache() : boolean {
        return this._currentMatchIntroCache ? true : false
    }
    
    public getCurrentMatch() : Promise<any> {
        return (async () => {
            await this._checkApiIsAvailableThrowError()
            const { data : currentMatch } = await this._client.remote.getPreGamePlayer( {
                data : { puuid : this._client.remote.puuid } ,
            } )
            this._currentMatchIntroCache = currentMatch
            logger.debug( 'currentMatch : ' , currentMatch )
            return currentMatch
        })().catch( ( e ) => {
            logger.error( 'getCurrentMatch Error : ' , e )
            return null
        } )
    }
    
    public removePlayer( puuid : string , httpEventParams : any ) : Promise<ValorantAPIResultStruct> {
        return (async () => {
            /* const { data : removePlayerResult } = await this._client.remote.deletePartyRemovePlayer( {
                 data : { puuid : puuid }
             } )
             logger.debug( `removePlayerResult : ` , removePlayerResult )
             this._event.removePlayer( removePlayerResult , httpEventParams )*/
            return this._returnPackage( ValorantApiErrorEnum.NotError , 'Remove player success' , true )
        })().catch( ( e ) => {
            logger.error( 'removePlayer Error : ' , e )
            let message = e.message
            if ( e.response && e.response.data.errorCode ) {
                message = e.response.data.message
            }
            return this._returnPackage( ValorantApiErrorEnum.Unknown , message , false )
        } )
    }
    
}

export default ValorantAPI
