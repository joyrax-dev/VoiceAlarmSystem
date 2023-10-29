import { IHandler } from "../../Shared/IHandler"
import { Socket } from 'socket.io-client'

export const Handler: IHandler<number, void> = {
    Handler: function(socket: Socket) {
        return function pong(start_time: number) {
            const latency = Date.now() - start_time
            socket.emit('answer_latency', latency)
        }
    }
}