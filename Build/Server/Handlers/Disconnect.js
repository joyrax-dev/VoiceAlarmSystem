"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const Deauth_1 = require("./Deauth");
exports.Handler = {
    Handler: function (socket) {
        return function disconnect(reason) {
            console.log(`Disconnected [reason=${reason}]`);
            Deauth_1.Handler.Handler(socket)();
        };
    }
};
//# sourceMappingURL=Disconnect.js.map