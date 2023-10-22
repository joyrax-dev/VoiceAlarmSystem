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
const commander_1 = require("commander");
new commander_1.Command('start')
    .description('Voice Alarm System')
    .option('--which <value>', 'Which application [server, client]')
    .action(function (value) {
    if (value.which == 'server') {
        Promise.resolve().then(() => __importStar(require('./Server/Server'))).then((module) => {
            module.default();
        });
    }
    else if (value.which == 'client') {
        Promise.resolve().then(() => __importStar(require('./Client/Client'))).then((module) => {
            module.default();
        });
    }
    else {
        throw new Error('There is no such app');
    }
})
    .parse(process.argv);
//# sourceMappingURL=App.js.map