"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
exports.Handler = {
    Handler: function (socket) {
        return function connect_error(err) {
            console.log(`Reconnection attempt`);
        };
    }
};
//# sourceMappingURL=ConnectError.js.map