// const express = require('express')
const WebSocket = require('ws')
const Speaker = require('speaker')

const speaker = new Speaker({
    channels: 2,          // 2 channels
    bitDepth: 16,         // 16-bit samples
    sampleRate: 44100     // 44,100 Hz sample rate
})

process.stdin.pipe(speaker)

const ws = new WebSocket('ws://localhost:9099')

// Евент который срабатывает когда устанавливается соединение 
// с сервером, тут можно например отправлять серверу инфу о том
// что это за клиент (например АБК 5 ЭТАЖ) и сервер будет знать 
// что этот клиент подключен и все заебись^^
ws.on('open', () => {
	console.log('Соединение установлено')
})

ws.on('message', (data) => {
	speaker.write(data) // Buffer.from(data)
})

ws.on('close', () => {
	console.log('Соединение закрыто')
})