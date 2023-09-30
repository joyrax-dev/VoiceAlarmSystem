const { logger, store } = require('../services')

module.exports = (socket, namespaces) => {
	return function deauth () { // clientInfo => { type, location }
		let client = store.get(socket.id)
		store.del(socket.id)
		logger.info(`Client has been removed from the system [id=${socket.id}] [type=${client.type}] [location=${client.location}]`)
		// TODO: проверка на то что есть ли пользователь в сторе
	}
}