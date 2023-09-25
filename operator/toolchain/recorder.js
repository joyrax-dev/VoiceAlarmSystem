const fs = require('fs')
const path = require('path')
const { record } = require('node-record-lpcm16');

const pathRecorder = 'C:\\Program Files (x86)\\sox-14-4-1\\sox.exe'
let mic = null

const recorderExists = () => {
	fs.access(pathRecorder, fs.F_OK, (err) => {
		if (err) {
			throw new Error('Recorder is not installing!')
		}
	})
}

const getRecorder = () => {
	if (mic) {
		return mic
	}
	else {
		mic = record({
			recorder: 'sox',
			sampleRate: 44100,
			channels: 2
		})

		return mic
	}
}

module.exports = {
	pathRecorder,
	recorderExists,
	getRecorder
}