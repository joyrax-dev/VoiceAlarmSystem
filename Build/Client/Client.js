"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const socket_io_client_1 = require("socket.io-client");
const ReadyStatus_1 = require("../Shared/ReadyStatus");
const client_json_1 = require("../client.json");
const Handlers_1 = require("./Handlers");
const Keyboard_1 = require("./Keyboard");
const PlaybackEmitter_1 = require("./PlaybackEmitter");
const Recorder_1 = require("./Recorder");
const Speaker_1 = require("./Speaker");
let Recipient = '';
let ReadyStart = ReadyStatus_1.ReadyStatus.Yes;
const StartRecordWav = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../SFX/start_record.wav'));
const EndRecordWav = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../SFX/end_record.wav'));
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
    PlaybackEmitter_1.Playback.on('start_record', () => {
        Speaker_1.speaker.write(StartRecordWav);
        console.log('start record');
    });
    PlaybackEmitter_1.Playback.on('end_record', () => {
        Speaker_1.speaker.write(EndRecordWav);
        console.log('end record');
    });
    Recorder_1.Recorder._stream.on('data', (audio) => {
        socket.emit('send_audio', {
            Audio: audio,
            Locations: Recipient,
            Sender: client_json_1.Client
        });
    });
    InitializationKeyboard();
}
exports.default = Start;
function InitializationKeyboard() {
    function Shortcut(key, recip) {
        Keyboard_1.Keyboard.addListener((event, isDown) => {
            if (event.state == 'DOWN' && event.name == key && ReadyStart == ReadyStatus_1.ReadyStatus.Yes) {
                ReadyStart = ReadyStatus_1.ReadyStatus.No;
                PlaybackEmitter_1.Playback.emit('start_record');
                setTimeout(() => {
                    Recipient = recip;
                    Recorder_1.Recorder._stream.resume();
                }, 250);
            }
        });
        Keyboard_1.Keyboard.addListener((event, isDown) => {
            if (event.state == 'UP' && event.name == key && ReadyStart == ReadyStatus_1.ReadyStatus.No) {
                ReadyStart = ReadyStatus_1.ReadyStatus.Maybe;
                Recorder_1.Recorder._stream.pause();
                setTimeout(() => {
                    ReadyStart = ReadyStatus_1.ReadyStatus.Yes;
                    PlaybackEmitter_1.Playback.emit('end_record');
                }, 750);
            }
        });
    }
    for (let key in client_json_1.Shortcuts) {
        let location = client_json_1.Shortcuts[key];
        Shortcut(key, location);
    }
    Keyboard_1.Keyboard.run();
}
//# sourceMappingURL=Client.js.map