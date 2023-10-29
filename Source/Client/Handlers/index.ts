import { Socket } from 'socket.io-client'
import { Handler as Disconnect } from './Disconnect'
import { Handler as Connect } from './Connect'
import { Handler as ConnectError } from './ConnectError'
import { Handler as Error } from './Error'
import { Handler as PlayAudio } from './PlayAudio'
import { Handler as Pong } from './Pong'
import { Handler as GetLatency } from './GetLatency'

export function StartHandlers(socket: Socket) {
    socket.on('disconnect', Disconnect.Handler(socket))
    socket.on('connect', Connect.Handler(socket))
    socket.on('connect_error', ConnectError.Handler(socket))
    socket.on('error', Error.Handler(socket))
    socket.on('play_audio', PlayAudio.Handler(socket))
    socket.on('pong', Pong.Handler(socket))
    socket.on('get_latency', GetLatency.Handler(socket))
}