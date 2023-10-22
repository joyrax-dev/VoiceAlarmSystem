import { IHandler } from "../../Shared/IHandler"
import { Handler as Deauth } from "./Deauth"
import { Socket } from 'socket.io'

export const Handler: IHandler<string, void> = {
    Handler: function(socket: Socket) {
        return function disconnect(reason: string) {
            console.log(`Disconnected [reason=${reason}]`)
            Deauth.Handler(socket)()
        }
    }
}