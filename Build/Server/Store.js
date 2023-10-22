"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizedUsers = void 0;
const data_store_1 = __importDefault(require("data-store"));
const path_1 = require("path");
const fs_1 = require("fs");
const StorePath = 'AuthorizedUsers.json';
(0, fs_1.access)(StorePath, fs_1.constants.F_OK, (err) => {
    if (!err) {
        (0, fs_1.unlink)(StorePath, () => { });
    }
});
exports.AuthorizedUsers = new data_store_1.default(StorePath, {
    path: (0, path_1.join)(process.cwd(), StorePath)
});
//# sourceMappingURL=Store.js.map