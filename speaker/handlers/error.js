const { logger } = require('../services/logger')

module.exports = (socket) => {
	return function error (_error) {
		logger.error(`Socket error [error=${_error}]`)
	}
}