import { readFileSync } from 'fs'
import { join } from 'path'
import { Socket, connect as SocketConnect } from 'socket.io-client'
import { IClientInfo } from '../Shared/IClientInfo'
import { ReadyStatus } from '../Shared/ReadyStatus'
import { Client, Host, Port, Shortcuts } from '../client.json'
import { StartHandlers } from './Handlers'
import { IGlobalKeyDownMap, IGlobalKeyEvent, Keyboard } from './Keyboard'
import { Recorder } from './Recorder'
import { speaker } from './Speaker'
import player from 'node-wav-player'

let Recipient: string | string[] = ''
let ReadyStart: ReadyStatus = ReadyStatus.Yes
const StartRecordWav = readFileSync(join(__dirname, '../SFX/uvedomlenie-o-poluchennoy-pochte.wav'))
const EndRecordWav = readFileSync(join(__dirname, '../SFX/end_record.wav'))

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

    Recorder._stream.on('data', (audio: any) => {
        socket.emit('send_audio', {
            Audio: audio,
            Locations: Recipient,
            Sender: Client as IClientInfo
        })
        console.log('send chunk: to: ' + Recipient)
    })

    InitializationKeyboard()
}

function InitializationKeyboard(): void {
    function Shortcut(key: string, recip: string | string[]) {
        Keyboard.addListener((event: IGlobalKeyEvent, isDown: IGlobalKeyDownMap) => {
            if (event.state == 'DOWN' && event.name == key && ReadyStart == ReadyStatus.Yes) {
                ReadyStart = ReadyStatus.No

                // speaker.write(StartRecordWav)
                player.play({
                    path: join(__dirname, '../SFX/uvedomlenie-o-poluchennoy-pochte.wav')
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
                
                Recorder._stream.pause()
                // speaker.write(EndRecordWav)
                player.play({
                    path: join(__dirname, '../SFX/end_record.wav')
                })
                
                setTimeout(() => {
                    ReadyStart = ReadyStatus.Yes
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