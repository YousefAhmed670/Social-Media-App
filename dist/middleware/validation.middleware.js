"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
const error_1 = require("../utilities/error");
const isValid = (schema) => {
    return (req, res, next) => {
        let data = { ...req.body, ...req.query, ...req.params };
        const validate = schema.safeParse(data);
        if (validate.success == false) {
            const errMassages = validate.error.issues.map((issue) => ({
                path: issue.path[0],
                message: issue.message,
            }));
            throw new error_1.BadRequestException("validation error", errMassages);
        }
        next();
    };
};
exports.isValid = isValid;
