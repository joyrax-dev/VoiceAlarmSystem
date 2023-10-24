import { readFileSync } from 'fs'
import { join } from 'path'
import { Socket, connect as SocketConnect } from 'socket.io-client'
import { IClientInfo } from '../Shared/IClientInfo'
import { ReadyStatus } from '../Shared/ReadyStatus'
import { Client, Host, Port, Shortcuts } from '../client.json'
import { StartHandlers } from './Handlers'
import { IGlobalKeyDownMap, IGlobalKeyEvent, Keyboard } from './Keyboard'
import { Playback } from './PlaybackEmitter'
import { Recorder } from './Recorder'
import { speaker } from './Speaker'

let Recipient: string | string[] = ''
let ReadyStart: ReadyStatus = ReadyStatus.Yes
const StartRecordWav = readFileSync(join(__dirname, '../SFX/start_record.wav'))
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

    Playback.on('start_record', () => {
        speaker.write(StartRecordWav)
        console.log('start record')
    })

    Playback.on('end_record', () => {
        speaker.write(EndRecordWav)
        console.log('end record')
    })

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
                Playback.emit('start_record')
                Recipient = recip
                Recorder._stream.resume()
                // setTimeout(() => {
                //     Recipient = recip
                //     Recorder._stream.resume()
                // }, 250)
            }
        })

        Keyboard.addListener((event: IGlobalKeyEvent, isDown: IGlobalKeyDownMap) => {
            if (event.state == 'UP' && event.name == key && ReadyStart == ReadyStatus.No) {
                ReadyStart = ReadyStatus.Maybe
                
                Recorder._stream.pause()
                ReadyStart = ReadyStatus.Yes
                Playback.emit('end_record')
                // setTimeout(() => {
                //     ReadyStart = ReadyStatus.Yes
                //     Playback.emit('end_record')
                // }, 750)
            }
        })
    }

    for (let key in Shortcuts) {
        let location: string | string[] = Shortcuts[key]

        Shortcut(key, location)
    }

    Keyboard.run()
}