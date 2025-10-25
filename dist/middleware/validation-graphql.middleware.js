"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidGraphql = void 0;
const error_1 = require("../utilities/error");
const isValidGraphql = (schema, args) => {
    const validate = schema.safeParse(args);
    if (validate.success == false) {
        const errMassages = validate.error.issues.map((issue) => ({
            path: issue.path[0],
            message: issue.message,
        }));
        throw new error_1.BadRequestException(JSON.stringify(errMassages));
    }
};
exports.isValidGraphql = isValidGraphql;
