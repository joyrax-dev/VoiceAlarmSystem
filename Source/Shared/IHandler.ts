import { Socket as SocketServer, Server } from 'socket.io'
import { Socket as SocketClient } from 'socket.io-client'

export interface IHandler<T1, T2> {
    Handler(socket: SocketServer | SocketClient, server: Server | void): (value1: T1, value2: T2) => void
}