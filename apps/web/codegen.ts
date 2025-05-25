import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // Point to your GraphQL server endpoint
  schema: 'http://localhost:5000/graphql',

  // Documents pattern - where your GraphQL queries/mutations are located
  documents: ['lib/graphql/**/*.ts', 'components/**/*.tsx', 'contexts/**/*.tsx'],

  // Generate TypeScript types and React Apollo hooks
  generates: {
    // Generate TypeScript types for the schema
    'lib/graphql/generated/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
      ],
      config: {
        // Configuration options
        scalars: {
          DateTime: 'string',
          JSON: 'any',
        },
        skipTypename: false,
        withHooks: false,
        withHOC: false,
        withComponent: false,
      },
    },

    // Generate React Apollo hooks
    'lib/graphql/generated/hooks.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        scalars: {
          DateTime: 'string',
          JSON: 'any',
        },
        withHooks: true,
        withHOC: false,
        withComponent: false,
        skipTypename: false,
        apolloReactHooksImportFrom: '@apollo/client',
      },
    },

    // Generate introspection result for Apollo Client
    'lib/graphql/generated/introspection.json': {
      plugins: ['introspection'],
    },
  },

  // Configuration options
  config: {
    // Ensure generated code is compatible with your setup
    maybeValue: 'T | null | undefined',
    inputMaybeValue: 'T | null | undefined',
  },

  // Hooks to run before/after generation
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
};

export default config;
