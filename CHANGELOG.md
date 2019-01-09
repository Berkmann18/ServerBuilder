# [3.0.0](https://github.com/Berkmann18/ServerBuilder/compare/v2.2.0...v3.0.0) (2019-01-09)


### Breaking

* More async things and behaviour change ([034d628](https://github.com/Berkmann18/ServerBuilder/commit/034d628)), closes [#74](https://github.com/Berkmann18/ServerBuilder/issues/74)
* More async things and behaviour change ([0bd0e81](https://github.com/Berkmann18/ServerBuilder/commit/0bd0e81)), closes [#74](https://github.com/Berkmann18/ServerBuilder/issues/74)
* More async things and behaviour change ([797e7d9](https://github.com/Berkmann18/ServerBuilder/commit/797e7d9)), closes [#74](https://github.com/Berkmann18/ServerBuilder/issues/74)
* More async things and behaviour change ([1f58169](https://github.com/Berkmann18/ServerBuilder/commit/1f58169)), closes [#74](https://github.com/Berkmann18/ServerBuilder/issues/74)


### BREAKING CHANGES

* `Server.restart` -> `Server.run` which is now no longer ran from
`Server.constructor` unless the `opts.autoRun = true` is applicable in the arguments of the
constructor. `Server.run` now is asynchronous, so is the public IP fetching process that got
slightly moved out of the module.
* `Server.restart` -> `Server.run` which is now no longer ran from
`Server.constructor` unless the `opts.autoRun = true` is applicable in the arguments of the
constructor. `Server.run` now is asynchronous, so is the public IP fetching process that got
slightly moved out of the module.
* `Server.restart` -> `Server.run` which is now no longer ran from
`Server.constructor` unless the `opts.autoRun = true` is applicable in the arguments of the
constructor. `Server.run` now is asynchronous, so is the public IP fetching process that got
slightly moved out of the module.
* `Server.restart` -> `Server.run` which is now no longer ran from
`Server.constructor` unless the `opts.autoRun = true` is applicable in the arguments of the
constructor. `Server.run` now is asynchronous, so is the public IP fetching process that got
slightly moved out of the module.

# [2.2.0](https://github.com/Berkmann18/ServerBuilder/compare/v2.1.0...v2.2.0) (2019-01-02)

# [2.1.0](https://github.com/Berkmann18/ServerBuilder/compare/v2.0.0...v2.1.0) (2018-12-14)


### Bug Fixes

* example/secure/package.json to reduce vulnerabilities ([af94d08](https://github.com/Berkmann18/ServerBuilder/commit/af94d08))
* example/simple/package.json to reduce vulnerabilities ([a272dc2](https://github.com/Berkmann18/ServerBuilder/commit/a272dc2))

## [2.0.1](https://github.com/Berkmann18/ServerBuilder/compare/v2.0.0...v2.0.1) (2018-11-30)


### Docs

* Added HTTP/2 example ([9d17c566d5cbd2db0c9ba7944f760de8b55e5c7d](https://github.com/Berkmann18/ServerBuilder/commit/9d17c566d5cbd2db0c9ba7944f760de8b55e5c7d)), closes [#38](https://github.com/Berkmann18/ServerBuilder/issues/38) [#39](https://github.com/Berkmann18/ServerBuilder/issues/39)

### fix

* example/secure/package.json to reduce vulnerabilities ([af94d08d62724d189f3216a021b2e2d45720121e](https://github.com/Berkmann18/ServerBuilder/commit/af94d08d62724d189f3216a021b2e2d45720121e))
* example/simple/package.json to reduce vulnerabilities ([a272dc22b6cdcc75d3d6bdad8a53a8b6044dc757](https://github.com/Berkmann18/ServerBuilder/commit/a272dc22b6cdcc75d3d6bdad8a53a8b6044dc757))

### Fix

* Package lock fix ([483ec12322cfb439926bdd66cd89af66fce1eaa5](https://github.com/Berkmann18/ServerBuilder/commit/483ec12322cfb439926bdd66cd89af66fce1eaa5))

### Update

* Updated the package lock ([02050fd157d6793c2b087ebde12977ec8f903ff0](https://github.com/Berkmann18/ServerBuilder/commit/02050fd157d6793c2b087ebde12977ec8f903ff0))
* Updated the package lock ([11ac567a9620f390e4efc52209b79db9f2d2dd9a](https://github.com/Berkmann18/ServerBuilder/commit/11ac567a9620f390e4efc52209b79db9f2d2dd9a))



# [2.0.0](https://github.com/Berkmann18/ServerBuilder/compare/e3fe6040da294f18429d4445a3a532606fd39eac...2.0.0) (2018-11-16)


### Build

* A variety of changes ([8514d0a9f717405d596b9ccdf3005b0543cef848](https://github.com/Berkmann18/ServerBuilder/commit/8514d0a9f717405d596b9ccdf3005b0543cef848)), closes [#15](https://github.com/Berkmann18/ServerBuilder/issues/15)
* Added a .md linter and more ([da4af471cec7cc2f68a6348aa5c0ef44eb60e568](https://github.com/Berkmann18/ServerBuilder/commit/da4af471cec7cc2f68a6348aa5c0ef44eb60e568))
* Added git hooks for linting .js/.md ([0f0f39faa640315a1051cccfad9657b09aaa9ac7](https://github.com/Berkmann18/ServerBuilder/commit/0f0f39faa640315a1051cccfad9657b09aaa9ac7))

### Chore

* Release 2.0.0 :tada: ([679f10cd7f76b8700dd3ee50041fd87d28066aa1](https://github.com/Berkmann18/ServerBuilder/commit/679f10cd7f76b8700dd3ee50041fd87d28066aa1))

### Docs

* Tweaked README and fixed lint errors on various `.md` files ([0de83142599435a2df65cfac909ba9475d2cf14f](https://github.com/Berkmann18/ServerBuilder/commit/0de83142599435a2df65cfac909ba9475d2cf14f))
* Updated the documentation ([22083f609cc0ed73ca324832390eeb762b688279](https://github.com/Berkmann18/ServerBuilder/commit/22083f609cc0ed73ca324832390eeb762b688279))

### New

* Added HTTP/2 ([b64b3cd6e8af85d25646482c237ed7fa4d24b85c](https://github.com/Berkmann18/ServerBuilder/commit/b64b3cd6e8af85d25646482c237ed7fa4d24b85c)), closes [#13](https://github.com/Berkmann18/ServerBuilder/issues/13)

### Update

* Removed/uncommented some LOCs ([dde03e98bb9cb3e43a21818b26d320ec22b105a9](https://github.com/Berkmann18/ServerBuilder/commit/dde03e98bb9cb3e43a21818b26d320ec22b105a9))

### Upgrade

* Overall update ([e3fe6040da294f18429d4445a3a532606fd39eac](https://github.com/Berkmann18/ServerBuilder/commit/e3fe6040da294f18429d4445a3a532606fd39eac))
