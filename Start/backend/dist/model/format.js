"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let Format = new mongoose_1.default.Schema({
    _id: {
        type: String
    },
    format_name: {
        type: String
    },
    fixture: {
        type: String
    },
    num_of_players: {
        type: Number
    },
    result_format: {
        type: String
    },
    num_of_reps: {
        type: Number
    }
});
//Array(), Array<Object>()
exports.default = mongoose_1.default.model("Format", Format, "Format");
//# sourceMappingURL=format.js.map