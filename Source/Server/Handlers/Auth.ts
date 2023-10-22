import { IHandler } from "../../Shared/IHandler"
import { IClientInfo } from "../../Shared/IClientInfo"
import { AuthorizedUsers } from "../Store"
import { Socket } from 'socket.io'

export const Handler: IHandler<IClientInfo, void> = {
    Handler: function(socket: Socket) {
        return function auth(Info: IClientInfo) {
            AuthorizedUsers.set(socket.id, Info)
            console.log(`Client accounted [id=${socket.id}] [location=${Info.Location}] [type=${Info.Type}]`)
        }
    }
}