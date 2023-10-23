"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Playback = exports.PlaybackEmitter = void 0;
const events_1 = require("events");
class PlaybackEmitter extends events_1.EventEmitter {
    constructor() {
        super();
        this.on('start_record', () => { });
        this.on('end_record', () => { });
    }
} // StartRecord, EndRecord
exports.PlaybackEmitter = PlaybackEmitter;
exports.Playback = new PlaybackEmitter();
//# sourceMappingURL=PlaybackEmitter.js.map