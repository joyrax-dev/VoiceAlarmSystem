"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const Keyboard_1 = require("./Keyboard");
const Handlers_1 = require("./Handlers");
const Recorder_1 = require("./Recorder");
const client_json_1 = require("../client.json");
function Start() {
    console.log(`Startup client [type=${client_json_1.Client.Type}] [location=${client_json_1.Client.Location}]`);
    const socket = (0, socket_io_client_1.connect)(`http://${client_json_1.Host}:${client_json_1.Port}`, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 5000
    });
    (0, Handlers_1.StartHandlers)(socket);
    socket.connect();
    //#region Recording and sending audio data
    let recipient = '';
    Recorder_1.Recorder._stream.on('data', (audio) => {
        socket.emit('send_audio', {
            Audio: audio,
            Locations: recipient,
            Sender: client_json_1.Client
        });
    });
    function Shortcut(key, recip) {
        Keyboard_1.Keyboard.addListener((event, isDown) => {
            if (event.state == 'DOWN' && event.name == key) {
                setTimeout(() => {
                    recipient = recip;
                    Recorder_1.Recorder._stream.resume();
                }, 250);
            }
        });
        Keyboard_1.Keyboard.addListener((event, isDown) => {
            if (event.state == 'UP' && event.name == key) {
                setTimeout(() => {
                    Recorder_1.Recorder._stream.pause();
                }, 250);
            }
        });
    }
    for (let key in client_json_1.Shortcuts) {
        let location = client_json_1.Shortcuts[key];
        Shortcut(key, location);
    }
    Keyboard_1.Keyboard.run();
    //#endregion
}
exports.default = Start;
//# sourceMappingURL=Client.js.map