const { speaker } = require('../../services/speaker')
const { logger } = require('../../services/logger')

module.exports = (socket) => {
	return function play_audio_data (audio) {
		speaker.write(audio)
		logger.info(`Received chunk [size=${audio.length}]`)
	}
}