const { createServer } = require('http')
const { Server } = require('socket.io')
const { readdirSync, statSync, unlink, access, constants } = require('fs')
const { join, extname } = require('path')
const { database, Logs } = require('./database')
const { handlersOperators, handlersSpeakers, handlersGeneral } = require('./handlers')
const { hostname, port, logUploadTime, storeFile } = require('./config.json')
const { logger, toolchain } = require('./services')

// Проверка таблицы в базе данных
Logs.sync({force: false}).then(() => {
	logger.info(`Table exist [table=${Logs.tableName}]`)
}).catch(err => {
	logger.error(`Error while checking table [table=${Logs.tableName}] [error=${err}]`)
	logger.warn(`I'm trying to recreate the table [table=${Logs.tableName}]`)

	Logs.sync({force: true}).then(() => {
		logger.info(`Table recreated [table=${Logs.tableName}]`)
	}).catch(err => {
		logger.error(`Error in table re-creation [table=${Logs.tableName}] [error=${err}]`)
	})
})

// Удаление файла store.json на запуске сервера
const storePath = join(process.cwd(), storeFile)
access(storePath, constants.F_OK, err => {
	if (!err) {
		unlink(storePath, () => {
			logger.error(`Error while deleting the file [file=${storePath}]`)
		})
	}
})

// Созданмие сервера
const httpServer = createServer()
const io = new Server(httpServer)

const operatorsNamespace = io.of('/operator')
const speakersNamespace = io.of('/speaker')

const operatorsHandlers = handlersOperators()
const speakerHandlers = handlersSpeakers()
const generalHandlers = handlersGeneral()

// Добавление обработчиков на сокеты
function attachHandlers(socket, namespaces, handlers) {
	handlers.forEach(handler => {
		let callback = handler(socket, namespaces)
		let callbackName = toolchain.extractFunctionName(callback)
		socket.on(callbackName, callback)
	})
}

operatorsNamespace.on('connection', (socket) => {
	logger.info(`Client connected [id=${socket.id}]`)

	attachHandlers(socket, { operatorsNamespace, speakersNamespace }, generalHandlers)
	attachHandlers(socket, { operatorsNamespace, speakersNamespace }, operatorsHandlers)
})

speakersNamespace.on('connection', (socket) => {
	logger.info(`Client connected [id=${socket.id}]`)

	attachHandlers(socket, { operatorsNamespace, speakersNamespace }, generalHandlers)
	attachHandlers(socket, { operatorsNamespace, speakersNamespace }, speakerHandlers)
})

// Автоматическая выгрузка логов в базу данных и последуещее их удаление с утсройства
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

// Стартуем
httpServer.listen(port, hostname, () => {
	logger.info(`Server started [hostname=${hostname}] [port=${port}]`)
})
