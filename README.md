# Globaly configuration for Node projects

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

We have a very specific convention for defining env variables. For example,
let's say out application name is XXX. We will define and env var like this:
`XXX__SOME_GROUP__SOME_VAR`. like: `XXX__LOGGING__LOGGLY_DOMAIN`.

This will become:

```
  logging: {
    enabled: true, // If one of the group vars is defined.
    loggly_domain: "the loggly domain defined in the env var value"
  }

```

## Usage
