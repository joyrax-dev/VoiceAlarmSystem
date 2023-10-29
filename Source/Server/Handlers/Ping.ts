import { IHandler } from "../../Shared/IHandler"
import { Socket } from 'socket.io'

export const Handler: IHandler<number, void> = {
    Handler: function(socket: Socket) {
        return function ping(start_time: number) {
			socket.emit('pong', start_time)
        }
    }
}