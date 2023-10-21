const { logger } = require('../../services/logger')
const { readdirSync } = require('fs')
const { join, extname } = require('path')

module.exports = (socket) => {
	return function request_log_sending_ready (response) {
		const dir = join(process.cwd(), 'logs')
		const files = readdirSync(dir).filter((file) => extname(file) !== '.log')

		if (files.length > 0) {
			response({
				status: 'READY'
			})
		}
		else if (files.length <= 0) {
			response({
				status: 'NOT_READY'
			})
		}
	}
}
