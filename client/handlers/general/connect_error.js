const { logger } = require('../../services/logger')

module.exports = (socket) => {
	return function connect_error () {
		logger.warn(`Reconnection attempt`)
	}
}