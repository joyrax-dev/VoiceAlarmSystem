import { IHandler } from "../../Shared/IHandler"
import { IAudioPackage } from "../../Shared/IAudioPackage"
import { IClientInfo } from "../../Shared/IClientInfo"
import { AuthorizedUsers } from "../Store"
import { Socket, Server } from 'socket.io'

export const Handler: IHandler<IAudioPackage, void> = {
    Handler: function(socket: Socket, server: Server) {
        return function send_audio(pack: IAudioPackage) {
            if (typeof pack.Locations === 'string' && pack.Locations == 'ALL') {
                // let client: IClientInfo = AuthorizedUsers.get(socket.id)

                socket.broadcast.emit('play_audio', pack.Audio)
                console.log('transfer all')
            }
            else if (Array.isArray(pack.Locations)) {
                for (let id in AuthorizedUsers.data) {
                    if (AuthorizedUsers.data.hasOwnProperty(id)) {
                        const authClient: IClientInfo = AuthorizedUsers.data[id] as IClientInfo
                        const senderClient: IClientInfo = AuthorizedUsers.get(socket.id)

                        if (pack.Locations.includes(authClient.Location) && authClient.Location != senderClient.Location && senderClient.Type == 'OPERATOR') {
                            server.to(id).emit('play_audio', pack.Audio)

                            console.log('transfer to: ' + pack.Locations)
                        }
                    }
                }
            }
        }
    }
}