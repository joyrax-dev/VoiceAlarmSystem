import { IHandler } from "../../Shared/IHandler"
import { IAudioPackage } from "../../Shared/IAudioPackage"
import { IClientInfo } from "../../Shared/IClientInfo"
import { AuthorizedUsers } from "../Store"
import { Socket, Server } from 'socket.io'

export const Handler: IHandler<IAudioPackage, void> = {
    Handler: function(socket: Socket, server: Server) {
        return function send_audio(pack: IAudioPackage) {
            if (typeof pack.Locations === 'string' && pack.Locations == 'ALL') {
                socket.broadcast.emit('play_audio', pack.Audio)
                // console.log('Transfer to ALL')
            }
            else if (Array.isArray(pack.Locations)) {
                const sender: IClientInfo = AuthorizedUsers.get(socket.id)

                if (sender.Type != 'OPERATOR') return

                for (const client_id of Object.keys(AuthorizedUsers.data)) {
                    const client: IClientInfo = AuthorizedUsers.data[client_id] as IClientInfo

                    if (pack.Locations.includes(client.Location)) {
                        if (client.Location != sender.Location && client.Type != 'OPERATOR') {
                            server.to(client_id).emit('play_audio', pack.Audio)
                            // console.log(`Transfer to: ${pack.Locations}`)
                        }
                    }
                }
            }
        }
    }
}