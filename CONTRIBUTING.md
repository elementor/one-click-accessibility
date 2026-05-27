# Contributing to Ally – Web Accessibility & Usability

Thank you for your interest in contributing to [Ally](https://github.com/elementor/one-click-accessibility), the WordPress accessibility plugin built by [Elementor](https://elementor.com/).

## Prerequisites

Make sure you have the following installed before starting:

- **PHP** 7.4 or higher
- **Composer** 2
- **Node.js** 22 or higher with npm
- **Docker** (required by `@wordpress/env` for the local WordPress environment)

## Setting Up the Environment

To install PHP dependencies:

```bash
composer install
```

To install JavaScript dependencies:

```bash
npm install
```

## Build and Assets

The project uses `@wordpress/scripts` with a custom webpack configuration ([`webpack.config.js`](webpack.config.js)).

Compiled output goes to `assets/build/`. Source files live under `assets/dev/` and within each feature module under `modules/<name>/assets/`.

To build assets for production:

```bash
npm run build
```

To activate watch mode for development, in order to rebuild assets after making changes:

```bash
npm run start
```

## Linting and Coding Standards

The project enforces coding standards across three languages (PHP, JS, CSS). A Husky pre-commit hook (`.husky/pre-commit`) runs the relevant linters automatically on staged files before each commit.

### PHP

Uses PHP_CodeSniffer with the WordPress coding standards, configured in [`ruleset.xml`](ruleset.xml). The text domain is `pojo-accessibility`.

```bash
npm run lint:php      # check for violations
npm run lint:php:fix  # auto-fix violations
```

### JavaScript

Uses ESLint with `@wordpress/eslint-plugin` (React, jsx-a11y strict, Prettier), configured in [`.eslintrc`](.eslintrc).

```bash
npm run lint:js       # check for violations
npm run lint:js:fix   # auto-fix violations
```

### CSS / SCSS

Uses Stylelint with `@wordpress/stylelint-config`, configured in [`.stylelintrc`](.stylelintrc).

```bash
npm run lint:css      # check for violations
npm run lint:css:fix  # auto-fix violations
```

### All at once

```bash
npm run lint
```

## Local Environment

To start the local WordPress environment (requires Docker):

```bash
npm run local:start
```

To install Composer in the local environment:

```bash
npm run local:composer:dev
```

To stop the local environment when you are done:

```bash
npm run local:stop
```

## Running Tests

The project uses a suite of PHPUnit tests, located under `tests/phpunit/`. The tests run inside the local WordPress environment (requires Docker).

To start the local WordPress environment:

```bash
npm run local:start
```

To run the full PHPUnit test suite:

```bash
npm run local:phpunit
```

To run with HTML coverage report (enables Xdebug coverage):

```bash
npm run local:phpunit:cov
```
