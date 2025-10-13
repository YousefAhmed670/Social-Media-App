"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({ userId: String, token: String, type: String }, { timestamps: true });
exports.default = tokenSchema;
