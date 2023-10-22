import { IHandler } from "../../Shared/IHandler"
import { Socket } from 'socket.io-client'

export const Handler: IHandler<Error, void> = {
    Handler: function(socket: Socket) {
        return function connect_error(err: Error) {
            console.log(`Reconnection attempt`)
        }
    }
}