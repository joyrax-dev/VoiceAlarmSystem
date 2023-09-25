const { logger, store } = require('../../toolchain')
const deauth = require('./deauth')

module.exports = (socket, namespace) => {
	return function disconnect (reason) {
		logger.info(`Operator disconnected [id=${socket.id}]`)
		deauth(socket, namespace)()
	}
}