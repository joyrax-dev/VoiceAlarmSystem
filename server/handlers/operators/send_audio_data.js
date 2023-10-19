const { store } = require('../../services/store')
const { logger } = require('../../services/logger')

module.exports = (socket, namespaces) => {
	return function send_audio_data (data) { // data = { audio, location } location = 'ALL', ['LOCATION', ...]
		const { audio, location } = data
		const { speakersNamespace } = namespaces

		if (typeof location === 'string' && location == 'ALL') {
			speakersNamespace.emit('play_audio_data', audio)

			logger.info(`Transfer chunk [size=${audio.length}] [to=${location}]`)
		}
		else if (Array.isArray(location)) { // && location.every(item => typeof item === 'string')
			const clients = Object.entries(store.data)
			
			clients.forEach(([id, obj]) => {
				if (location.includes(obj.location)) {
					speakersNamespace.to(id).emit('play_audio_data', audio)
					
					logger.info(`Transfer chunk [size=${audio.length}] [to=${location}]`)
				}
			})
		}
	}
}