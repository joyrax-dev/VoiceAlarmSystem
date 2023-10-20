const { hostname, port, client } = require('./config.json')
const { toolchain } = require('./services/toolchain')
const { logger } = require('./services/logger')
const { recorder } = require('./services/recorder')
const { keyboard } = require('./services/keyboard')
const { handlers } = require('./handlers')
const io = require('socket.io-client')

const socketHandlers = handlers()
const socket = io(`http://${hostname}:${port}/${client.type}`, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 5000
})

socketHandlers.forEach(handler => {
    let callback = handler(socket)
    let callbackName = toolchain.extractFunctionName(callback)

    socket.on(callbackName, callback)
})

recorder.stream().on('data', audio => {
    logger.info(`Send chunk [size=${audio.length}]`)
    socket.emit('send_audio_data', { 
        audio: audio, 
        location: 'ALL' // 'ALL', ['LOCATION', ...]
    })
})

keyboard.addListener(function (e, down) {
    if (e.state == "DOWN" && e.name == "SPACE") { //  && (down["LEFT ALT"] || down["RIGHT ALT"])
        // if (recorder._stream.isPaused()) {
        //     recorder._stream.resume()
        // }
        recorder._stream.resume()
    }
})

keyboard.addListener(function (e, down) {
    if (e.state == "UP" && e.name == "SPACE") { //  && (down["LEFT ALT"] || down["RIGHT ALT"])
        // if (!recorder._stream.isPaused()) {
        //     recorder._stream.pause()
        // }
        recorder._stream.pause()
    }
})

process.on('exit', (code) => {
    logger.warn(`The client has completed its work [code=${code}] [type=${client.type}] [location=${client.location}]`)
    socket.disconnect()
})


keyboard.start()
socket.connect()
