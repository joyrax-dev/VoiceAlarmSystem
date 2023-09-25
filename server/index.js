const { createServer } = require("http")
const { Server } = require("socket.io")
const { handlersOperators, handlersSpeakers } = require('./handlers')
const { getFunctionName } = require('./toolchain')
const { hostname, port } = require('./config.json')

const httpServer = createServer()
const io = new Server(httpServer)

const operatorsNamespace = io.of('/operators')
const speakersNamespace = io.of('/speakers')

const operatorsHandlers = handlersOperators()
const speakerHandlers = handlersSpeakers()

operatorsNamespace.on("connection", (socket) => {
	console.log(`Operator connected: ${socket.id}`)

	operatorsHandlers.forEach(handler => {
		let callback = handler(socket, operatorsNamespace)
		let callbackName = getFunctionName(callback)

		socket.on(callbackName, callback)
	});
})

speakersNamespace.on("connection", (socket) => {
	console.log(`Speaker connected: ${socket.id}`)

	speakerHandlers.forEach(handler => {
		let callback = handler(socket, speakersNamespace)
		let callbackName = getFunctionName(callback)
		
		socket.on(callbackName, callback)
	});
})

httpServer.listen(port, hostname, () => {
	console.info(`Server is running\nServer hostname: ${hostname}\nServer port: ${port}`)
})