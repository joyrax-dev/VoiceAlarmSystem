import { IHandler } from "../../Shared/IHandler"
import { Socket } from 'socket.io-client'

export const Handler: IHandler<string, void> = {
    Handler: function(socket: Socket) {
        return function error(err: string) {
            console.log(`Socket error [error=${err}]`)
        }
    }
}