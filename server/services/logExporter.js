const { logUploadTime } = require('../config.json')
const { existsSync, readFileSync, readdirSync, unlink } = require('fs')
const { join, extname } = require('path')
const { store } = require('../services/store')
const { logger } = require('../services/logger')
const { Logs } = require('../database/models/Logs')
const moment = require('moment')

class LogExporter {
	constructor() {}

	start(namespaces, io) {
		this.ofSpeaker = namespaces.speakersNamespace
		this.ofOperator = namespaces.operatorsNamespace
		this.io = io
		this.createTimer()
	}

	timerTick() {
		this.serverlogsUpload()

		const clients = Object.entries(store.data)
		const readyClients = []

        clients.forEach(([id, obj]) => {
            const { type, location } = obj;
            const eventName = id + '__LOGS';

            if (type == 'speaker') {
                this.ofSpeaker.to(id).emit('request_log_sending_ready', (response) => {
                    if (response && response.status === 'READY') {
                        readyClients.push({ id, type, location });
                        this.ofSpeaker.on(eventName, (raw_log) => {
                            const log = this.logParse(raw_log);
                            this.logUpload(log, obj);
                        });
                    } else if (response && response.status === 'NOT_READY') {
                        // Handle NOT_READY status
                    }
                });
            } else if (type == 'operator') {
                this.ofOperator.to(id).emit('request_log_sending_ready', (response) => {
                    if (response && response.status === 'READY') {
                        readyClients.push({ id, type, location });
                        this.ofOperator.on(eventName, (raw_log) => {
                            const log = this.logParse(raw_log);
                            this.logUpload(log, obj);
                        });
                    } else if (response && response.status === 'NOT_READY') {
                        // Handle NOT_READY status
                    }
                });
            }
        })

		let delay = 10 // в минутах
		readyClients.forEach(rdClient => {
			const { id, type } = rdClient
			const eventName = id + '__LOGS'

			// тут говорим клиентам что можно начинать выгрузку логов
			setInterval(() => {
				if (type == 'speaker') {
					this.ofSpeaker.to(id).emit('start_sending_logs', eventName)
				}
				else if (type == 'operator') {
					this.ofOperator.to(id).emit('start_sending_logs', eventName)
				}
			}, delay * 60 * 1000)

			delay += 10
		})
		
	}

	createTimer() {
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

			this.timerTick()
			setInterval(this.timerTick, 24 * 60 * 60 * 1000)
		}, timeDifference)
	}

	serverlogsUpload() {
		logger.info(`Starting upload logs [date=${new Date()}]`)
		const dir = join(process.cwd(), 'logs')
		const files = readdirSync(dir).filter((file) => extname(file) !== '.log')

		files.forEach((file) => {
			const filePath = join(dir, file)
			const logs = this.logFileLoad(filePath)

			logs.forEach(log => {
				this.logUpload(log, { type: 'SERVER', location: 'SERVER' })
			})

			// logger.info(`Uploaded log file [file=${file}] [endOperation=${new Date()}]`)
			unlink(filePath, (err) => {
				if (err) {
					logger.error(`Error while deleting the file [error=${err}] [file=${file}]`)
				}
			})
		})
	}

	logUpload(log, client) {
		const newLog = {...log, ...client}

		Logs.create(newLog).then((_log) => {
			logger.info(`Upload log [id=${_log.id}]`)
		}).catch((err) => {
			logger.error(`Error upload log [error=${err}] [log=${newLog}]`)
		})
	}

	logParse(log) {
		const regex = /\[(.*?)\] \[(.*?)\] (.*?) - (.*?) \[(.*)\]/
		const matches = log.match(regex)
		const logParsed = {}

		if (matches) {
			let dateTime = moment(matches[1]).format('YYYY-MM-DD HH:mm:ss').split(' ')

			logParsed.date = dateTime[0]
			logParsed.time = dateTime[1]
			logParsed.type = matches[2]
			logParsed.categories = matches[3]
			logParsed.message = matches[4]
			logParsed.data = matches[5].split('] [')
			logParsed.source = matches[0]
		}

		return logParsed
	}

	logFileLoad(file) {
		if (!existsSync(file)) {
			this.error(`Log file does not exist [file=${file}]`)
			return
		}

		const lines = readFileSync(file, 'utf8').split(/\r?\n/);
		const logs = []
		
		for(const line of lines) {
			if (line.trim() === '') continue

			let log = this.logParse(line)
			logs.push(log)
		}

		return logs
	}
}

const logExporter = new LogExporter()

module.exports = {
	LogExporter,
	logExporter
}


/**
 * Сервер будет опрашивать клиентов по очереди готовы ли они отправлять логи,
 * а клиенты в свою очередь будут проверять есть ли файлы логов которые можно загрузить,
 * тоесть файлы логов за прошлые дни. И клиенты ответят серверу типо можем.
 * В итоге сервер начет запрашивать эти логи у клиентов которые сказали мы готовы
 * 
 * вопрос сейчас стоит в том как клиенты будут отправлять серверу логи
 * Варианты:
 *   1. Отправлять целым файлом, но не понятно как поведут себя сокеты если файл будет большой
 *   2. Отправлять файл по строкам, но тут тоже не понятно на сколько будет сильная нагрузка на сокеты если логов будет много
 *   3. Мы также можем парсить логи на самих клиентах и отправлять их самим объектов js на сервер, а точнее масивом, так сказать на пролом
 */


/**
 * такс кароче, обьясняю ибо сам забуду что за дичь здест происходит
 * 
 * Класс LogExporter делает вот что
 *   он может парсить логи,
 *   загружать с файла логи,
 *   загружать бд логи,
 *   А так же он создает систему для выгрузки логов с клиентов
 *   ну и так же таймер по которому эти логи будут выгружатся в бд
 * 
 * разберем как происходит выгрузка логов с клиентов
 *   по тику таймера(timerTick()) проходит по всем подключеным клиентам (в store хранятся только подключеные клиенты)
 *   и собирает с них инфу готовы ли они выгружать данные, под готовностью имеется в виду то
 *   что есть ли файлы прошлых дат, (типо не сегоднишние, а на пример вчерашние или позавчерашние)
 *   а так же тут инициализирует евенты в сокетах для парсинга и сразу же загрузки в бд(тоесть клиента отправляет чистый лог, а сервак уже парсит и выгружает в бд)
 *   дальше проходиться масивв с подключеными и ГОТОВЫМИ клиентами, в каждой его итерации сервер говорит каждому клиенту типо ВЫГРУЖАЙ СУКА
 *   если посмотреть на код повнимательнее то можно увидеть переменую delay, так вот она отвечает за задержку и определяетсяв минутах
 *   так и получается что задержка между выгрузками между каждым клиентом состовляет 10 минут
 *   а да start_sending_logs то что на клиенте выполняется
 *     проходит по всем файла которые нужно выгрузить, разбивает их на строки(тоесть один лог = одна строка) и отправляет серверу (logUpload)
 */