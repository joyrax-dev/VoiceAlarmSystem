// const { existsSync, readFileSync } = require('fs')
// const { logFile } = require('../config.json')
// const log4js = require('log4js')
// const moment = require('moment')

// class Logger {
// 	constructor() {
// 		let log4jsConfig = {
// 			appenders: {
// 				everything: {
// 					type: 'dateFile',
// 					filename: logFile,
// 					pattern: 'yyyy-MM-dd'
// 				},
// 				console: {
// 					type: 'console'
// 				}
// 			},
// 			categories: {
// 				default: { appenders: ['everything', 'console'], level: 'debug' }
// 			}
// 		}

// 		log4js.configure(log4jsConfig)
// 		this._logger = log4js.getLogger()
// 	}

// 	trace(msg) {
// 		this._logger.trace(msg)
// 	}

// 	debug(msg) {
// 		this._logger.debug(msg)
// 	}

// 	info(msg) {
// 		this._logger.info(msg)
// 	}

// 	warn(msg) {
// 		this._logger.warn(msg)
// 	}

// 	error(msg) {
// 		this._logger.error(msg)
// 	}

// 	fatal(msg) {
// 		this._logger.fatal(msg)
// 	}

// 	parseOneLog(log) {
// 		const regex = /\[(.*?)\] \[(.*?)\] (.*?) - (.*?) \[(.*)\]/
// 		const matches = log.match(regex)
// 		const logParsed = {}

// 		if (matches) {
// 			let dateTime = moment(matches[1]).format('YYYY-MM-DD HH:mm:ss').split(' ')

// 			logParsed.date = dateTime[0]
// 			logParsed.time = dateTime[1]
// 			logParsed.type = matches[2]
// 			logParsed.categories = matches[3]
// 			logParsed.message = matches[4]
// 			logParsed.data = matches[5].split('] [')
// 			logParsed.source = matches[0]
// 		}

// 		return logParsed
// 	}

// 	parselogFile(file) {
// 		if (!existsSync(file)) {
// 			this.error(`Log file does not exist [file=${file}]`)
// 			return
// 		}

// 		const lines = readFileSync(file, 'utf8').split(/\r?\n/);
// 		const logs = []
		
// 		for(const line of lines) {
// 			if (line.trim() === '') continue

// 			let log = this.parseOneLog(line)
// 			logs.push(log)
// 		}

// 		return logs
// 	}

// 	uploadLogs(logs, successCallback = () => {}) { // let arrlogs = logerr.parselogFile(join(process.cwd(), 'logs/vas-server.log'))
// 		const { Logs } = require('../database')
		
// 		logs.forEach(element => {
// 			Logs.create(element).then((newLog) => {
// 				this._logger.info(`Upload log [id=${newLog.id}]`)
// 			}).catch((error) => {
// 				this._logger.error(`Error upload log [error=${error}] [log=${element}]`)
// 			})
// 		})

// 		successCallback()
// 	}
// }


// const logger = new Logger()

// module.exports = {
// 	Logger,
// 	logger
// }

const log4js = require('log4js')
const { logFile } = require('../config.json')

log4js.configure({
	appenders: {
		everything: {
			type: 'dateFile',
			filename: logFile,
			pattern: 'yyyy-MM-dd'
		},
		console: {
			type: 'console'
		}
	},
	categories: {
		default: { appenders: ['everything', 'console'], level: 'debug' }
	}
})

const logger = log4js.getLogger()

module.exports = {
	logger
}