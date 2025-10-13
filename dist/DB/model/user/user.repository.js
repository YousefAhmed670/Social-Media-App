"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const abstract_repository_1 = __importDefault(require("../../abstract.repository"));
const user_model_1 = require("./user.model");
class UserRepository extends abstract_repository_1.default {
    constructor() {
        super(user_model_1.User);
    }
}
exports.UserRepository = UserRepository;
