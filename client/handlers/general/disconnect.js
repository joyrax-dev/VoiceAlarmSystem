const { logger } = require('../../services/logger')

module.exports = (socket) => {
	return function disconnect (reason) {
		logger.warn(`Disconnected`)

		if (reason === 'io server disconnect') {
			logger.warn(`Reconnection attempt`)
			socket.connect()
		}
		// else the socket will automatically try to reconnect
	}
}