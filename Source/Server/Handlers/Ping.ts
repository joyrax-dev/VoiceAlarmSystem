import { IHandler } from "../../Shared/IHandler"
import { Socket, Server } from 'socket.io'

export const Handler: IHandler<number, void> = {
    Handler: function(socket: Socket, server: Server) {
        return function ping(start_time: number) {
			socket.emit('pong', start_time)
        }
    }
}