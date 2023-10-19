const { hostname, port, client } = require('../config.json')
const { logger } = require('../services/logger')

module.exports = (socket) => {
	return function connect () {
		logger.info(`Connected [to=http://${hostname}:${port}/${client.type}]`)
		socket.emit('auth', client)
	}
}