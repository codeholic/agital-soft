import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../api/src/schema.gql',
  documents: ['src/**/*.graphql'],
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-vue-apollo'],
      config: {
        withCompositionFunctions: true,
        vueApolloComposableImportFrom: '@vue/apollo-composable',
        vueCompositionApiImportFrom: 'vue',
      },
    },
  },
};

export default config;
