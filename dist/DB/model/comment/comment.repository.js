"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const abstract_repository_1 = __importDefault(require("../../abstract.repository"));
const comment_model_1 = require("./comment.model");
class CommentRepository extends abstract_repository_1.default {
    constructor() {
        super(comment_model_1.Comment);
    }
}
exports.CommentRepository = CommentRepository;
