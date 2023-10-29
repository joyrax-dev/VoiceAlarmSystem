import { Socket, Server } from 'socket.io'
import { Handler as Disconnect } from './Disconnect'
import { Handler as Auth } from './Auth'
import { Handler as Deauth } from './Deauth'
import { Handler as SendAudio } from './SendAudio'
import { Handler as Ping } from './Ping'
import { Handler as AnswerLatency } from './AnswerLatency'

export function StartHandlers(socket: Socket, server: Server) {
    socket.on('disconnect', Disconnect.Handler(socket))
    socket.on('auth', Auth.Handler(socket))
    socket.on('deauth', Deauth.Handler(socket))
    socket.on('send_audio', SendAudio.Handler(socket, server))
    socket.on('ping', Ping.Handler(socket, server))
    socket.on('answer_latency', AnswerLatency.Handler(socket, server))
}