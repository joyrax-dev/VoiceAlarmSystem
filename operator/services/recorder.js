const { recorderPath } = require('../config.json')
const { record } = require('node-record-lpcm16')
const { access, constants } = require('fs')

access(recorderPath, constants.F_OK, (err) => {
	if (err) {
		throw new Error('Recorder is not installing!')
	}
})

// Если вообще не подключено не одно устройство записи то sox завершаетсяс кодом 2
const recorder = record({
	recorder: 'sox',
	sampleRate: 44100,
	channels: 2
})
recorder._stream.pause()

module.exports = {
	recorder
}