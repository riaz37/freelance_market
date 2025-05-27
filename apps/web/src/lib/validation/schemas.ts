import { z } from 'zod';

/**
 * Common validation schemas
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email');

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters');

export const nameSchema = z
  .string()
  .min(1, 'This field is required')
  .trim();

export const skillsSchema = z
  .string()
  .min(1, 'Skills are required for freelancers')
  .transform((val) => val.split(',').map(s => s.trim()).filter(s => s.length > 0));

export const hourlyRateSchema = z
  .string()
  .min(1, 'Hourly rate is required for freelancers')
  .transform((val) => parseFloat(val))
  .refine((val) => !isNaN(val) && val > 0, 'Valid hourly rate is required');

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form validation schemas
 */
export const registerStep1Schema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['FREELANCER', 'CLIENT']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const registerStep2Schema = z.object({
  bio: z.string().optional(),
  skills: z.string().optional(),
  hourlyRate: z.string().optional(),
  role: z.enum(['FREELANCER', 'CLIENT']),
}).superRefine((data, ctx) => {
  if (data.role === 'FREELANCER') {
    if (!data.bio || data.bio.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Bio is required for freelancers',
        path: ['bio'],
      });
    }
    
    if (!data.skills || data.skills.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Skills are required for freelancers',
        path: ['skills'],
      });
    }
    
    if (!data.hourlyRate || data.hourlyRate.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Hourly rate is required for freelancers',
        path: ['hourlyRate'],
      });
    } else {
      const rate = parseFloat(data.hourlyRate);
      if (isNaN(rate) || rate <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Valid hourly rate is required for freelancers',
          path: ['hourlyRate'],
        });
      }
    }
  }
});

export const fullRegisterSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(['FREELANCER', 'CLIENT']),
  bio: z.string().optional(),
  skills: z.string().optional(),
  hourlyRate: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).superRefine((data, ctx) => {
  if (data.role === 'FREELANCER') {
    if (!data.bio || data.bio.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Bio is required for freelancers',
        path: ['bio'],
      });
    }
    
    if (!data.skills || data.skills.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Skills are required for freelancers',
        path: ['skills'],
      });
    }
    
    if (!data.hourlyRate || data.hourlyRate.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Hourly rate is required for freelancers',
        path: ['hourlyRate'],
      });
    } else {
      const rate = parseFloat(data.hourlyRate);
      if (isNaN(rate) || rate <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Valid hourly rate is required for freelancers',
          path: ['hourlyRate'],
        });
      }
    }
  }
});

export type RegisterFormData = z.infer<typeof fullRegisterSchema>;

/**
 * Email verification schema
 */
export const emailVerificationSchema = z.object({
  verificationCode: z
    .string()
    .length(6, 'Please enter a 6-digit verification code')
    .regex(/^\d{6}$/, 'Verification code must be 6 digits'),
});

export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;

/**
 * Project creation schema (for future use)
 */
export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  price: z.number().min(0, 'Price must be a positive number'),
  tags: z.array(z.string()).optional().default([]),
});

export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

/**
 * Order creation schema (for future use)
 */
export const createOrderSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  requirements: z.string().optional(),
});

export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
