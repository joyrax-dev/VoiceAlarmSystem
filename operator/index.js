const { hostname, port, client } = require('./config.json')
const { recorder, toolchain, logger, keyboard } = require('./services')
const { handlers } = require('./handlers')
const io = require('socket.io-client')

const socketHandlers = handlers()
const socket = io(`http://${hostname}:${port}/operators`, {
    autoConnect: false
})

socketHandlers.forEach(handler => {
    let callback = handler(socket)
    let callbackName = toolchain.extractFunctionName(callback)

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