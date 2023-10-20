const { createServer } = require('http')
const { Server } = require('socket.io')
const { readdirSync, statSync, unlink, access, constants } = require('fs')
const { join, extname } = require('path')
const { Logs } = require('./database/models/Logs')
// const { database } = require('./database/connection')
const { handlersOperators, handlersSpeakers, handlersGeneral } = require('./handlers')
const { hostname, port, logUploadTime, storeFile } = require('./config.json')
const { toolchain, logExporter } = require('./services')
const { logger } = require('./services/logger')

/*
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
*/

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

// logExporter.start({ operatorsNamespace, speakersNamespace }, io)

// Здесь можно на пример пробовать запустить батник для рестарта сервера или что-то подобного
process.on('exit', (code) => {
    logger.warn(`The server has completed its work [code=${code}]`)
})

// Стартуем
httpServer.listen(port, hostname, () => {
	logger.info(`Server started [hostname=${hostname}] [port=${port}]`)
})
