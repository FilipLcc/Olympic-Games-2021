"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let Request = new mongoose_1.default.Schema({
    _id: {
        type: String
    },
    name: {
        type: String
    },
    surname: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    nation: {
        type: String
    },
    email: {
        type: String
    },
    role: {
        type: String
    },
    accepted: {
        type: String
    }
});
//Array(), Array<Object>()
exports.default = mongoose_1.default.model("Request", Request, "Request");
//# sourceMappingURL=request.js.map