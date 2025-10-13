"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRepository = void 0;
const abstract_repository_1 = __importDefault(require("../../abstract.repository"));
const token_model_1 = require("./token.model");
class TokenRepository extends abstract_repository_1.default {
    constructor() {
        super(token_model_1.Token);
    }
}
exports.TokenRepository = TokenRepository;
