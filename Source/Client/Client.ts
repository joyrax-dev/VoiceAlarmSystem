import player from 'node-wav-player'
import { Socket, connect as SocketConnect } from 'socket.io-client'
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
        reconnectionDelay: 5000,
        transports: ["websocket"]
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

        // recordBuffer += audio
    })

    if (Client.Type == 'OPERATOR') {
        InitializationKeyboard(socket)
    }
}

// let intervalRecord = null
// let recordBuffer = ''

// function startRecord(socket) {
//     // Очищаем буфер и запускаем стрим
//     recordBuffer = ''
//     Recorder._stream.resume()

//     // интервал каждые 300 милисекунд
//     intervalRecord = setInterval(() => {
//         if (recordBuffer.length > 0) {
//             // Тоесть каждые 300 милисекунд мы отправляем буфер и чистим его
//             socket.emit('send_audio', {
//                 Audio: recordBuffer,
//                 Locations: Recipient
//             })
//             recordBuffer = ''
//         }
//     }, 300)
// }

// function stopRecord() {
//     setTimeout(() => {
//         if (intervalRecord != null) {
//             // Удаляем интервал что бы он не выполнялся больше и останавливаем стрим
//             clearInterval(intervalRecord)
//             Recorder._stream.pause()

//             // Подчистим память
//             intervalRecord = null
//             recordBuffer = ''
//         }
//     }, 300) // 300 милисекунд нужны при остановке для того что бы не пропдали последние слова
// }

function InitializationKeyboard(socket): void {
    function Shortcut(key: string, recip: string | string[]) {
        Keyboard.addListener((event: IGlobalKeyEvent, isDown: IGlobalKeyDownMap) => {
            if (event.state == 'DOWN' && event.name == key && ReadyStart == ReadyStatus.Yes) {
                ReadyStart = ReadyStatus.No

                setTimeout(() => {
                    Recipient = recip
                    // startRecord(socket)
                    Recorder._stream.resume()
                }, 100)
            }
        })

        Keyboard.addListener((event: IGlobalKeyEvent, isDown: IGlobalKeyDownMap) => {
            if (event.state == 'UP' && event.name == key && ReadyStart == ReadyStatus.No) {
                ReadyStart = ReadyStatus.Maybe
                
                setTimeout(() => {
                    Recorder._stream.pause()
                    // stopRecord()
                }, 200)
                
                
                setTimeout(() => {
                    ReadyStart = ReadyStatus.Yes
                }, 700)
            }
        })
    }

    for (let key in Shortcuts) {
        let location: string | string[] = Shortcuts[key]

        Shortcut(key, location)
    }

    Keyboard.run()
}