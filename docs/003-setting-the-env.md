* PR:
* Issue: https://github.com/gribnoysup/single-page-app-perf-tips/issues/5

# Cause

Libraries like React are well known for the exceptional developer experience.
These benefits come at the cost of including a lot of development-only code in
the bundle: detailed error messages, helpful warnings, additional checks, etc.
That means that by default we are shipping all this code to our clients, and
they don't need it at all.

# Solution

To help avoid these parts of code in production environment we can use
environmental variables. In JavaScript, a commonly used variable for this is
`process.env.NODE_ENV`. A lot of libraries are taking advantage of this shared
variable to exclude development-only parts of code:

```js
function awesomeLibrary() {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      "Hey, developer! Awesome Library is deprecated, sorry :'( Use The Blazing Fast library instead"
    );
  }

  // ... do library stuff
}
```

The only thing we need to do is to somehow provide our application with this
variable.

# Implementation

The implementation will be pretty easy; we will use `DefinePlugin` for Webpack
to set `NODE_ENV` to `production` in production config, and to `development` in
development config. That way all code in our application that looks like this:

```js
if (process.env.NODE_ENV !== 'production') {
  // development-only code
}
```

Will look like this after transformation:

```js
if ('production' !== 'production') {
  // development-only code
}
```

The best part about the code above is that now this code is always unreachable
in a production environment and minification tools like UglifyJs that we are
already using can understand that and remove this code from the application
bundle completely.

We will also change our server to work in development mode based on `NODE_ENV`
value and not on `--dev` flag to make environment definition more consistent
across the application.

# Drawbacks

Not a lot of those. Just keep in mind that your application now works
differently in development and production environment, don't forget to check
that everything is functioning correctly in both.

# Related articles

* [How React defines development-only code][1]
* [Webpack documentation - DefinePlugin][2]
* [Webpack documentation - EnvironmentPlugin][3]

[1]: https://reactjs.org/docs/codebase-overview.html#development-and-production
[2]: https://webpack.js.org/plugins/define-plugin/
[3]: https://webpack.js.org/plugins/environment-plugin/
