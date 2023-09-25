const { hostname, port, client } = require('./config.json')
const { getFunctionName, logger } = require('./toolchain')
const { handlers } = require('./handlers')
const io = require('socket.io-client')

const socketHandlers = handlers()
const socket = io(`http://${hostname}:${port}/speakers`, {
    autoConnect: false
})

socketHandlers.forEach(handler => {
    let callback = handler(socket)
    let callbackName = getFunctionName(callback)

    socket.on(callbackName, callback)
});

socket.connect()
logger.info(`Speaker connect [hostname=${hostname}] [port=${port}]`)

socket.emit('auth', client)
logger.info(`Client authentication`)
