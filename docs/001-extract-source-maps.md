* PR: Leave this empty at the moment.
* Issue: #1

# Cause

As the issue states, we are inlining source maps right in our bundle. Although
this provides a good developer experience, minimizing the rebuild time in
development, it makes js application bundle much bigger. And the bigger your
javascript file, the more time it takes to download, parse and compile it.

# Solution

In general, you should avoid serving developer only parts of your application in
production, and source maps are precisely this. If you still want to have source
map support in production, you should at least use one of the source map types
that plays nicely with the production environment, in other words, does not make
your bundle size bigger.

# Implementation

We will do it in two steps:

1.  Separate out development and production webpack configurations
2.  Switch `devtool` to `source-map` in production webpack configuration

That way we will still get the benefit of using source maps in production, but
now they will be in a separate file. Also separating configurations will allow
us to change production configuration without messing with our development
environment.

# Drawbacks

Using extracted source maps will slow down our build. The good part that this
affects only production environment and we probably can afford this slowdown,
compared to the benefits.

# Related articles

* [Debuggable JavaScript in production with Source Maps][1]
* [Webpack Documentation - Devtool][2]

[1]: https://blog.sentry.io/2015/10/29/debuggable-javascript-with-source-maps
[2]: https://webpack.js.org/configuration/devtool/#devtool
