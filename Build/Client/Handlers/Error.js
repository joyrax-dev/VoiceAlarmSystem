"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
exports.Handler = {
    Handler: function (socket) {
        return function error(err) {
            console.log(`Socket error [error=${err}]`);
        };
    }
};
//# sourceMappingURL=Error.js.map