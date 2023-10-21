const { GlobalKeyboardListener } = require("@futpib/node-global-key-listener")
const { logger } = require('../services/logger')

const keyboard = new GlobalKeyboardListener({
	windows: {
		onError: (errorCode) => {
			logger.error(`Error keyboard [error=${errorCode}]`)
		}
	}
})

module.exports = {
	keyboard
}