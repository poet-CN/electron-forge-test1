import { ValorantAPI } from './api'
import { ValorantEvent } from './event'
import { ValorantWSEventCallbackList , ValorantWebSocket } from './websocket'


const ValorantHttpEvent = new ValorantEvent()

const ValorantWsClient = new ValorantWebSocket()
const ValorantApi = new ValorantAPI( ValorantHttpEvent , ValorantWsClient )

const callbackList : ValorantWSEventCallbackList = {
    Login : async () => {
        console.log( 'riot login callback' )
        await ValorantApi.reconnect( false )
    } ,
    Logout : async () => {
    
    },
    PlayGame : async () => {
        if ( ValorantApi.hasCurrentMatchIntroCache() === false ) {
            const matchIntro = await ValorantApi.getCurrentMatch()
            if ( matchIntro !== null ) {
                ValorantHttpEvent.trigger( 'PlayGame' , matchIntro , ValorantApi.getCurrentGameParams() )
            }
        }
    } ,
    EndGame : async () => {
        setTimeout( async () => {
            const matchDetail = await ValorantApi.getCurrentMatchDetail()
            if ( matchDetail !== null ) {
                ValorantHttpEvent.trigger( 'EndGame' , matchDetail , ValorantApi.getCurrentGameParams() )
                ValorantApi.clearCurrentGameParams()
            }
        } , 3000 )
    } ,
    CloseRiot : async () => {
        ValorantApi.setConnectInfo(false)
    },
}
ValorantWsClient.setEventCallback( callbackList )
export { ValorantApi }
