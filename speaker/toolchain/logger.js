const log4js = require('log4js')
const { logFile } = require('../config.json')

let logger = null

const getLogger = () => {
	if (logger) {
		return logger
	}
	else {
		log4js.configure({
			appenders: {
				everything: {
					type: 'dateFile',
					filename: logFile,
					pattern: 'yyyy-MM-dd'
				},
			},
			categories: {
				default: { appenders: ['everything'], level: 'debug' }
			}
		})

		logger = log4js.getLogger()
		return logger
	}
}

module.exports = {
	logger: getLogger()
}