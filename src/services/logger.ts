import { app } from 'electron'
import { Logger } from '@tsed/logger'
import '@tsed/logger-file'

export class CustomLogger {
    
    private _logger : Logger
    
    constructor( name : string ) {
        this._logger = new Logger( name )
        const logDir = app.getPath( 'logs' )
        this._logger.appenders
            .set( 'console-log' , {
                type : 'console' ,
                levels : [ 'debug' , 'info' , 'trace' , 'fatal' , 'error' , 'warn' ] ,
                layout : {
                    type : 'colored' ,
                } ,
            } )
            .set( 'logFile' , {
                type : 'file' ,
                levels : [ 'info' , 'fatal' , 'error' , 'warn' ] ,
                filename : `${ logDir }/app.log` ,
                pattern : '.yyyy-MM-dd-hh' ,
                maxLogSize : 10485760 , // 10MB
                backups : 5 ,
                layout : { type : 'basic' } ,//layout: {type: 'json', separator: ','},
            } )
    }
    
    public trace( ...args : any[] ) : Logger {
        return this._logger.trace( ...args )
    }
    
    public debug( ...args : any[] ) : Logger {
        return this._logger.debug( ...args )
    }
    
    public info( ...args : any[] ) : Logger {
        return this._logger.info( ...args )
    }
    
    public warn( ...args : any[] ) : Logger {
        return this._logger.warn( ...args )
    }
    
    public error( ...args : any[] ) : Logger {
        return this._logger.error( ...args )
    }
}

const logger = new Logger()
const logDir = app.getPath( 'logs' )
logger.appenders
    .set( 'console-log' , {
        type : 'console' ,
        levels : [ 'debug' , 'info' , 'trace' , 'fatal' , 'error' , 'warn' ] ,
        layout : {
            type : 'colored' ,
        } ,
    } )
    .set( 'logFile' , {
        type : 'file' ,
        levels : [ 'info' , 'fatal' , 'error' , 'warn' ] ,
        filename : `${ logDir }/app.log` ,
        maxLogSize : 10485760 , // 10MB
        backups : 5 ,
        compress : true ,
        layout : { type : 'basic' } ,//layout: {type: 'json', separator: ','},
    } )

export { logger }
