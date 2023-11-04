import { IHandler } from "../../Shared/IHandler"
import { IClientInfo } from "../../Shared/IClientInfo"
import { AuthorizedUsers } from "../Store"
import { Socket, Server } from 'socket.io'
import { Logger } from "../../Shared/Logger"

export const Handler: IHandler<void, void> = {
    Handler: function(socket: Socket, server: Server) {
        return function deauth() {
            const client: IClientInfo = AuthorizedUsers.get(socket?.id)
            AuthorizedUsers.del(socket?.id)
            
            Logger.info(`Client has been removed from the system [id=${socket?.id}] [type=${client?.Type}] [location=${client?.Location}]`)
        }
    }
}