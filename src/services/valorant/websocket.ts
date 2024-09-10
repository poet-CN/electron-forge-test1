import { ValorantWebsocketClient } from '@tqman/valorant-api-client'
import { CustomLogger } from '../logger'

const logger = new CustomLogger( 'ValorantWebSocket' )

enum ValorantWSEventUri {
    Login = '/riot-login/v1/status' ,
    Logout = '/rso-auth/v1/logout-reason',
    PlayGame = '/product-session/v1/external-sessions' ,
    EndGame = '/product-session/v1/external-sessions' ,
    CloseRiot = '/platform-ui/v1/status' ,
}

export type ValorantWSEventUriKey = keyof typeof ValorantWSEventUri

interface FunctionType {
    () : void
}

export type ValorantWSEventCallbackList = Record<ValorantWSEventUriKey , FunctionType>

export class ValorantWebSocket {
    private _client : ValorantWebsocketClient | null = null
    
    private _playing : boolean = false
    
    private _callbackList : ValorantWSEventCallbackList | null = null
    
    
    public connect( localOptions : any ) : boolean {
        logger.debug( 'localOptions : ' , localOptions )
        if ( localOptions ) {
            this._client = new ValorantWebsocketClient( localOptions )
            this._handleEventList()
            return true
        }
        return false
    }
    
    private _handleEventList() {
        if ( this._client !== null ) {
            this._handleOnJsonApiEvent()
        }
    }
    
    private _checkWsClient() {
        if ( this._client === null ) {
            throw new Error( 'wsClient is null' )
        }
    }
    
    private _handleOnJsonApiEvent() {
        try {
            const event = 'OnJsonApiEvent'
            this._checkWsClient()
            if ( this._client !== null ) {
                this._client?.subscribe( event )
                this._client?.on( event , ( dataPackage ) => {
                    // logger.debug(`OnJsonApiEvent : ` , dataPackage)
                    const eventName = this._parseEventName( dataPackage )
                    if ( eventName !== null ) {
                        this._eventCallback( eventName , ValorantWSEventUri[eventName] , dataPackage )
                    }
                } )
            }
        } catch ( e ) {
            logger.warn( 'OnJsonApiEvent error : ' , e )
        }
    }
    
    public setEventCallback( callbackList : ValorantWSEventCallbackList ) {
        this._callbackList = callbackList
    }
    
    private _parseEventName( dataPackage : any ) : ValorantWSEventUriKey | null {
        let eventName : ValorantWSEventUriKey | null = null
        if ( dataPackage.data && typeof dataPackage.data === 'object') {
            if ( dataPackage.data.hasOwnProperty( 'exitCode' ) && dataPackage.data.exitCode === 0 && dataPackage.data.phase ) {
                if ( dataPackage.data.phase === 'Gameplay' ) {
                    eventName = 'PlayGame'
                }
                if ( dataPackage.data.phase === 'Idle' ) {
                    eventName = 'EndGame'
                }
            }
            if ( dataPackage.data.phase && dataPackage.data.phase === 'logged_in' ) {
                eventName = 'Login'
            }
            if ( dataPackage.data.status && dataPackage.data.status === 'Destroyed'  ){
                eventName = 'CloseRiot'
            }
        }
        if ( dataPackage.data && typeof dataPackage.data === 'string' ) {
            if ( dataPackage.data === 'generic' && dataPackage.uri && dataPackage.uri === ValorantWSEventUri.Logout ){
                eventName = 'Logout'
            }
        }
        return eventName
    }
    
    private _eventCallback( eventName : ValorantWSEventUriKey , eventUri : string , dataPackage : any ) {
        if ( (eventUri === dataPackage.uri || dataPackage.uri.includes( eventUri )) && this._callbackList !== null && this._callbackList.hasOwnProperty( eventName )) {
            logger.debug( `event : ${ eventName } , wsResp : ` , dataPackage )
            if ( eventName === 'PlayGame' && this._playing === false ){
                this._playing = true
                this._callbackList.PlayGame()
            }else if ( eventName === 'EndGame' && this._playing === true  ) {
                this._playing = false
                this._callbackList.EndGame()
            }else{
                this._callbackList[eventName]()
            }
        }
    }
    
}

export default ValorantWebSocket
