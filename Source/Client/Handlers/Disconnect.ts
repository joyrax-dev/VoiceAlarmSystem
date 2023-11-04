import { IHandler } from "../../Shared/IHandler"
import { Socket } from 'socket.io-client'
import { Logger } from "../../Shared/Logger"

export const Handler: IHandler<string, null> = {
    Handler: function(socket: Socket) {
        return function disconnect(reason: string) {
            Logger.warn(`Disconnected`)

            if (reason === 'io server disconnect') {
                Logger.info(`Reconnection attempt`)
                socket.connect()
            }
        }
    }
}