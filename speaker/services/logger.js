const log4js = require('log4js')
const { logFile } = require('../config.json')

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

const logger = log4js.getLogger()

module.exports = {
	logger
}