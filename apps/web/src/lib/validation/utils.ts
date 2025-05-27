import { z } from 'zod';

/**
 * Converts Zod validation errors to a format compatible with form error state
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (path) {
      errors[path] = err.message;
    }
  });
  
  return errors;
}

/**
 * Validates form data using a Zod schema and returns formatted errors
 */
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatZodErrors(error) };
    }
    // Handle unexpected errors
    return { success: false, errors: { general: 'Validation failed' } };
  }
}

/**
 * Validates form data safely and returns partial validation results
 * Useful for real-time validation as user types
 */
export function validateFormDataSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { errors: Record<string, string>; hasErrors: boolean } {
  try {
    schema.parse(data);
    return { errors: {}, hasErrors: false };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = formatZodErrors(error);
      return { errors, hasErrors: Object.keys(errors).length > 0 };
    }
    return { errors: { general: 'Validation failed' }, hasErrors: true };
  }
}

/**
 * Validates a single field using a Zod schema
 */
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: unknown,
  fieldName: string
): string | null {
  try {
    schema.parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find(err => 
        err.path.length === 0 || err.path[0] === fieldName
      );
      return fieldError?.message || null;
    }
    return 'Validation failed';
  }
}

/**
 * Custom hook for form validation with Zod
 */
export function useZodValidation<T>(schema: z.ZodSchema<T>) {
  const validate = (data: unknown) => validateFormData(schema, data);
  const validateSafe = (data: unknown) => validateFormDataSafe(schema, data);
  
  return { validate, validateSafe };
}
