"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dev_config_1 = __importDefault(require("../env/dev.config"));
async function connectDB() {
    try {
        await mongoose_1.default.connect(dev_config_1.default.DB_URL);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log("Failed to connect to MongoDB", error);
    }
}
