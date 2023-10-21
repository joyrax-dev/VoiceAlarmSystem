const { logger } = require('../../services/logger')

module.exports = (socket) => {
	return function error (err) {
		logger.error(`Socket error [error=${err}]`)
	}
}