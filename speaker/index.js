const { hostname, port, client } = require('./config.json')
const { toolchain } = require('./services/toolchain')
const { logger } = require('./services/logger')
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

process.on('exit', (code) => {
    logger.warn(`The client has completed its work [code=${code}] [type=${client.type}] [location=${client.location}]`)
    socket.disconnect()
})

socket.connect()
