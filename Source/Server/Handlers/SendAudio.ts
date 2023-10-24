import { IHandler } from "../../Shared/IHandler"
import { IAudioPackage } from "../../Shared/IAudioPackage"
import { IClientInfo } from "../../Shared/IClientInfo"
import { AuthorizedUsers } from "../Store"
import { Socket } from 'socket.io'

export const Handler: IHandler<IAudioPackage, void> = {
    Handler: function(socket: Socket) {
        return function send_audio(pack: IAudioPackage) {
            if (typeof pack.Locations === 'string' && pack.Locations == 'ALL') {
                let client: IClientInfo = AuthorizedUsers.get(socket.id)

                if (client.Type != 'OPERATOR') {
                    socket.emit('play_audio', pack.Audio)

                    console.log('transfer all')
                }
            }
            else if (Array.isArray(pack.Locations)) {
                for (let id in AuthorizedUsers.data) {
                    if (AuthorizedUsers.data.hasOwnProperty(id)) {
                        const authClient: IClientInfo = AuthorizedUsers.data[id] as IClientInfo
                        const senderClient: IClientInfo = AuthorizedUsers.get(socket.id)

                        if (pack.Locations.includes(authClient.Location) && authClient.Location != senderClient.Location && senderClient.Type == 'OPERATOR') {
                            socket.to(id).emit('play_audio', pack.Audio)

                            console.log('transfer to: ' + pack.Locations)
                        }
                    }
                }
            }
        }
    }
}