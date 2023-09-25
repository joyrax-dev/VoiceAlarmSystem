const { hostname, port, client } = require('./config.json')
// const { performance } = require('perf_hooks')
const { getSpeaker, getFunctionName } = require('./toolchain')
const { handlers } = require('./handlers')
const io = require('socket.io-client')

const speaker = getSpeaker()
const socketHandlers = handlers()
const socket = io(`http://${hostname}:${port}/speakers`, {
    autoConnect: false
})

socketHandlers.forEach(handler => {
    let nameHandler = getFunctionName(handler)

    socket.on(nameHandler, handler)
});

socket.connect()
