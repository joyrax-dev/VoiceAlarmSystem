import { Log4js, configure, getLogger } from "log4js"

function createlogger() {
	configure({
		appenders: {
			everything: {
				type: 'dateFile',
				filename: 'Logs/vas.log',
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

	return getLogger()
}

export const Logger = createlogger()
