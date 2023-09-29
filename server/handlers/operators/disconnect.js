const { logger } = require('../../services')
const deauth = require('./deauth')

module.exports = (socket, namespace) => {
	return function disconnect (reason) {
		logger.info(`Operator disconnected [id=${socket.id}] [reason=${reason}]`)
		deauth(socket, namespace)()
	}
}