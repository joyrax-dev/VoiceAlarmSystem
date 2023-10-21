const { recorder } = require('../config.json')
const { record } = require('node-record-lpcm16')
const { access, constants } = require('fs')

access(recorder, constants.F_OK, (err) => {
	if (err) {
		throw new Error('Recorder is not installing!')
	}
})

// Если вообще не подключено не одно устройство записи то sox завершаетсяс кодом 2
const _recorder = record({
	recorder: 'sox',
	sampleRate: 44100,
	channels: 2
})
_recorder._stream.pause()

module.exports = {
	recorder: _recorder
}