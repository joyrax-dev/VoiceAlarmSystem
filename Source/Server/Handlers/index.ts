import { Socket } from 'socket.io'
import { Handler as Disconnect } from './Disconnect'
import { Handler as Auth } from './Auth'
import { Handler as Deauth } from './Deauth'
import { Handler as SendAudio } from './SendAudio'

export function StartHandlers(socket: Socket) {
    socket.on('disconnect', Disconnect.Handler(socket))
    socket.on('auth', Auth.Handler(socket))
    socket.on('deauth', Deauth.Handler(socket))
    socket.on('send_audio', SendAudio.Handler(socket))
}