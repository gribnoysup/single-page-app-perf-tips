* PR: https://github.com/gribnoysup/single-page-app-perf-tips/pull/12
* Issue: https://github.com/gribnoysup/single-page-app-perf-tips/issues/11

# Cause

Our application assets are still pretty big. And that as always affects loading,
parsing and evaluating/rendering times for almost everything that we are sending
from the server. Sometimes there is not that much you can do regarding removing
parts of the application, so we need to consider some other approach.

# Solution

We can apply compression to any response that we are sending from our server.
There are two popular compression algorithms that browsers can understand today:
GZip and Brotli. Browsers will tell you what compression algorithms they support
with Accept-Encoding header. The only thing we need to do is to prepare our
setup for that.

# Implementation

First of all, we will change our production build to produce a compressed
version of every JS, CSS and HTML file. We will use Compression Webpack Plugin
for that. Instead of using built-in compression libraries, we will use Zopfli
for GZip compression, and Iltorb for Brotli compression. Because we are doing
this in the build step, we will crank up the compression quality, sacrificing
the build time.

Then we will create a simple middleware for Express.js that will help us to send
compressed assets if they are available in our build and fallback to original,
uncompressed file if there is no compressed version.

Almost done! We still have some dynamic content that we are sending from the
server – API responses. As we can't compress them before starting the
application due to their dynamic nature, so we will use express.js compression
middleware to encode them on the fly.

# Drawbacks

* Production build time will increase significantly
* Keep in mind that although this optimization reduces the file size minimizing
  load time, parsing time would be higher, because now a browser need to decode
  the compressed file and evaluate/render time would not be affected at all
* In some cases, compression could make file size even larger

Always check and measure your optimizations before applying them to production.

# Related articles

* [Optimizing Encoding and Transfer Size of Text-Based Assets][1]
* [MDN web docs - Content-Encoding][2]
* [MDN web docs - Compression in HTTP][3]
* [Wikipedia – GZip][4]
* [Wikipedia – Zopfli][4.1]
* [Wikipedia – Brotli][5]
* [Compression Webpack Plugin][6]
* [node-zopfli – Node.js bindings for Zopfli compression library][7]
* [iltorb – Node.js bindings for the brotli compression library][8]
* [compress – Node.js compression middleware][9]

[1]: https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer
[2]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
[3]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Compression
[4]: https://en.wikipedia.org/wiki/Gzip
[4.1]: https://en.wikipedia.org/wiki/Zopfli
[5]: https://en.wikipedia.org/wiki/Brotli
[6]: https://github.com/webpack-contrib/compression-webpack-plugin
[7]: https://github.com/pierreinglebert/node-zopfli
[8]: https://github.com/MayhemYDG/iltorb
[9]: https://github.com/expressjs/compression
