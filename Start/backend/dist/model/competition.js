"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bson_1 = require("bson");
let Competition = new mongoose_1.default.Schema({
    _id: {
        type: bson_1.ObjectID
    },
    competition_name: {
        type: String
    },
    start_date: {
        type: Date //Date behaves as string
    },
    end_date: {
        type: Date //Date behaves as string
    },
    sport: {
        type: String
    },
    discipline: {
        type: String
    },
    gender: {
        type: String
    },
    format: {
        type: String
    },
    venues: {
        type: Array
    },
    participants: {
        type: Array
    },
    delegate: {
        type: String
    },
    formed: {
        type: Boolean
    },
    over: {
        type: Boolean
    }
});
//Array(), Array<Object>()
exports.default = mongoose_1.default.model("Competition", Competition, "Competition");
//# sourceMappingURL=competition.js.map