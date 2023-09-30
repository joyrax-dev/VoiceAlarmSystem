const { logger } = require('../services')

module.exports = (socket) => {
	return function connect_error () {
		logger.warn(`Reconnection attempt`)
	}
}