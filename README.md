# nodule-config

Opinionated configuration for Node applications


## Convention-Driven

Dependency injection (DI) is a good thing &trade; and [bottlejs](https://github.com/young-steveo/bottlejs) is a fine
DI framework. However, DI factory functions will usually need to access configuration from external sources (such as
environment variables and secret storage). Nodule is built on the premise that combining configuration with dependency
injection factories works best with strong conventions:

 -  Non-secret variables should be passed as environment variables
 -  Secrets should be loaded from secure storage
 -  Variables and secrets should be structured hierarchically, scoped by component name
 -  Components should declare their own defaults and should define factories that use their scoped configuration
 -  Factories should be aware of whether they are being used for unit testing and debugging

These conventions are shared by the [Python microcosm](https://github.com/globality-corp/microcosm) framework.


## Usage

### Application Initialization

Application initialization needs access to the DI framework, which in turn, needs access to information about
the application and configuration data.

`Nodule` uses a simple `Metadata` format to initialize applications:

        const metadata = {
            // the application's name is used to load configuration
            name: 'myappname',
            // factories may have different behavior during unit testing
            testing: true,
            // factories may have different behavior during local development
            debug: false,
        };

With this `Metadata`, `Nodule` can load configuration using loader functions:

        import { Nodule, loadFromEnvironment } from 'nodule-config';

        const nodule = new Nodule(metadata);
        nodule.from(loadFromEnvironment).load().then(bottle => myInitFunc(bottle));

Common loader functions also have shortcuts:

        nodule.fromEnvironment().load().then(bottle => myInitFunc(bottle));

These shortcuts can be chained to enable multiple loaders:

        nodule.fromEnvironment().fromCredstash().load().then(bottle => myInitFunc(bottle));

In the likely event that multiple loaders are used, `Nodule` will merge the loaders (and any defaults) in their
declaration order.


### Factory Registration

Applications and libraries need to define factories for injected components. `Nodule` uses a simple global registry
of `bottle` instances and exposes these via the `getInjector` function:

    import { getInjector } from 'nodule-config';

    getInjector().factory('foo', (container) => {
        // it's good practice to auto-mock "leaf" components during unit tests
        if (container.metadata.testing) {
            return () => 'value';
        }
        // it's great practice to use scoped configuration
        return () => container.config.foo.value;
    });

Since this pattern is so common, `Nodule` provides a `bind` shortcut:

    import { bind } from 'nodule-config';

    bind('foo', myFactoryFunc);

Configuration should typically have sane defaults (esp. for local development). `Nodule` enables configuration of
such defaults:

    import { setDefaults } from 'nodule-config';

    setDefaults('foo', {
        key: 'value',
    });


## Loaders

While `Nodule` defines several useful loaders out of the box, it does not presume to define every possible source
of configuration. Fortunately, loaders can be defined as *any* function that takes `Metadata` and returns a suitably
nested object:

    function myLoader(metadata) {
        return {
             key: 'value'
        };
    }

`Nodule` expectats that these nested objects map top-level keys to name used to bind factories and their injected
components to the DI container:

    {
        // configuration for the foo component
        foo: {
            enabled: true,
            password: 'very secure',
        },
        // configuration for the bar component
        bar: {
            password: 'super secret',
        },
    }

### Environment Variable Loading

Configuration via environment variables is incredibly common (and useful!). `Nodule` maps environment variables to
nested objects using the following rules:

  -  Only environment variables starting with the upper case value of `Metadata.name` are considered
  -  Each environment variable is split on double underscores (`__`) to create nesting (of arbitrary depth)

For example, the above example configuration could be loaded from:

    MYAPPNAME__FOO__ENABLED=true
    MYAPPNAME__FOO__PASSWORD="very secure"
    MYAPPNAME__BAR__PASSWORD="super secret"

Note that boolean values are coerced by default; this can be disabled.


### Credstash Loading

Configuration of secrets via environment variables is a bad (and insecure!) practice. One alternative is to load
secrets from AWS DynamoDB with KMS encryption using the [Credstash](https://github.com/fugue/credstash) library.
