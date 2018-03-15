* PR: Leave this empty at the moment.
* Issue: Related issue number. If there is no issue yet, please open one. You
  can claim it right away.

# Cause

An explanation of what is causing the performance degradation that you want to
improve. For example, "We are shipping source maps inlined in our javascript
bundle. This causes unnecessary bloat of our javascript bundle leading to bigger
loading and parsing times."

# Solution

An overview of how this can be avoided, preferably without specific
implementation details. For example, if your "Cause" is shipping source maps
right inside your javascript bundle, your "Solution" may be "Excluding source
maps from production bundle, this will minimize javascript bundle leading to
smaller loading and parsing times." and not "Changing
`cheap-module-eval-source-map` to `source-map` in your webpack config"

# Implementation

Here you should describe your "Solution" specific to this application. Looking
at the example above, our bad example becomes a good one! So your
"Implementation" could go like this "We will change
`cheap-module-eval-source-map` to `source-map` in our webpack config for
production build. That way we will get fast rebuilt times in development with
`cheap-module-eval-source-map` and a small javascript bundle and a separate
`.map` file with `source-map` in production."

# Drawbacks

If you see any drawbacks in your solution, please mention it here. Going further
with this source maps example, your drawbacks could be "Using `source-map` makes
our production build smaller"

# Related articles

Have some articles related to your solution? Something that provides more
context on the issue? Feel free to mention it in this section. For example:

* [Webpack devtool documentation][1]: description of different source mapping
  styles supported by Webpack with the comparison of build and rebuild times.

[1]: https://webpack.js.org/configuration/devtool/#devtool
