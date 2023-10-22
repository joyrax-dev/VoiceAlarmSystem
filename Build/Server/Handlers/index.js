"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartHandlers = void 0;
const Disconnect_1 = require("./Disconnect");
const Auth_1 = require("./Auth");
const Deauth_1 = require("./Deauth");
const SendAudio_1 = require("./SendAudio");
function StartHandlers(socket) {
    socket.on('disconnect', Disconnect_1.Handler.Handler(socket));
    socket.on('auth', Auth_1.Handler.Handler(socket));
    socket.on('deauth', Deauth_1.Handler.Handler(socket));
    socket.on('send_audio', SendAudio_1.Handler.Handler(socket));
}
exports.StartHandlers = StartHandlers;
//# sourceMappingURL=index.js.map