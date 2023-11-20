import { createServer, Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
import { StartHandlers } from './Handlers'
import { Logger } from '../Shared/Logger'
import * as Config from '../server.json'

export default function Start() {
    console.log(`Startup server [host=${Config.Host}] [port=${Config.Port}]`)
    
    const Http: HttpServer = createServer()
    const SocketServer: Server = new Server(Http, {
        transports: ["websocket"]
    })

    SocketServer.on('connection', (socket: Socket) => {
        StartHandlers(socket, SocketServer)

        Logger.info(`Client connected [id=${socket.id}]`)
    })

    Http.listen(Config.Port, Config.Host, () => {
        Logger.info(`Server listening [on=http://${Config.Host}:${Config.Port}]`)
    })
}