import { connect as SocketConnect, Socket } from 'socket.io-client'
import { Keyboard, IGlobalKeyEvent, IGlobalKeyDownMap } from './Keyboard'
import { StartHandlers } from './Handlers'
import { IClientInfo } from '../Shared/IClientInfo'
import { Recorder } from './Recorder'
import { Host, Port, Client, Shortcuts } from '../client.json'

export default function Start() {
    console.log(`Startup client [type=${Client.Type}] [location=${Client.Location}]`)
    
    const socket: Socket = SocketConnect(`http://${Host}:${Port}`, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 5000
    })

    StartHandlers(socket)

    socket.connect()

    //#region Recording and sending audio data
    let recipient: string | string[] = ''

    Recorder._stream.on('data', (audio: any) => {
        socket.emit('send_audio', {
            Audio: audio,
            Locations: recipient,
            Sender: Client as IClientInfo
        })
    })

    function Shortcut(key: string, recip: string | string[]) {
        Keyboard.addListener((event: IGlobalKeyEvent, isDown: IGlobalKeyDownMap) => {
            if (event.state == 'DOWN' && event.name == key) {
                setTimeout(() => {
                    recipient = recip
                    Recorder._stream.resume()
                }, 250)
            }
        })

        Keyboard.addListener((event: IGlobalKeyEvent, isDown: IGlobalKeyDownMap) => {
            if (event.state == 'UP' && event.name == key) {
                setTimeout(() => {
                    Recorder._stream.pause()
                }, 250)
            }
        })
    }

    for (let key in Shortcuts) {
        let location: string | string[] = Shortcuts[key]

        Shortcut(key, location)
    }

    Keyboard.run()
    //#endregion
}