import { Socket } from 'socket.io-client'
import { readdirSync, statSync, Stats } from 'fs'
import { ExtractFunctionName } from '../../Shared/ExtractFunctionName'
import { join } from 'path'


export function StartHandlers(socket: Socket) {
    ImportHandlers(__dirname, socket)
}

function ImportHandlers(folderPath: string, socket: Socket) {
    const files: string[] = readdirSync(folderPath)

    files.forEach((file: string) => {
        const filePath: string = join(folderPath, file)
        const stats: Stats = statSync(filePath)

        if (stats.isFile()) {
            if (file.endsWith('.ts') || file.endsWith('.js')) {
                if (ifmatches(file, ['index.ts', 'index.js'])) {
                    return
                }

                const module = require(filePath)
            
                const callback = module.Handler.Handler(socket)
                const callback_name = ExtractFunctionName(callback)

                socket.on(callback_name, callback)
            }
        } else if (stats.isDirectory()) {
            ImportHandlers(filePath, socket)
        }
    })
}

function ifmatches(file: string, skip: string[] = []): boolean {
	for (const skipFile of skip) {
		if (file.endsWith(skipFile)) {
			return true
		}
	}

	return false
}