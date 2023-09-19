const Speaker = require('speaker')

const speaker = null

process.stdin.pipe(speaker)

const getSpeaker = () => {
	if (speaker) {
		return speaker
	}
	else {
		speaker = new Speaker({
			channels: 2,          // 2 channels
			bitDepth: 16,         // 16-bit samples
			sampleRate: 44100     // 44,100 Hz sample rate
		})

		return speaker
	}
}

module.exports = {
	getSpeaker
}