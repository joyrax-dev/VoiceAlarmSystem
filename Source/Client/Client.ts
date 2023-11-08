import player from 'node-wav-player'
import { join } from 'path'
import { Socket, connect as SocketConnect } from 'socket.io-client'
import { IClientInfo } from '../Shared/IClientInfo'
import { ReadyStatus } from '../Shared/ReadyStatus'
import { Client, Host, Port } from '../client.json'
import { Shortcuts } from '../shortcuts.json'
import { StartHandlers } from './Handlers'
import { IGlobalKeyDownMap, IGlobalKeyEvent, Keyboard } from './Keyboard'
import { Recorder } from './Recorder'
import { Logger } from '../Shared/Logger'

let Recipient: string | string[] = ''
let ReadyStart: ReadyStatus = ReadyStatus.Yes

export default function Start() {
    Logger.info(`Startup client [type=${Client?.Type}] [location=${Client?.Location}]`)
    
    const socket: Socket = SocketConnect(`http://${Host}:${Port}`, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 5000
    })
    
    process.on('exit', (code: number) => {
        socket.disconnect()
        Logger.warn(`Client exited with code: ${code}`)
    })

    StartHandlers(socket)

    socket.connect()

    Recorder._stream.on('data', (audio: any) => {
        socket.emit('send_audio', {
            Audio: audio,
            Locations: Recipient
        })
        // console.log('send chunk: to: ' + Recipient)
    })

    if (Client.Type == 'OPERATOR') {
        InitializationKeyboard()
    }
}

function InitializationKeyboard(): void {
    function Shortcut(key: string, recip: string | string[]) {
        Keyboard.addListener((event: IGlobalKeyEvent, isDown: IGlobalKeyDownMap) => {
            if (event.state == 'DOWN' && event.name == key && ReadyStart == ReadyStatus.Yes) {
                ReadyStart = ReadyStatus.No
                console.log('start record')

                player.play({
                    path: join(__dirname, '../SFX/start_record.wav')
                })
                
                setTimeout(() => {
                    Recipient = recip
                    Recorder._stream.resume()
                }, 100)
            }
        })

        Keyboard.addListener((event: IGlobalKeyEvent, isDown: IGlobalKeyDownMap) => {
            if (event.state == 'UP' && event.name == key && ReadyStart == ReadyStatus.No) {
                ReadyStart = ReadyStatus.Maybe
                console.log('pre-stop record')
                
                setTimeout(() => {
                    Recorder._stream.pause()
                }, 200)
                
                player.play({
                    path: join(__dirname, '../SFX/end_record.wav')
                })
                
                setTimeout(() => {
                    ReadyStart = ReadyStatus.Yes
                    console.log('stop record')
                }, 1000)
            }
        })
    }

    for (let key in Shortcuts) {
        let location: string | string[] = Shortcuts[key]

        Shortcut(key, location)
    }

    Keyboard.run()
}