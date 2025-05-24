// prettier.config.js
module.exports = {
  plugins: ['prettier-plugin-tailwindcss', '@trivago/prettier-plugin-sort-imports'],

  // Basic formatting
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',

  // Tailwind CSS configuration
  tailwindConfig: './tailwind.config.ts',
  tailwindFunctions: ['cn', 'cva', 'clsx'], // For shadcn's utility functions

  // Import sorting configuration
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '^@supabase/(.*)$', // Supabase imports
    '<THIRD_PARTY_MODULES>',
    '^@/components/(.*)$',
    '^@/lib/(.*)$',
    '^@/utils/(.*)$', // Utils directory
    '^@/app/(.*)$', // App directory
    '^@/(.*)$',
    '^[./]', // Relative imports
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
};
