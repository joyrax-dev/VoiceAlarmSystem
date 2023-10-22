import { IHandler } from "../../Shared/IHandler"
import { Socket } from 'socket.io-client'

export const Handler: IHandler<string, null> = {
    Handler: function(socket: Socket) {
        return function disconnect(reason: string) {
            console.log(`Disconnected`)

            if (reason === 'io server disconnect') {
                console.log(`Reconnection attempt`)
                socket.connect()
            }
        }
    }
}