const WebSocket = require('ws')
const record = require('node-record-lpcm16');


const mic = record.record({
	sampleRate: 44100,
	channels: 2,
});

const wss = new WebSocket.Server({port: 9099})

wss.on('connection', (ws) => {
	console.log('Новое подключение')

	mic.process.stdout.on('data', chunk => {
		ws.send(chunk, {binary: true})
	})
})

wss.on('close', () => {
	console.log('Соединение WebSocket закрыто');
	mic.stop();
});
