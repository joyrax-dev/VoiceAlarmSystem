const io = require('socket.io-client')
const { getSpeaker } = require('./speaker')
const { performance } = require('perf_hooks')
const { hostname, port, clientType, clientLocation } = require('./config.json')


const speaker = getSpeaker()
const socket = io.connect(`http://${hostname}`, {
    port: port,
    reconnect: true
})
const entryTimePlayAudio = 5000 // Время в мс, с последнего получения чанка с микрофона, после которого начинается записаватся новая запись
const lastPlayAudioTime = 0
const recordingAudio = [] // TODO: переделать в writeble стрим, в теории с ним легче и лучше работать, но я не сильно с ним знаком

socket.on('connect', () => {
	console.log(`Connected to: http://${hostname}:${port}`)

	socket.emit('registration', {
		clientType,
		clientLocation
	})
})

socket.on('disconnect', (reason) => {
	console.info("Client disconnected")

	if (reason === 'io server disconnect') {
		console.warn("Server disconnected the client, trying to reconnect")
		socket.connect()
	}
	else {
		console.warn("Trying to reconnect again with server")
	}
})

socket.on('error', (error) => {
	console.error(error)
})

socket.on('playAudio', (chunk) => {
	let currentTime = performance.now()
	let elapsedTime = currentTime - lastPlayAudioTime
	lastPlayAudioTime = currentTime

	if (elapsedTime < entryTimePlayAudio) { // если меньше то продолжаем записывать ту же запись
		recordingAudio.push(chunk)
	}
	else { // начинаем новую запись
		saveAudio()
		recordingAudio = []
	}

	speaker.write(chunk)
})

const saveAudio = () => { // можно записывать в файл, а потом когда спадет активность подгрузить все в бд
	return
}