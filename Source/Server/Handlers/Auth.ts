import { IHandler } from "../../Shared/IHandler"
import { IClientInfo } from "../../Shared/IClientInfo"
import { AuthorizedUsers } from "../Store"
import { Socket, Server } from 'socket.io'
import { Logger } from "../../Shared/Logger"

export const Handler: IHandler<IClientInfo, void> = {
    Handler: function(socket: Socket, server: Server) {
        return function auth(Info: IClientInfo) {
            AuthorizedUsers.set(socket?.id, Info)

            Logger.info(`Client accounted [id=${socket?.id}] [location=${Info?.Location}] [type=${Info?.Type}]`)
        }
    }
}