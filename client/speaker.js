const { logger } = require('./services/logger')

module.exports = function(socket) {
	logger.info(`Start client [type=${process.env.type}]`)
}