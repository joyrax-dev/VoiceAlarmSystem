"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const Keyboard_1 = require("./Keyboard");
const Handlers_1 = require("./Handlers");
const Recorder_1 = require("./Recorder");
const Speaker_1 = require("./Speaker");
const fs_1 = require("fs");
const path_1 = require("path");
const PlaybackEmitter_1 = require("./PlaybackEmitter");
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
    let ReadyStatus;
    (function (ReadyStatus) {
        ReadyStatus[ReadyStatus["Yes"] = 0] = "Yes";
        ReadyStatus[ReadyStatus["No"] = 1] = "No";
        ReadyStatus[ReadyStatus["Maybe"] = 2] = "Maybe";
    })(ReadyStatus || (ReadyStatus = {}));
    //#region Recording and sending audio data
    let recipient = '';
    let readyStart = ReadyStatus.Yes;
    const startRecordWav = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../SFX/start_record.wav'));
    const endRecordWav = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../SFX/end_record.wav'));
    Recorder_1.Recorder._stream.on('data', (audio) => {
        socket.emit('send_audio', {
            Audio: audio,
            Locations: recipient,
            Sender: client_json_1.Client
        });
    });
    function Shortcut(key, recip) {
        Keyboard_1.Keyboard.addListener((event, isDown) => {
            if (event.state == 'DOWN' && event.name == key && readyStart == ReadyStatus.Yes) {
                readyStart = ReadyStatus.No;
                PlaybackEmitter_1.Playback.emit('start_record');
                setTimeout(() => {
                    recipient = recip;
                    Recorder_1.Recorder._stream.resume();
                }, 250);
            }
        });
        Keyboard_1.Keyboard.addListener((event, isDown) => {
            if (event.state == 'UP' && event.name == key && readyStart == ReadyStatus.No) {
                readyStart = ReadyStatus.Maybe;
                setTimeout(() => {
                    Recorder_1.Recorder._stream.pause();
                }, 250);
                setTimeout(() => {
                    Recorder_1.Recorder._stream.pause();
                    readyStart = ReadyStatus.Yes;
                    PlaybackEmitter_1.Playback.emit('end_record');
                }, 1000);
            }
        });
    }
    PlaybackEmitter_1.Playback.on('start_record', () => {
        Speaker_1.speaker.write(startRecordWav);
        console.log('start record');
    });
    PlaybackEmitter_1.Playback.on('end_record', () => {
        Speaker_1.speaker.write(endRecordWav);
        console.log('end record');
    });
    for (let key in client_json_1.Shortcuts) {
        let location = client_json_1.Shortcuts[key];
        Shortcut(key, location);
    }
    Keyboard_1.Keyboard.run();
    //#endregion
}
exports.default = Start;
//# sourceMappingURL=Client.js.map