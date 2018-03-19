* PR: Leave this empty at the moment.
* Issue: https://github.com/gribnoysup/single-page-app-perf-tips/issues/9

# Cause

We are sending unresized, ultra high-quality images to the browser both for
landing pages and for the product related pages. That affects our visually
complete metrics because the images are just taking too much time to load and
also our first interactive/consistently interactive metrics because browser
spends a lot of CPU power to render this images on the screen.

# Solution

To solve the issue, we will adopt a "responsive images" approach in our
application. What does that mean? Based on the client screen width and pixel
density, we will send different assets to the client. That way people with the
small mobile phones could get our content quicker and people with giant hi-res
screens would still enjoy our website with good quality images.

# Implementation

First of all, we will cut our golden frame image in half. For me, the idea of
responsive images is in serving to the client only content that is needed, not
only based on the screen sizes but in general, depending what could be seen on
the screen. That golden frame image almost always takes only half of the screen,
so there is no point in sending the whole image to the client.

Then we will prepare our landing page assets in different sizes, and we will use
CSS media queries to define what images we need to load based on device pixel
ratio. To avoid spending time resizing image assets manually, we will use
`responsive-loader` for Webpack to do it for us.

As for our API, we are pretty lucky here because images are stored in the Google
CDN, that has a built-in feature to get resized images just by adding a special
string at the end of the URL. That is not something that applies to most
applications. Just keep in mind that if you are using some CMS to serve your
images, it would be a good idea to support image resizing.

# Drawbacks

* Production build becomes slower because of the new loader
* CSS becomes more complicated for static images. Now you need to keep all your
  breakpoints in mind when adding new images.

# Related articles

* [MDN web docs - Responsive images][1]
* [The 100% correct way to do CSS breakpoints][2]
* [CSS-Tricks - Responsive images in CSS][3]
* [CSS-Tricks - Responsive Images: If you’re just changing resolutions, use
  srcset][4]
* [A List Apart - Responsive Images in Practice][5]
* [Responsive Loader for Webpack][6]

[1]: https://developer.mozilla.org/en-us/docs/learn/html/multimedia_and_embedding/responsive_images
[2]: https://medium.freecodecamp.org/the-100-correct-way-to-do-css-breakpoints-88d6a5ba1862
[3]: https://css-tricks.com/responsive-images-css/
[4]: https://css-tricks.com/responsive-images-youre-just-changing-resolutions-use-srcset/
[5]: https://alistapart.com/article/responsive-images-in-practice
[6]: https://github.com/herrstucki/responsive-loader/
