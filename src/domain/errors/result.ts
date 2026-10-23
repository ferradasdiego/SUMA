export type ErrorCode =
  'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'STORAGE' | 'MIGRATION' | 'IO' | 'UNKNOWN';

export interface AppError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly field?: string;
  readonly details?: Readonly<Record<string, unknown>>;
  readonly cause?: unknown;
}

export type Result<T> =
  { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: AppError };

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err<T = never>(error: AppError): Result<T> {
  return { ok: false, error };
}

export function validationError(
  message: string,
  field?: string,
  details?: Record<string, unknown>,
): AppError {
  return {
    code: 'VALIDATION',
    message,
    ...(field ? { field } : {}),
    ...(details ? { details } : {}),
  };
}

export function notFoundError(message: string): AppError {
  return { code: 'NOT_FOUND', message };
}

export function conflictError(message: string): AppError {
  return { code: 'CONFLICT', message };
}

export function storageError(message: string, cause?: unknown): AppError {
  return { code: 'STORAGE', message, ...(cause !== undefined ? { cause } : {}) };
}

export function migrationError(message: string, cause?: unknown): AppError {
  return { code: 'MIGRATION', message, ...(cause !== undefined ? { cause } : {}) };
}

export function ioError(message: string, cause?: unknown): AppError {
  return { code: 'IO', message, ...(cause !== undefined ? { cause } : {}) };
}

export function unknownError(message: string, cause?: unknown): AppError {
  return { code: 'UNKNOWN', message, ...(cause !== undefined ? { cause } : {}) };
}
