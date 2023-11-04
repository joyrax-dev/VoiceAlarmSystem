import { IHandler } from "../../Shared/IHandler"
import { Socket } from 'socket.io-client'
import { Logger } from "../../Shared/Logger"

export const Handler: IHandler<Error, void> = {
    Handler: function(socket: Socket) {
        return function connect_error(err: Error) {
            Logger.error(`Connect error [error=${err}]`)
        }
    }
}