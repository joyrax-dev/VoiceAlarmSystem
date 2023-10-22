"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recorder = void 0;
const fs_1 = require("fs");
const node_record_lpcm16_1 = require("node-record-lpcm16");
const client_json_1 = require("../client.json");
(0, fs_1.access)(client_json_1.RecorderPath, fs_1.constants.F_OK, (err) => {
    if (err) {
        throw new Error('Recorder is not installing!');
    }
});
// Если вообще не подключено не одно устройство записи то sox завершаетсяс кодом 2
exports.Recorder = (0, node_record_lpcm16_1.record)({
    recorder: 'sox',
    sampleRate: 44100,
    channels: 2
});
exports.Recorder._stream.pause();
//# sourceMappingURL=Recorder.js.map