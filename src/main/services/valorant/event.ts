import axios , { AxiosResponse , AxiosError } from 'axios'
import { CustomLogger } from '../logger'


const devEnv : boolean = process.env.NODE_ENV === 'development'

const reqDomain = devEnv ? 'https://api-core-test.gonxt.com/api/nxt' : 'https://api-core.gonxt.com/api/nxt'

enum EventReqUrlEnum {
    StartGame = '/valorant/game/start' ,
    EndGame = '/valorant/game/over' ,
    CreateCustomRoom = '/valorant/game/create/room' ,
    JoinCustomRoom = '/valorant/game/join/room' ,
    PlayGame = '/valorant/game/start/real' ,
}

export type EventReqUrlKey = keyof typeof EventReqUrlEnum

type EventReqUrl = {
    StartGame : string
    EndGame : string
    CreateCustomRoom : string
    JoinCustomRoom : string
    PlayGame : string
}

type RequestHeader = {
    [key : string] : string
}

const logger = new CustomLogger( 'ValorantEvent' )
type EventData = {
    event : EventReqUrlKey,
    errorCode : number,
    message : string,
    params : any,
    data : any,
}

export class ValorantEvent {
    
    private _reqUrl : EventReqUrl = {
        StartGame : EventReqUrlEnum.StartGame ,
        EndGame : EventReqUrlEnum.EndGame ,
        CreateCustomRoom : EventReqUrlEnum.CreateCustomRoom ,
        JoinCustomRoom : EventReqUrlEnum.JoinCustomRoom ,
        PlayGame : EventReqUrlEnum.PlayGame ,
    }
    private _reqHeader : RequestHeader = { 'Content-Type' : 'application/json' }
    
    public constructor() {
        for ( const [ eventName , reqPath ] of Object.entries( this._reqUrl ) ) {
            if ( typeof reqPath === 'string' && !reqPath.startsWith( 'http' ) ) {
                const key = eventName as EventReqUrlKey
                this._reqUrl[key] = reqDomain + reqPath
            }
        }
    }
    
    
    public getEventReqUrl() : EventReqUrl {
        return this._reqUrl
    }
    
    public setEventReqUrl( eventKey : EventReqUrlKey , reqUrl : string ) {
        if ( this._reqUrl.hasOwnProperty( eventKey ) ) {
            this._reqUrl[eventKey] = reqUrl
        } else {
            logger.warn( `${ eventKey } is not exist` )
        }
    }
    
    public setEventReqHeader( reqHeader : RequestHeader ) {
        this._reqHeader = { ...this._reqHeader , ...reqHeader }
    }
    
    public trigger( event : EventReqUrlKey , data : any , httpReturnParams : any = null , error:any = null )  {
        logger.debug( `${ event } : ` , data )
        const waitSendData = this._packageData( event , data , httpReturnParams , error?.code , error?.message )
        this._postRequest( event , waitSendData )
    }
    
    private _packageData( event : EventReqUrlKey , data : any , params : any , errorCode:number = 0 , message:string = '' ) : EventData {
        return {
            event : event ,
            errorCode : errorCode ,
            message : message ,
            params : params ,
            data : data ,
        }
    }
    
    private _postRequest( event : EventReqUrlKey , data : EventData ) {
        const headers = this._reqHeader
        const eventUrl = this._reqUrl[event]
        logger.debug( `${ event } req url : ${ eventUrl } header : ` , headers , `data : ` , data )
        axios.post( eventUrl , data , { headers } )
            .then( ( res : AxiosResponse ) => {
                logger.debug( `${ event } res : ` , res )
            } ).catch( ( err : AxiosError ) => {
                logger.error( `${ event } : ` , err )
            } )
    }
}

export default ValorantEvent
