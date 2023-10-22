"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartHandlers = void 0;
const Disconnect_1 = require("./Disconnect");
const Connect_1 = require("./Connect");
const ConnectError_1 = require("./ConnectError");
const Error_1 = require("./Error");
const PlayAudio_1 = require("./PlayAudio");
function StartHandlers(socket) {
    socket.on('disconnect', Disconnect_1.Handler.Handler(socket));
    socket.on('connect', Connect_1.Handler.Handler(socket));
    socket.on('connect_error', ConnectError_1.Handler.Handler(socket));
    socket.on('error', Error_1.Handler.Handler(socket));
    socket.on('play_audio', PlayAudio_1.Handler.Handler(socket));
}
exports.StartHandlers = StartHandlers;
//# sourceMappingURL=index.js.map