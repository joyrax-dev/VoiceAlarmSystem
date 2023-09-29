const { hostname, port, client } = require('./config.json')
const { getRecorder, getFunctionName, logger, keyboard } = require('./toolchain')
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
})


keyboard.addListener(function (e, down) {
    if (e.state == "DOWN" && e.name == "F" && (down["LEFT ALT"] || down["RIGHT ALT"])) {
        //call your function
        console.log('alt+f')
        return true;
    }
});

socket.connect()
logger.info(`Operator connect [hostname=${hostname}] [port=${port}]`)

socket.emit('auth', client)
logger.info(`Client authentication`)