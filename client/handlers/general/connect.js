const { hostname, port, location } = require('../../config.json')
const { logger } = require('../../services/logger')
const { type } = process.env

module.exports = (socket) => {
	return function connect () {
		logger.info(`Connected [to=http://${hostname}:${port}/${type}]`)
		socket.emit('auth', {type, location})
	}
}