export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorsDetails?: object[]
  ) {
    super(message);
  }
}
export class ConflictException extends AppError {
  constructor(message: string, errorsDetails?: object[]) {
    super(message, 409, errorsDetails);
  }
}
export class BadRequestException extends AppError {
  constructor(message: string, errorsDetails?: object[]) {
    super(message, 400, errorsDetails);
  }
}
export class NotFoundException extends AppError {
  constructor(message: string, errorsDetails?: object[]) {
    super(message, 404, errorsDetails);
  }
}
export class UnauthorizedException extends AppError {
  constructor(message: string, errorsDetails?: object[]) {
    super(message, 401, errorsDetails);
  }
}
