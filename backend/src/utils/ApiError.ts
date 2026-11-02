export type FieldError = {
  field: string;
  message: string;
};

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errors?: FieldError[],
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(message: string, errors?: FieldError[]) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Not authorized') {
    return new ApiError(401, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message: string) {
    return new ApiError(409, message);
  }
}
