const { logger, store } = require('../../toolchain')

module.exports = (socket, namespace) => {
	return function deauth () { // clientInfo => { type, location }
		let client = store.get(socket.id)
		store.del(socket.id)
		logger.info(`Client has been removed from the system [id=${socket.id}] [type=${client.type}] [location=${client.location}]`)
	}
}