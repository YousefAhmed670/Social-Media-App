"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(item) {
        const doc = new this.model(item);
        return await doc.save();
    }
    update() { }
    delete() { }
    find() { }
    findOne() { }
}
exports.default = AbstractRepository;
