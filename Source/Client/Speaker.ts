import Speaker from 'speaker'

export const speaker: Speaker = new Speaker({
	channels: 2,
	bitDepth: 16,
	sampleRate: 44100
})

process.stdin.pipe(speaker)