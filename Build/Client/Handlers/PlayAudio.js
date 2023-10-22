"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const Speaker_1 = require("../Speaker");
exports.Handler = {
    Handler: function (socket) {
        return function play_audio(data) {
            Speaker_1.speaker.write(data);
        };
    }
};
//# sourceMappingURL=PlayAudio.js.map