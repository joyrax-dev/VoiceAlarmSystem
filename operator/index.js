const { hostname, port, client } = require('./config.json')
const { getRecorder, getFunctionName, logger } = require('./toolchain')
const { handlers } = require('./handlers')
const io = require('socket.io-client')

const micro = getRecorder()
const socketHandlers = handlers()
const socket = io(`http://${hostname}:${port}/operators`, {
    autoConnect: false
})

socketHandlers.forEach(handler => {
    let callback = handler(socket)
    let callbackName = getFunctionName(callback)

    socket.on(callbackName, callback)
});

socket.connect()
logger.info(`Operator connect [hostname=${hostname}] [port=${port}]`)

socket.emit('auth', client)
logger.info(`Client authentication`)