const { speaker, logger } = require('../services')

module.exports = (socket) => {
	return function play_audio_data (audio) {
		speaker.write(audio)
		logger.info(`Received chunk [size=${audio.length}]`)
	}
}