"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let Nation = new mongoose_1.default.Schema({
    _id: {
        type: String
    },
    name: {
        type: String
    },
    short_name: {
        type: String
    },
    flag: {
        type: String
    },
    gold_cnt: {
        type: Number
    },
    silver_cnt: {
        type: Number
    },
    bronze_cnt: {
        type: Number
    },
    overall: {
        type: Number
    },
    athlete_cnt: {
        type: Number
    },
    teams_cnt: {
        type: Number
    },
    rank: {
        type: Number
    }
});
//Array(), Array<Object>()
exports.default = mongoose_1.default.model("Nation", Nation, "Nation");
//# sourceMappingURL=nation.js.map