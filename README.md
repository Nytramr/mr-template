# Mr Template

A GoLang-like template engine implementation for the front end, inspired by Go's `html/template` package.

[![NPM version](https://img.shields.io/npm/v/@nytramr/mr-template.svg)](https://www.npmjs.com/package/@nytramr/mr-template)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Features

- Familiar Go template syntax (`{{ ... }}`) for JavaScript/TypeScript projects
- Supports template inheritance, blocks, conditionals, loops, and custom functions
- Safe HTML escaping and URL encoding helpers
- Extensible with user-defined functions
- Runs in browsers and Node.js

---

## Installation

```sh
npm install @nytramr/mr-template
```

## Usage

```javascript
import { Template } from '@nytramr/mr-template';

const tpl = new Template('example');
tpl.parse('Hello, {{.name}}!');

const output = tpl.execute({ name: 'World' });
console.log(output); // Hello, World!
```

### Custom Functions

```javascript
const tpl = new Template('example', {
  shout: (str) => String(str).toUpperCase() + '!',
});
tpl.parse('Say: {{shout .word}}');
console.log(tpl.execute({ word: 'hello' })); // Say: HELLO!
```

## Documentation

With some exceptions, the API is well documented in the GoLang [text/template documentation page](https://pkg.go.dev/text/template).

### API Differences

The differences in the API are mostly due to the specifics of the programming language and environment:

- Some Go-specific features (such as pipelines with channels, or certain built-in functions) may not be available.
- Custom functions are provided as a map/object at template creation.
- Data context is always a plain JavaScript object.

## Playground

Try Mr Template live in your browser!

Clone the repo and run:

```sh
npm install
npm run build
npm run start
```

Then open https://localhost:5500 in your browser.

## Development

See [docs/development.md](./docs/development.md) for instructions on contributing, running tests, and setting up SSL for the playground.

## License

MIT © Martin Rubinsztein
