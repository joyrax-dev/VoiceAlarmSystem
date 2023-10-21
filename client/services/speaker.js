const Speaker = require('speaker')

const speaker = new Speaker({
	channels: 2,          // 2 channels
	bitDepth: 16,         // 16-bit samples
	sampleRate: 44100     // 44,100 Hz sample rate
})

process.stdin.pipe(speaker)

module.exports = {
	speaker
}