# ServerBuilder
[![NPM](https://nodei.co/npm/serverbuilder.png)](https://nodei.co/npm/serverbuilder/)
[![Inline docs](http://inch-ci.org/github/Berkmann18/ServerBuilder.svg?branch=master)](http://inch-ci.org/github/Berkmann18/ServerBuilder)
[![NSP Status](https://nodesecurity.io/orgs/berkmann18/projects/ea369eec-8c46-4ad6-903c-739aa66d006a/badge)](https://nodesecurity.io/orgs/berkmann18/projects/ea369eec-8c46-4ad6-903c-739aa66d006a)
[![codecov.io Code Coverage](https://img.shields.io/codecov/c/github/Berkmann18/ServerBuilder.svg?maxAge=2592000)](https://codecov.io/github/Berkmann18/ServerBuilder?branch=master)
[![dependencies Status](https://david-dm.org/Berkmann18/ServerBuilder/status.svg)](https://david-dm.org/Berkmann18/ServerBuilder)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Berkmann18/ServerBuilder/issues)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&identifier=115825259)](https://dependabot.com)
[![BCH compliance](https://bettercodehub.com/edge/badge/Berkmann18/ServerBuilder?branch=master)](https://bettercodehub.com/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

It's a simple NodeJS/Express server builder allowing you to get a working server up in just a few lines.

## Install
To install it you need to run the following:
```cli
npm i serverbuilder
```

_Note_: Don't forget to use `-g`, `--save`, `--save-dev` if appropriate.

## Usage
```js
const app = require('express')(),
      Server = require('serverbuilder');
let options = {
  name: 'My Server',
  callback(server) {
    app.set('port', server.port);
  },
  publicIP: true
};

new Server(app, process.env.PORT || 3e3, options);
```
Or with **HTTPS**:
```js
const fs = require('fs'),
      app = require('express')(),
      Server = require('serverbuilder');

let options = {
  name: 'My Server',
  useHttps: true,
  securityOptions: {
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-cert.pem')
  }
  callback(server) {
    app.set('port', server.port);
  },
  publicIP: true
};

new Server(app, process.env.PORT || 3e3, options);
```

## Contribution
If you discover bugs, errors or/and have suggestions/feedback please create an [issue](http://github.com/Berkmann18/ServerBuilder/issues) or/and submit a [PR](http://github.com/Berkmann18/ServerBuilder/pulls).

If you want to contribute, make sure you stick with the coding style that ESLint is enforcing (cf. configuration file).
To check if a file stick to the standards:
```cli
eslint -c ./config/.eslintrc.js yourFile.js
#Or `npm lint` if appropriate
```
To fix formatting errors and such, run:
Same as above but with `--fix` at the end.
## License
MIT
