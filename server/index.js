const { createServer } = require('http')
const { Server } = require('socket.io')
const { readdirSync, statSync, unlink } = require('fs')
const { join, extname } = require('path')
const { database, Logs } = require('./database')
const { handlersOperators, handlersSpeakers, handlersGeneral } = require('./handlers')
const { hostname, port, logUploadTime } = require('./config.json')
const { logger, toolchain } = require('./services')

try {
	await Logs.sync({force: false})

	logger.info(`Table exist [table=${Logs.modelName}]`)
}
catch (err) {
	logger.error(`Error while checking table [table=Logs] [error=${error}]`)
	logger.warn(`I'm trying to recreate the table [table=${Logs.modelName}]`)

	try {
		Logs.sync({force: true})

		logger.info(`Table recreated [table=${Logs.modelName}]`)
	} 
	catch (err) {
		logger.error(`Error in table re-creation [table=Logs] [error=${error}]`)
	}
}

const httpServer = createServer()
const io = new Server(httpServer)

const operatorsNamespace = io.of('/operators')
const speakersNamespace = io.of('/speakers')

const operatorsHandlers = handlersOperators()
const speakerHandlers = handlersSpeakers()
const generalHandlers = handlersGeneral()

function attachHandlers(socket, namespace, handlers) {
	handlers.forEach(handler => {
		let callback = handler(socket, namespace)
		let callbackName = toolchain.extractFunctionName(callback)
		socket.on(callbackName, callback)
	})
}

operatorsNamespace.on('connection', (socket) => {
	logger.info(`Operator connected [id=${socket.id}]`)

	attachHandlers(socket, operatorsNamespace, generalHandlers)
	attachHandlers(socket, operatorsNamespace, operatorsHandlers)
})

speakersNamespace.on('connection', (socket) => {
	logger.info(`Speaker connected [id=${socket.id}]`)

	attachHandlers(socket, operatorsNamespace, generalHandlers)
	attachHandlers(socket, operatorsNamespace, speakersNamespace)
})

const startTimer = (callback) => {
	const today = new Date()
	const targetTime = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
		logUploadTime.hours,
		logUploadTime.minutes,
		logUploadTime.seconds
	)

	if (today > targetTime) {
		targetTime.setDate(today.getDate() + 1)
	}

	const timeDifference = targetTime - today

	setTimeout(() => {
		const currentDateTime = new Date()
		logger.info(`Starting timer [datetime=${currentDateTime}]`)

		callback()
		setInterval(callback, 24 * 60 * 60 * 1000)
	}, timeDifference)
}

startTimer(() => {
	logger.info(`Starting upload logs [date=${new Date()}]`)
	let dir = join(process.cwd(), 'logs')
	const files = readdirSync(dir).filter((file) => extname(file) !== '.log')

	files.forEach((file) => {
		const filePath = join(dir, file)
		const logs = logger.parselogFile(filePath)
		logger.uploadLogs(logs)
		logger.info(`Uploaded log file [file=${file}] [endOperation=${new Date()}]`)
	
		unlink(filePath, (err) => {
			if (err) {
				logger.error(`Error while deleting the file [file=${file}]`)
			}
		})
	})
})

httpServer.listen(port, hostname, () => {
	logger.info(`Server started [hostname=${hostname}] [port=${port}]`)
})
