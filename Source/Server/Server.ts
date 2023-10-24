import { createServer, Server as HttpServer } from 'http'
import { Server, Socket } from 'socket.io'
import { StartHandlers } from './Handlers'
import * as Config from '../server.json'

export default function Start() {
    console.log(`Startup server [host=${Config.Host}] [port=${Config.Port}]`)
    
    const Http: HttpServer = createServer()
    const SocketServer: Server = new Server(Http)

    SocketServer.on('connection', (socket: Socket) => {
        StartHandlers(socket, SocketServer)
        
        console.log(`Client connected [id=${socket.id}]`)
    })

    Http.listen(Config.Port, Config.Host, () => {
        console.log('Server startup')
})
}