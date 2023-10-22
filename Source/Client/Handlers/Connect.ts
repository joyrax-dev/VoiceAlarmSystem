import { IHandler } from "../../Shared/IHandler"
import { IClientInfo } from "../../Shared/IClientInfo"
import { Socket } from 'socket.io-client'
import { Client, Host, Port } from '../../client.json'

export const Handler: IHandler<void, void> = {
    Handler: function(socket: Socket) {
        return function connect() {
            console.log(`Connected [to=http://${Host}:${Port}]`)
            setTimeout(() => {
                socket.emit('auth', Client as IClientInfo)
            }, 500)
        }
    }
}