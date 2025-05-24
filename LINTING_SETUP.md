# ESLint and Prettier Setup for Next.js Supabase Project

## Overview
This project has been configured with ESLint and Prettier for code quality and consistent formatting. The setup is optimized for Next.js 15, TypeScript, React, and Supabase.

## Installed Packages

### ESLint Dependencies
- `eslint` - Core ESLint package
- `@typescript-eslint/parser` - TypeScript parser for ESLint
- `@typescript-eslint/eslint-plugin` - TypeScript-specific linting rules
- `eslint-plugin-react` - React-specific linting rules
- `eslint-plugin-react-hooks` - React Hooks linting rules
- `eslint-plugin-jsx-a11y` - Accessibility linting rules
- `@next/eslint-plugin-next` - Next.js specific linting rules
- `@eslint/js` - ESLint JavaScript configurations

### Prettier Dependencies
- `prettier` - Core Prettier package
- `prettier-plugin-tailwindcss` - Tailwind CSS class sorting
- `@trivago/prettier-plugin-sort-imports` - Import sorting

## Configuration Files

### ESLint Configuration (`eslint.config.js`)
- Uses the new ESLint v9 flat config format
- Configured for TypeScript and React
- Includes accessibility rules
- Optimized for Next.js development
- Proper global variables for browser and Node.js environments

### Prettier Configuration (`prettier.config.js`)
- Configured for consistent code formatting
- Tailwind CSS class sorting enabled
- Import sorting with custom order for Supabase projects
- Optimized for TypeScript and React

### VS Code Integration
- `.vscode/settings.json` - Auto-format on save, ESLint integration
- `.vscode/extensions.json` - Recommended extensions

## Available Scripts

```bash
# Linting
npm run lint          # Run ESLint with auto-fix
npm run lint:check    # Run ESLint without auto-fix

# Formatting
npm run format        # Format all files with Prettier
npm run format:check  # Check if files are formatted

# Type checking
npm run type-check    # Run TypeScript compiler check

# All checks
npm run check-all     # Run type-check, lint:check, and format:check
```

## Current Status

✅ **TypeScript**: No type errors
✅ **Prettier**: All files properly formatted
⚠️ **ESLint**: 15 warnings (mostly non-critical)

### ESLint Warnings Summary
- React unescaped entities (can be ignored or fixed manually)
- Non-null assertions in Supabase utilities (expected for environment variables)
- Unused variables in error handling (can be prefixed with `_` to ignore)

## Usage

### Pre-commit Workflow
1. Run `npm run format` to format your code
2. Run `npm run lint` to fix linting issues
3. Run `npm run check-all` to verify everything is correct

### IDE Integration
If using VS Code with the recommended extensions:
- Files will auto-format on save
- ESLint errors will be highlighted
- Import statements will be automatically organized

## Customization

### Adding New Rules
Edit `eslint.config.js` to add or modify linting rules.

### Changing Formatting
Edit `prettier.config.js` to adjust formatting preferences.

### Import Order
The import order is configured for Supabase projects:
1. React imports
2. Next.js imports
3. Supabase imports
4. Third-party modules
5. Internal components
6. Internal utilities
7. Relative imports

## Notes

- The configuration is optimized for the project structure with `app/`, `components/`, `utils/`, and `lib/` directories
- Tailwind CSS classes are automatically sorted
- The setup works with both JavaScript and TypeScript files
- All major browser and Node.js globals are properly configured
