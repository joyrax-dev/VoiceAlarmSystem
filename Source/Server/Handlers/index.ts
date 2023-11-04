import { Socket, Server } from 'socket.io'
import { readdirSync, statSync, Stats } from 'fs'
import { ExtractFunctionName } from '../../Shared/ExtractFunctionName'
import { join } from 'path'

export function StartHandlers(socket: Socket, server: Server) {
    ImportHandlers(__dirname, socket, server)
}

function ImportHandlers(folderPath: string, socket: Socket, server: Server) {
    const files: string[] = readdirSync(folderPath)

    files.forEach((file: string) => {
        const filePath: string = join(folderPath, file)
        const stats: Stats = statSync(filePath)

        if (stats.isFile() && file.endsWith('.ts')) {
            const module = require(filePath)
            
            const callback = module.Handler.Handler(socket, server)
            const callback_name = ExtractFunctionName(callback)

            socket.on(callback_name, callback)
        } else if (stats.isDirectory()) {
            ImportHandlers(filePath, socket, server)
        }
    })
}
