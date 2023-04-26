"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bson_1 = require("bson");
let Athlete = new mongoose_1.default.Schema({
    _id: {
        type: bson_1.ObjectID //was String
    },
    name: {
        type: String
    },
    surname: {
        type: String
    },
    nation: {
        type: String
    },
    gender: {
        type: String
    },
    sport: {
        type: String
    },
    disciplines: {
        type: Array
    },
    medals: {
        type: Boolean
    },
    carrier: {
        type: Number
    }
});
//Array(), Array<Object>()
exports.default = mongoose_1.default.model("Athlete", Athlete, "Athlete");
//# sourceMappingURL=athlete.js.map