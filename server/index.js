const { createServer } = require("http")
const { Server } = require("socket.io")
const { database, Logs } = require('./database')
const { handlersOperators, handlersSpeakers } = require('./handlers')
const { getFunctionName } = require('./toolchain')
const { hostname, port } = require('./config.json')
const { readdirSync, statSync } = require('fs')
const { logger } = require('./services')
const { join } = require("path")

Logs.sync({force: false}).then(() => {
	logger.info(`Table exist [table=${Logs.modelName}]`)
}).catch((error) => {
	logger.error(`Error while checking table [table=Logs] [error=${error}]`)
})

const httpServer = createServer()
const io = new Server(httpServer)

const operatorsNamespace = io.of('/operators')
const speakersNamespace = io.of('/speakers')

const operatorsHandlers = handlersOperators()
const speakerHandlers = handlersSpeakers()

operatorsNamespace.on("connection", (socket) => {
	logger.info(`Operator connected [id=${socket.id}]`)

	operatorsHandlers.forEach(handler => {
		let callback = handler(socket, operatorsNamespace)
		let callbackName = getFunctionName(callback)

		socket.on(callbackName, callback)
	});
})

speakersNamespace.on("connection", (socket) => {
	logger.info(`Speaker connected [id=${socket.id}]`)

	speakerHandlers.forEach(handler => {
		let callback = handler(socket, speakersNamespace)
		let callbackName = getFunctionName(callback)
		
		socket.on(callbackName, callback)
	});
})

const startTimer = (callback) => {
	const today = new Date()
	const targetTime = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 2, 0, 0)

	const timeDifference = targetTime - today

	setTimeout(() => {
		logger.info(`Starting timer [datetime=${new Date()}]`)

		callback()

		setInterval(callback, 24 * 60 * 60 * 1000)
	}, timeDifference)
}

startTimer(() => {
	logger.info(`Starting upload logs [date=${new Date()}]`)
	let dir = join(process.cwd(), 'logs')
	let files = []

	let fileList = readdirSync(dir)

	for (const file of fileList) {
		let name = join(dir, file)

		if (statSync(name).isFile()) {
			if (extname(name) == '.log') {
				continue
			}
			else {
				files.push(name)
			}
		}
	}

	for (const file of files) {
		let logs = logger.parselogFile(file)

		logger.uploadLogs(logs)
		logger.info(`Uploaded log file [file=${file}] [endOperation=${new Date()}]`)
	}
})

httpServer.listen(port, hostname, () => {
	logger.info(`Server started [hostname=${hostname}] [port=${port}]`)
})
