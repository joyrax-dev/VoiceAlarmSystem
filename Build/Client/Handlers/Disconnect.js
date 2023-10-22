"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
exports.Handler = {
    Handler: function (socket) {
        return function disconnect(reason) {
            console.log(`Disconnected`);
            if (reason === 'io server disconnect') {
                console.log(`Reconnection attempt`);
                socket.connect();
            }
        };
    }
};
//# sourceMappingURL=Disconnect.js.map