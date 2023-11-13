import { IHandler } from "../../Shared/IHandler"
import { IClientInfo } from "../../Shared/IClientInfo"
import { AuthorizedUsers } from "../Store"
import { Socket, Server } from 'socket.io'

export const Handler: IHandler<any, void> = {
    Handler: function(socket: Socket, server: Server) {
        return function get_stats(callback: (data: any) => void) {
            const connections = AuthorizedUsers.data
			
			callback(connections)
        }
    }
}