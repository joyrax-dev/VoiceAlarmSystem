"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const Handlers_1 = require("./Handlers");
const Config = __importStar(require("../server.json"));
function Start() {
    console.log(`Startup server [host=${Config.Host}] [port=${Config.Port}]`);
    const Http = (0, http_1.createServer)();
    const SocketServer = new socket_io_1.Server(Http);
    SocketServer.on('connection', (socket) => {
        (0, Handlers_1.StartHandlers)(socket);
        console.log(`Client connected [id=${socket.id}]`);
    });
    Http.listen(Config.Port, Config.Host, () => {
        console.log('Server startup');
    });
}
exports.default = Start;
//# sourceMappingURL=Server.js.map