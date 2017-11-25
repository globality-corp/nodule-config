# Opinionated configuration for Node projects

[![CircleCI](https://circleci.com/gh/globality-corp/nodule-config/tree/master.svg?style=svg)](https://circleci.com/gh/globality-corp/nodule-config/tree/master)

We have a few Node based projects at [Globality](https://www.globality.com).
Those Node projects have some configuration that is being loaded from ENV
variables and some loading from credstash (secrets).

The purpose of this global configuration layer is to have a way to load the
configuration dynamically from the ENV variables and only load secrets if we
need them.

For example, in local dev we don't want any secrets to load from credstash
because we don't want to have the AWS secrets floating around and complicating
dev environments.

Also, right now the configuration layer is too verbose, this introduces a bit
of magic like we have in [microcosm](https://l), our python library

## Basics

For the configuration layer to work, you need the `NAME` env var present. The
library will warn you if you don't have it defined.

The module will look for all the env variables prefixed with the app name and
compile a list out of all of them, if you require secrets, it will get merged.

### Before

```
  YOURAPPNAME__GROUP__VAR: 'X',
  YOURAPPNAME__VAR: 'Y',
  YOURAPPNAME__BOOL_VAR_FALSE: false,
  YOURAPPNAME__BOOL_VAR_TRUE: true,
  YOURAPPNAME__BOOL_VAR_FALSE_LITERAL: false,
  YOURAPPNAME__BOOL_VAR_TRUE_LITERAL: true,
  YOURAPPNAME__BOOL_VAR_FALSE_LITERAL_D: false,
  YOURAPPNAME__BOOL_VAR_TRUE_LITERAL_D: true,
  SECRET_VAR: 'SECRET_VALUE' // automatically loads from credstash if required
```

### After

```
{ 
  group: { 
    var: 'X'  
  },
  var: 'Y',
  boolVarFalse: false,
  boolVarTrue: true,
  boolVarFalseLiteral: false,
  boolVarTrueLiteral: true,
  boolVarFalseLiteralD:
  false,
  boolVarTrueLiteralD:
  true,
  secretVar: 'SECRET_VALUE'
}
```
## Usage

### Config

The module has 2 configuration options

1. `secretLoaderPrefix` Defaults to `MICROCOSM`

`secretLoaderPrefix` is used in order to get the `version` and the `env` to
look for in credstash. (see `secretLoader`).

Say your `secretLoaderPrefix` is `MICROCOSM`, it will look for the env and
version in the env vars using this code

```
  const version = process.env[`${this.secretLoaderPrefix}_CONFIG_VERSION`];
  const env = process.env[`${this.secretLoaderPrefix}_ENV`];
```

Note: The code above is internal implementation, you don't need it in your app.


2. `parseBooleans` Defaults to `true`

Env vars are string by default, if you want the JS object to have the native
boolean value, you pass true in this var.

This will make `1`, `0`, `true`, `True`, `false` and `False` to "translate" to
booleans. If this is false, you will get the string values and need to handle
it in your application

### Load configuration

```
import { makeConfig, Loader } from "nodule-config";

const loader = new Loader() // pass config as vars here if you need to

loader.toCombinedObject().then((configVars) => {
  const config = makeConfig(vars);

  // Do what you want with your configuratin
})
```

