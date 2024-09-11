/*
 * @Author: 马铭扬
 * @Email：poet_cn@gonxt.com
 * @Date: 2024-09-04 16:12:36
 * @Description: 网页端和客户端交互文件
 * @FilePath: /gonxt-web-fe/src/services/client.ts
 */

import { wsSeqId, clearAccessToken } from '../../../utils/utils'
import PlatformMessageListener from './platform' // 平台级消息监听器
import CsMessageListener from './cs' // CS消息监听器
import VaMessageListener from './va' // VA消息监听器

// 错误码枚举值
const CLIENT_MESSAGE_ERROR = {
    not_in_client: 1,
    timeout: 2,
}

const ClientMessage: ClientMessageInterface = {
    iframeContentWindow: undefined,
    // 初始化
    init (iframeContentWindow) {
        if (!iframeContentWindow) {
            return false
        }
        this.iframeContentWindow = iframeContentWindow
        window.addEventListener('message', this.onReceiveMessage, false)
        this.bindEvent()
        return true
    },
    // 事件监听器
    eventListener: {},
    // 注册事件监听器的方法
    on (listener, callback) {
        if (!listener) {
            return
        }
        this.eventListener[listener] = {
            callback,
        }
    },
    // 取消事件监听器的方法。若不传参，则取消所有监听
    off (listener) {
        if (!listener) {
            this.eventListener = {}
            return
        }
        delete this.eventListener[listener]
    },
    // 销毁实例
    break () {
        this.off()
        clearAccessToken()
        this.iframeContentWindow = undefined
        window.removeEventListener('message', this.onReceiveMessage, false)
    },
    // 消息队列，用来处理异步消息
    messageQueue: {},
    // 绑定事件
    bindEvent () {
        // 平台级消息监听器
        new PlatformMessageListener().init()
        // CS消息监听器
        new CsMessageListener().init()
        // VA消息监听器
        new VaMessageListener().init()
    },
    // 发送消息到website。single: 是否为不需要响应的单项消息，默认false
    sendMessage (message, single = false) {
        return new Promise((resolve, reject) => {
            // 唯一key
            const seq = wsSeqId()
            const requestMessage: MessageResponseData = {
                ...message,
                seq,
            }
            // 非单向消息
            if (!single) {
                // 记入消息队列
                this.messageQueue[seq] = {
                    resolve,
                    reject,
                    request: requestMessage,
                }
                // 响应超时逻辑
                setTimeout(() => {
                    if (this.messageQueue[requestMessage.seq]) {
                        this.messageQueue[requestMessage.seq].reject(CLIENT_MESSAGE_ERROR.timeout)
                        delete this.messageQueue[requestMessage.seq]
                    }
                }, 10000)
            }
            // 发消息
            this.sendMessageOnce(requestMessage)
            if (single) {
                resolve(true)
            }
        })
    },
    // 发送一次性消息到website
    sendMessageOnce (message) {
        if (!this.iframeContentWindow) {
            return
        }
        this.iframeContentWindow.postMessage(message, '*')
    },
    // 收到消息
    onReceiveMessage (event: MessageEvent<any>) {
        if (event.origin === location.origin) {
            return
        }
        if (!/gonxt|localhost|file/.test(location.href)) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Message not match')
            }
            return
        }
        const message = event.data
        // 处理消息队列
        if (ClientMessage.messageQueue[message.seq]) {
            ClientMessage.messageQueue[message.seq].resolve(message)
        }
        // 处理事件监听器
        if (message.cmd) {
            // @ts-ignore
            ClientMessage.eventListener[message.cmd]?.callback(message)
        }
        delete ClientMessage.messageQueue[message.seq]
    },
}

export default ClientMessage

interface ClientMessageInterface {
    iframeContentWindow: Window | undefined;
    // 初始化
    init: (iframeContentWindow: Window) => void;
    // 事件监听器
    eventListener: {
        // eslint-disable-next-line no-unused-vars
        [key in ClientListenerList]?: {
            callback: (data: any) => void;
        }
    };
    // 注册事件监听器的方法
    on: (listener: ClientListenerList, callback: (data: any) => void) => void;
    // 取消事件监听器的方法。若不传参，则取消所有监听
    off: (listener?: ClientListenerList) => void;
    // 销毁实例
    break: () => void;
    // 消息队列，用来处理异步消息
    messageQueue: {
        [seq: string]: RequestQueueItem;
    };
    // 绑定事件
    bindEvent: () => void;
    // 发送消息到website。single: 是否为不需要响应的单项消息，默认false
    sendMessage: (message: MessageData, single?: boolean) => Promise<any>;
    // 发送一次性消息到website
    sendMessageOnce: (message: MessageResponseData) => void;
    // 收到消息
    onReceiveMessage: (data: any) => void;
}

// 标准消息入参，seq为后生成
export interface MessageData {
    cmd: string;
    data?: any;
}

// 交互的消息体
export interface MessageResponseData extends MessageData {
    seq: string;
}

interface RequestQueueItem {
    resolve: (res: any) => void;
    reject: (reason?: any) => void;
    request: any; // 记录入参
}

// 可供绑定的事件监听器列表
type ClientListenerList =
    'USER_updateAccessToken' | // (客户端)发送accessToken到客户端
    'USER_clearAccessToken' | // 清空客户端的accessToken
    'CS_checkWorkshopFireMapExist' | // CS-校验练枪图是否存在
    'VA_checkUserInGameParty' | // VA-检测用户是否在游戏大厅
    'VA_getPlayerInfo' | // VA-获取玩家信息
    'VA_getPlayerMMR' | // VA-获取玩家当前赛季段位
    'VA_getPlayerRecentlyBestMMR' | // VA-获取玩家最近赛季最高段位
    'VA_getCurrentSeason' | // VA-获取当前赛季
    'VA_getSeasonList' | // VA-获取赛季列表
    'VA_createCustomRoom' | // VA-创建自定义房间
    'VA_joinCustomRoomByCode' | // VA-使用code码加入自定义房间
    'VA_startCustomRoomGame' // VA-开始自定义房间游戏
