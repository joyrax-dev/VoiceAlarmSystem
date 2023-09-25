const { logger } = require('../../toolchain')
const deauth = require('./deauth')

module.exports = (socket, namespace) => {
	return function disconnect (reason) {
		logger.info(`Speaker disconnected [id=${socket.id}]`)
		deauth(socket, namespace)()
	}
}

