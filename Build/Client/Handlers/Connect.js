"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const client_json_1 = require("../../client.json");
exports.Handler = {
    Handler: function (socket) {
        return function connect() {
            console.log(`Connected [to=http://${client_json_1.Host}:${client_json_1.Port}]`);
            setTimeout(() => {
                socket.emit('auth', client_json_1.Client);
            }, 500);
        };
    }
};
//# sourceMappingURL=Connect.js.map