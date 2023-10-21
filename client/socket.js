const { operatorHandlers, speakerHandlers, generalHandlers } = require('./handlers')
const { hostname, port, location } = require('./config.json')
const { toolchain } = require('./services/toolchain')
const { logger } = require('./services/logger')
const io = require('socket.io-client')

const handlers = []

handlers['operator'] = operatorHandlers()
handlers['speaker'] = speakerHandlers()
handlers['general'] = generalHandlers()

function socketStart() {
	const { type } = process.env

	const socket = io(`http://${hostname}:${port}/${type}`, {
		autoConnect: false,
		reconnection: true,
		reconnectionAttempts: Infinity,
		reconnectionDelay: 5000
	})

	attachHandlers(socket, handlers['general'])
	attachHandlers(socket, handlers[type])

	socket.connect()

	process.on('exit', (code) => {
		logger.error(`Disconnect from the server and terminate the process [code=${code}] [type=${type}] [location=${location}]`)
		socket.disconnect()
	})

	return socket
}

function attachHandlers(socket, handlers) {
	handlers.forEach(handler => {
		let callback = handler(socket)
		let callbackName = toolchain.extractFunctionName(callback)

		socket.on(callbackName, callback)
	})
}

module.exports = socketStart