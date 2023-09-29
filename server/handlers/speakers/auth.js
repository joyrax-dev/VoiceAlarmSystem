const { logger, store } = require('../../services')

module.exports = (socket, namespace) => {
	return function auth (clientInfo) { // clientInfo => { type, location }
		store.set(socket.id, clientInfo)
		logger.info(`Client added to the system [id=${socket.id}] [type=${clientInfo.type}] [location=${clientInfo.location}]`)
	}
}