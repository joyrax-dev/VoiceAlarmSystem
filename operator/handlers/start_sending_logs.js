const { logger } = require('../services')
const { readdirSync } = require('fs')
const { join, extname } = require('path')

module.exports = (socket) => {
	return function start_sending_logs (eventName) {
		const dir = join(process.cwd(), 'logs')
		const files = readdirSync(dir).filter((file) => extname(file) !== '.log')

		files.forEach(file => {
			if (!existsSync(file)) {
				logger.error(`Log file does not exist [file=${file}]`)
				return
			}

			const lines = readFileSync(file, 'utf8').split(/\r?\n/)

			for(const line of lines) {
				if (line.trim() === '') continue
	
				socket.emit(eventName, line)
			}
		})
	}
}
