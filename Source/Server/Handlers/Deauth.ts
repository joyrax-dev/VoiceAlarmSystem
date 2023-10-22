import { IHandler } from "../../Shared/IHandler"
import { IClientInfo } from "../../Shared/IClientInfo"
import { AuthorizedUsers } from "../Store"
import { Socket } from 'socket.io'

export const Handler: IHandler<void, void> = {
    Handler: function(socket: Socket) {
        return function deauth() {
            const client: IClientInfo = AuthorizedUsers.get(socket.id)
            AuthorizedUsers.del(socket.id)
            console.log(`Client has been removed from the system [id=${socket.id}] [type=${client.Type}] [location=${client.Location}]`)
        }
    }
}