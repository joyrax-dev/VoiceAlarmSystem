import { IHandler } from "../../Shared/IHandler"
import { Socket, Server } from 'socket.io'
import { AuthorizedUsers } from "../Store"
import { IClientInfo } from "../../Shared/IClientInfo"

export const Handler: IHandler<number, void> = {
    Handler: function(socket: Socket, server: Server) {
        return function answer_latency(latency: number) {
            const client: IClientInfo = AuthorizedUsers.get(socket?.id)
			console.log(`latency from ${client?.Location}: ${latency} ms`)
        }
    }
}