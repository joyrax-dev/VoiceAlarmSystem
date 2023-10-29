import { IHandler } from "../../Shared/IHandler"
import { Socket } from 'socket.io-client'

export const Handler: IHandler<void, void> = {
    Handler: function(socket: Socket) {
        return function get_latency() {
			socket.emit('ping', Date.now())
        }
    }
}