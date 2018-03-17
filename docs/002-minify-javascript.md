* PR: https://github.com/gribnoysup/single-page-app-perf-tips/pull/4
* Issue: https://github.com/gribnoysup/single-page-app-perf-tips/issues/3

# Cause

Our application does a lot of stuff: there is routing, state management,
rendering, all the pages, and styles, etc. As a result, we are getting a pretty
big bundle at the moment that weights about ~1.4Mb. Big bundle size means that
browser is spending more time to download, parse and evaluate our code.

# Solution

One of the ways to minimize bundle size without a lot of effort is to minify our
code with some tool that knows how to remove all unnecessary pieces of the code
from the bundle.

# Implementation

We will add UglifyJS plugin to our webpack config. That way when webpack builds
our application, it will automatically minify our code with UglifyJS.

# Drawbacks

Our production build becomes much slower. Production code source becomes
unreadable.

# Related articles

* [UglifyJS website][1]
* [Webpack Documentation - UglifyjsWebpackPlugin][2]
* [Another amazing minification tool: Google Closure Compiler][3]

[1]: http://lisperator.net/uglifyjs/
[2]: https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
[3]: https://developers.google.com/closure/compiler/
