* PR: https://github.com/gribnoysup/single-page-app-perf-tips/pull/8
* Issue: https://github.com/gribnoysup/single-page-app-perf-tips/issues/7

# Cause

The landing page of the application has a lovely background and an image of the
golden frame around heading. Both assets are big and not entirely compressed.

# Solution

There are a lot of different approaches to this problem. This release will focus
on the easiest one to implement: compression tools. The same way we are using
UglifyJs to minify our JavaScript, we can use tools to minify our images. Some
of these tools could even do this without quality loss.

# Implementation

We will use `ImageminWebpackPlugin` to minify our images automatically during
the build. We will use built-in `pngquant` to minify `*.png` images and
`mozjpeg` for `*.jpeg` images.

We will also do a lossy compression. It means that we will sacrifice image
quality a little for the better minification results. Be careful doing lossy
compression automatically; this may produce undesirable artifacts on the image.
Always check afterward if the image has not degraded too much. Or just go with
the lossless compression on the build step.

# Drawbacks

* Our production build will become slower.
* Our landing page images will lose their quality (hopefully unnoticeable to the
  client)
* Not a drawback, but something that should be mentioned: the only images that
  we have in our application are on our landing page, so implementing this
  optimization would affect only our landing page.

# Related articles

* [pngquant][1]
* [Mozilla Research - "Introducing the ‘mozjpeg’ Project"][2]
* [Imagemin Webpack Plugin][3]
* [Automated image optimization explained by Google Engineers][4]

[1]: https://pngquant.org/
[2]: https://research.mozilla.org/2014/03/05/introducing-the-mozjpeg-project/
[3]: https://github.com/Klathmon/imagemin-webpack-plugin
[4]: https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/image-optimization
