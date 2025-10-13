"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedException = exports.NotFoundException = exports.BadRequestException = exports.ConflictException = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    errorsDetails;
    constructor(message, statusCode, errorsDetails) {
        super(message);
        this.statusCode = statusCode;
        this.errorsDetails = errorsDetails;
    }
}
exports.AppError = AppError;
class ConflictException extends AppError {
    constructor(message, errorsDetails) {
        super(message, 409, errorsDetails);
    }
}
exports.ConflictException = ConflictException;
class BadRequestException extends AppError {
    constructor(message, errorsDetails) {
        super(message, 400, errorsDetails);
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends AppError {
    constructor(message, errorsDetails) {
        super(message, 404, errorsDetails);
    }
}
exports.NotFoundException = NotFoundException;
class UnauthorizedException extends AppError {
    constructor(message, errorsDetails) {
        super(message, 401, errorsDetails);
    }
}
exports.UnauthorizedException = UnauthorizedException;
