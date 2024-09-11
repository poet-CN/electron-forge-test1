import React, { useEffect, useRef, type MutableRefObject } from 'react'
import ClientMessage from '../main/services/message/website'

const App = () => {
    const iframeRef: MutableRefObject<HTMLIFrameElement | null> = useRef(null)

    useEffect(() => {
        if (iframeRef.current?.contentWindow) {
            ClientMessage.init(iframeRef.current.contentWindow)
        }
        return () => {
            ClientMessage.break()
        }
    }, [])

    return (
        <iframe ref={ iframeRef } src={ 'http://localhost:8000?from=client' }/>
    )
}

export default App
