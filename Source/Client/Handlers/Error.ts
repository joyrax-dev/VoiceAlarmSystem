import { IHandler } from "../../Shared/IHandler"
import { Socket } from 'socket.io-client'
import { Logger } from "../../Shared/Logger"

export const Handler: IHandler<string, void> = {
    Handler: function(socket: Socket) {
        return function error(err: string) {
            Logger.error(`Socket error [error=${err}]`)
        }
    }
}