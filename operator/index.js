const { hostname, port, client } = require('./config.json')
// const { performance } = require('perf_hooks')
const { getRecorder, getFunctionName } = require('./toolchain')
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
