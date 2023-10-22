"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const Store_1 = require("../Store");
exports.Handler = {
    Handler: function (socket) {
        return function deauth() {
            const client = Store_1.AuthorizedUsers.get(socket.id);
            Store_1.AuthorizedUsers.del(socket.id);
            console.log(`Client has been removed from the system [id=${socket.id}] [type=${client.Type}] [location=${client.Location}]`);
        };
    }
};
//# sourceMappingURL=Deauth.js.map