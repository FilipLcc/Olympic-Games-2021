"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bson_1 = require("bson");
let Schedule = new mongoose_1.default.Schema({
    _id: {
        type: bson_1.ObjectID
    },
    id_competition: {
        type: String
    },
    mySchedule: {
        type: Object
    }
});
//Array(), Array<Object>()
exports.default = mongoose_1.default.model("Schedule", Schedule, "Schedule");
//# sourceMappingURL=schedule.js.map