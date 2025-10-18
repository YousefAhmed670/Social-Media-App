"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const abstract_repository_1 = __importDefault(require("../../abstract.repository"));
const chat_model_1 = require("./chat.model");
class ChatRepository extends abstract_repository_1.default {
    constructor() {
        super(chat_model_1.Chat);
    }
}
exports.ChatRepository = ChatRepository;
