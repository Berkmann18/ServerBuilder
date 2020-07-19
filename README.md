# ServerBuilder
[![NPM](https://nodei.co/npm/serverbuilder.png)](https://nodei.co/npm/serverbuilder/)
[![Inline docs](http://inch-ci.org/github/Berkmann18/ServerBuilder.svg?branch=master)](http://inch-ci.org/github/Berkmann18/ServerBuilder)
<!-- [![NSP Status](https://nodesecurity.io/orgs/berkmann18/projects/ea369eec-8c46-4ad6-903c-739aa66d006a/badge)](https://nodesecurity.io/orgs/berkmann18/projects/ea369eec-8c46-4ad6-903c-739aa66d006a) -->

[![devDependencies Status](https://david-dm.org/Berkmann18/ServerBuilder/dev-status.svg)](https://david-dm.org/Berkmann18/ServerBuilder?type=dev)
[![dependencies Status](https://david-dm.org/Berkmann18/ServerBuilder/status.svg)](https://david-dm.org/Berkmann18/ServerBuilder)

[![GH Downloads](https://img.shields.io/github/downloads/Berkmann18/ServerBuilder/total.svg)](https://github.com/Berkmann18/ServerBuilder/network/members)
[![GitHub commit activity the past year](https://img.shields.io/github/commit-activity/y/Berkmann18/serverbuilder.svg)](https://github.com/Berkmann18/ServerBuilder/graphs/commit-activity)
[![GitHub contributors](https://img.shields.io/github/contributors/Berkmann18/ServerBuilder.svg)](https://github.com/Berkmann18/ServerBuilder/graphs/contributors)
[![Github search hit counter](https://img.shields.io/github/search/Berkmann18/ServerBuilder/goto.svg)](https://github.com/Berkmann18/ServerBuilder/graphs/traffic)

[![Build Status](https://travis-ci.org/Berkmann18/ServerBuilder.svg?branch=master)](https://travis-ci.org/Berkmann18/ServerBuilder)
[![codecov.io Code Coverage](https://img.shields.io/codecov/c/github/Berkmann18/ServerBuilder.svg?maxAge=2592000)](https://codecov.io/github/Berkmann18/ServerBuilder?branch=master)
[![mocha](https://rawcdn.githack.com/aleen42/badges/11e00955d8be26223f0b89dddf49bc4a81e059ba/src/mocha.svg)](https://aleen42.github.io/badges/src/mocha.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/Berkmann18/ServerBuilder/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Berkmann18/ServerBuilder?targetFile=package.json)

[![GitHub](https://img.shields.io/github/license/Berkmann18/ServerBuilder.svg)](https://github.com/Berkmann18/ServerBuilder/blob/master/LICENSE)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Berkmann18/ServerBuilder/issues)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&identifier=115825259)](https://dependabot.com)

[![GitHub top language](https://img.shields.io/github/languages/top/Berkmann18/ServerBuilder.svg)](https://github.com/Berkmann18/ServerBuilder)
[![GitHub language count](https://img.shields.io/github/languages/count/Berkmann18/ServerBuilder.svg)](https://github.com/Berkmann18/ServerBuilder)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Berkmann18/ServerBuilder.svg)](https://github.com/Berkmann18/ServerBuilder)


[![BCH compliance](https://bettercodehub.com/edge/badge/Berkmann18/ServerBuilder?branch=master)](https://bettercodehub.com/results/Berkmann18/ServerBuilder)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/40e42558e9ad4f54a014f063aa48817c)](https://www.codacy.com/app/maxieberkmann/ServerBuilder?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Berkmann18/ServerBuilder&amp;utm_campaign=Badge_Grade)

It's a simple NodeJS/Express server builder allowing you to get a working server up in just a few lines.

## Install
To install it you need to run the following:
```cli
npm i serverbuilder
```

_Note_: Don't forget to use `-g`, `--save`, `--save-dev` if appropriate.

## Usage
-   Using **HTTP/1**:
```js
const app = require('express')(),
      Server = require('serverbuilder');
const options = {
  name: 'My Server',
  publicIP: true
};

const server = new Server(app, process.env.PORT || 3e3, options);
server
  .run()
  .then(serv => app.set('port', serv.port), console.error);
```
-   Or with **HTTPS/1**:
```js
const fs = require('fs'),
      app = require('express')(),
      Server = require('serverbuilder');

const options = {
  name: 'My Server',
  useHttps: true,
  securityOptions: {
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-cert.pem')
  },
  publicIP: true
};

const server = new Server(app, process.env.PORT || 3e3, options);
server
  .run()
  .then(serv => app.set('port', serv.port), console.error);
```

-   Or with **HTTP/2**:
```js
const fs = require('fs'),
      app = require('express')(),
      Server = require('serverbuilder');

const options = {
  name: 'My Server',
  useHttp2: true,
  securityOptions: {
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-cert.pem')
  },
  publicIP: true
};

const server = new Server(app, process.env.PORT || 3e3, options);
server
  .run()
  .then(serv => app.set('port', serv.port), console.error);
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
Fore more details, please check [the contribution guideline](./github/CONTRIBUTING.md).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://maxcubing.wordpress.com"><img src="https://avatars0.githubusercontent.com/u/8260834?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Maximilian Berkmann</b></sub></a><br /><a href="https://github.com/Berkmann18/ServerBuilder/issues?q=author%3ABerkmann18" title="Bug reports">🐛</a> <a href="https://github.com/Berkmann18/ServerBuilder/commits?author=Berkmann18" title="Code">💻</a> <a href="https://github.com/Berkmann18/ServerBuilder/commits?author=Berkmann18" title="Documentation">📖</a> <a href="#ideas-Berkmann18" title="Ideas, Planning, & Feedback">🤔</a> <a href="#question-Berkmann18" title="Answering Questions">💬</a> <a href="https://github.com/Berkmann18/ServerBuilder/pulls?q=is%3Apr+reviewed-by%3ABerkmann18" title="Reviewed Pull Requests">👀</a> <a href="#security-Berkmann18" title="Security">🛡️</a> <a href="https://github.com/Berkmann18/ServerBuilder/commits?author=Berkmann18" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://dependabot.com"><img src="https://avatars2.githubusercontent.com/u/36207117?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dependabot</b></sub></a><br /><a href="#tool-dependabot-bot" title="Tools">🔧</a> <a href="#security-dependabot-bot" title="Security">🛡️</a></td>
    <td align="center"><a href="http://semantic-release.org/"><img src="https://avatars1.githubusercontent.com/u/32174276?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Semantic Release Bot</b></sub></a><br /><a href="https://github.com/Berkmann18/ServerBuilder/commits?author=semantic-release-bot" title="Documentation">📖</a> <a href="#platform-semantic-release-bot" title="Packaging/porting to new platform">📦</a></td>
    <td align="center"><a href="https://snyk.io"><img src="https://avatars2.githubusercontent.com/u/19733683?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Snyk bot</b></sub></a><br /><a href="#security-snyk-bot" title="Security">🛡️</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!


## License
MIT
