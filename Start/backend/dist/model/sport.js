"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let Sport = new mongoose_1.default.Schema({
    _id: {
        type: String
    },
    name: {
        type: String
    }
});
//Array(), Array<Object>()
exports.default = mongoose_1.default.model("Sport", Sport, "Sport");
//# sourceMappingURL=sport.js.map