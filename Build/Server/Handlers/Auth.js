"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const Store_1 = require("../Store");
exports.Handler = {
    Handler: function (socket) {
        return function auth(Info) {
            Store_1.AuthorizedUsers.set(socket.id, Info);
            console.log(`Client accounted [id=${socket.id}] [location=${Info.Location}] [type=${Info.Type}]`);
        };
    }
};
//# sourceMappingURL=Auth.js.map