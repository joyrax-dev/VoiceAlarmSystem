"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keyboard = void 0;
const node_global_key_listener_1 = require("node-global-key-listener");
class FixGlobalKeyboardListener extends node_global_key_listener_1.GlobalKeyboardListener {
    constructor(config) {
        super(config);
    }
    run() {
        this.start();
    }
}
exports.Keyboard = new FixGlobalKeyboardListener({
    windows: {
        onError: (errorCode) => {
            throw new Error(`Error keyboard [error=${errorCode}]`);
        }
    }
});
//# sourceMappingURL=Keyboard.js.map