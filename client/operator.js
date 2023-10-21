const { logger } = require('./services/logger')
const { recorder } = require('./services/recorder')
const { keyboard } = require('./services/keyboard')
const { keyList } = require('./config.json')

let recipient = ''

function shortcut(key, recip) {
	keyboard.addListener(function (e, down) {
		if (e.state == "DOWN" && e.name == key) {
			recipient = recip
			recorder._stream.resume()
		}
	})
	
	keyboard.addListener(function (e, down) {
		if (e.state == "UP" && e.name == key) {
			recorder._stream.pause()
			recipient = ''
		}
	})
}

module.exports = function(socket) {
	logger.info(`Start client [type=${process.env.type}]`)

	recorder.stream().on('data', audio => {
		logger.info(`Send chunk [size=${audio.length}] [to=${recipient}]`)
		socket.emit('send_audio_data', { 
			audio: audio, 
			location: recipient
		})
	})
	
	const list = Object.entries(keyList)

	list.forEach(([key, recip]) => shortcut(key, recip))
	keyboard.start()
}