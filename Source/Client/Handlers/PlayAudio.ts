import { IHandler } from "../../Shared/IHandler"
import { Socket } from 'socket.io-client'
import { speaker as Speaker } from '../Speaker'

export const Handler: IHandler<any, void> = {
    Handler: function(socket: Socket) {
        return function play_audio(data: any) {
            Speaker.write(data)
        }
    }
}