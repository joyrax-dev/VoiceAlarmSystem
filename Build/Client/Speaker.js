"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.speaker = void 0;
const speaker_1 = __importDefault(require("speaker"));
exports.speaker = new speaker_1.default({
    channels: 2,
    bitDepth: 16,
    sampleRate: 44100
});
process.stdin.pipe(exports.speaker);
//# sourceMappingURL=Speaker.js.map