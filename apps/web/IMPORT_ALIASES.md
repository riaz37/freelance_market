# Import Aliases Configuration

This document outlines the custom path aliases configured for the web application to optimize import paths and improve code maintainability.

## Configured Aliases

The following aliases are configured in `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@components/*": ["./src/components/*"],
    "@contexts/*": ["./src/contexts/*"],
    "@lib/*": ["./src/lib/*"],
    "@validation": ["./src/lib/validation/index.ts"],
    "@validation/*": ["./src/lib/validation/*"],
    "@graphql": ["./src/lib/graphql/queries.ts"],
    "@graphql/*": ["./src/lib/graphql/*"],
    "@types/*": ["./src/types/*"],
    "@app/*": ["./src/app/*"]
  }
}
```

## Before vs After Examples

### Authentication Context Imports

**Before:**
```typescript
// From app pages
import { useAuth } from '../../contexts/AuthContext';

// From components
import { useAuth } from '../contexts/AuthContext';
```

**After:**
```typescript
// From anywhere
import { useAuth } from '@contexts/AuthContext';
```

### Component Imports

**Before:**
```typescript
// From app pages
import AuthLayout from '../../components/auth/AuthLayout';
import PublicLoginForm from '../../components/auth/PublicLoginForm';

// From other components
import { AuthGuard } from '../components/AuthGuard';
```

**After:**
```typescript
// From anywhere
import AuthLayout from '@components/auth/AuthLayout';
import PublicLoginForm from '@components/auth/PublicLoginForm';
import { AuthGuard } from '@components/AuthGuard';
```

### Validation Imports

**Before:**
```typescript
// From components
import { loginSchema, validateFormData } from '../lib/validation';
import { emailVerificationSchema } from '../../lib/validation';
```

**After:**
```typescript
// From anywhere
import { loginSchema, validateFormData, emailVerificationSchema } from '@validation';
```

### GraphQL Imports

**Before:**
```typescript
// From components
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../lib/graphql/queries';
import { GET_DASHBOARD_STATS } from '../../lib/graphql/queries';
```

**After:**
```typescript
// From anywhere
import { LOGIN_MUTATION, REGISTER_MUTATION, GET_DASHBOARD_STATS } from '@graphql';
```

### Library Imports

**Before:**
```typescript
// From components
import client from '../lib/apollo-client';
import { formatZodErrors } from '../../lib/validation/utils';
```

**After:**
```typescript
// From anywhere
import client from '@lib/apollo-client';
import { formatZodErrors } from '@validation/utils';
```

## Benefits

1. **Cleaner Code**: No more complex relative paths like `../../../`
2. **Better Maintainability**: Moving files doesn't break imports
3. **Improved Readability**: Clear indication of what's being imported
4. **IDE Support**: Better autocomplete and navigation
5. **Consistency**: Same import pattern regardless of file location

## Usage Guidelines

- Use `@components/*` for all component imports
- Use `@contexts/*` for React context imports
- Use `@validation` for validation schemas and utilities
- Use `@graphql` for GraphQL queries and mutations
- Use `@lib/*` for other library utilities
- Use `@/*` as a fallback for any src directory imports

## Configuration Files Updated

- `tsconfig.json` - TypeScript path mapping
- `codegen.ts` - GraphQL code generation paths
- `tailwind.config.cjs` - Tailwind content paths (cleaned up)
