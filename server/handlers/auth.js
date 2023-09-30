const { logger, store } = require('../services')

module.exports = (socket, namespaces) => {
	return function auth (clientInfo) { // clientInfo => { type, location }
		store.set(socket.id, clientInfo)
		logger.info(`Client accounted [id=${socket.id}] [type=${clientInfo.type}] [location=${clientInfo.location}]`)
	}
}