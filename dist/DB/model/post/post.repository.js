"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const abstract_repository_1 = __importDefault(require("../../abstract.repository"));
const post_model_1 = require("./post.model");
class PostRepository extends abstract_repository_1.default {
    constructor() {
        super(post_model_1.Post);
    }
}
exports.PostRepository = PostRepository;
