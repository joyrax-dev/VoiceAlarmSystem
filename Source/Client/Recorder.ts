import { access, constants } from 'fs'
import { record } from 'node-record-lpcm16'
import { RecorderPath } from '../client.json'

access(RecorderPath, constants.F_OK, (err) => {
    if (err) {
		throw new Error('Recorder is not installing!')
	}
})

// Если вообще не подключено не одно устройство записи то sox завершаетсяс кодом 2
export const Recorder = record({
	recorder: 'sox',
	sampleRate: 44100,
	channels: 2
})

Recorder._stream.pause()