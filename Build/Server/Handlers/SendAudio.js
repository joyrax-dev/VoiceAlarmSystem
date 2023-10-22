"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const Store_1 = require("../Store");
exports.Handler = {
    Handler: function (socket) {
        return function send_audio(pack) {
            if (typeof pack.Locations === 'string' && pack.Locations == 'ALL') {
                let client = Store_1.AuthorizedUsers.get(socket.id);
                if (client.Type != 'OPERATOR') {
                    socket.emit('play_audio', pack.Audio);
                }
            }
            else if (Array.isArray(pack.Locations)) {
                for (let id in Store_1.AuthorizedUsers.data) {
                    if (Store_1.AuthorizedUsers.data.hasOwnProperty(id)) {
                        const authClient = Store_1.AuthorizedUsers.data[id];
                        const senderClient = Store_1.AuthorizedUsers.get(socket.id);
                        if (pack.Locations.includes(authClient.Location) && authClient.Location != senderClient.Location && senderClient.Type == 'SPEAKER') {
                            socket.to(id).emit('play_audio', pack.Audio);
                        }
                    }
                }
            }
        };
    }
};
//# sourceMappingURL=SendAudio.js.map