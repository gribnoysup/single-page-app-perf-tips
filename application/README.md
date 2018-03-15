# Application

This is a shop application that allows you to browse through famous paintings
from Rijksmuseum collection and order a poster to bring a piece of world famous
art in your home. Product designer assumed that you will use this app mostly
from mobile device.

This application has four main parts:

* **Landing page.** Just your standard landing page. A few images here and
  there, some marketing texts and a call to action link.
* **Catalog.** User can browse available products here. Tap on a product to see
  available actions: "add to cart" or "go to the product description".
* **Product description.** You can read more about specific product here. You
  also can look at full image by clicking on image preview, add product to cart
  or go to checkout.
* **Cart.** Cart shows a list of products and allows user to clear cart or
  finish the order.

Every page also has header with navigation links to landing page, catalog and
cart and footer with additional info.

## Application structure

```
00-building-an-app <- You are here
├── __fixtures__
├── public
├── server
└── src
```

This three folders are the main part of our application. We will go through each
of them, going deeper if needed.

### \_\_fixtures\_\_

This folder contains all our server API "responses".

> **NOTE:** Instead of using real API, we will use JSON fixtures to get all
> data. This example app is focued on making your app code performant. Using
> fixtures instead of third-party API we can make our perf metrics more stable
> and not dependant on external services.

### public

```
public
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon.ico
└── index.html
```

Public folder contains index.html template and a few favicons in different
sizes.

### server

```
server
├── development.js
├── api.js
├── static.js
└── index.js
```

Server folder contains our server application. This is a simple express
application with several routers:

* development router uses `webpack-dev-middleware` to serve application assets
  in dev mode
* api router serves api responses
* static router serves application build in production
* index file combines everything together to the working server application

### src

```
src
├── assets
├── components
├── index.css
├── index.js
├── store
└── util.js
```

Source folder contains all application source files. Let's quickly go through
the files and folders.

#### index.js

This file is our main entry point for the application. Everything starts here:
router declaration, mounting to DOM, connection application to state.

#### index.css

Base, or you can say global, application styles that are not applied to specific
components, but to the whole application (e.g. html, body tags).

#### util.js

All constant and utility methods will be stored here.

#### assets

```
assets
├── gold-frame.png
├── icons
│   ├── close.svg
│   ├── commerce.svg
│   ├── favorite.svg
│   ├── home.svg
│   └── squares.svg
└── the-battle-of-waterloo.jpg
```

Assets folder is for images, icons, fonts and all the other stuff we usually
call assets for some reason. No suprises here. For now only a few icons and
landing page images are stored here.

#### components

```
components
├── Cart.css
├── Cart.js
├── Catalog.css
├── Catalog.js
├── Footer.css
├── Footer.js
├── Header.css
├── Header.js
├── ImagePreview.css
├── ImagePreview.js
├── Landing.css
├── Landing.js
├── Product.css
├── Product.js
└── common
    ├── Button.css
    ├── Button.js
    ├── Flex.css
    ├── Flex.js
    ├── LoadingIndicator.css
    └── LoadingIndicator.js
```

Component folder is also pretty explanatory. All application components are
here. They are almost 1 to 1 matching the main application pages: `Landing.js`
is the application landing page, `Cart.js` is the application cart page, etc.
The ones that are reused in several places are in the `common` folder.

#### store

```
store
├── cart.js
├── cartItems.js
├── catalog.js
├── product.js
└── root.js
```

Everything Redux-related is in this folder. `root.js` is out main reducer, that
combines all the other ones.

All other reducers are structured in the ducks pattern, that means that every
single file contains everything related to one domain: action types, action
creators, selectors, reducer and connect function.

## Build

To build application, install all application dependencies and then run
`npm run build`

## Start

To start production application server, build the application first and then run
`npm run start`

## Development

To start application in development mode, run `npm run dev` or
`npm run start -- --dev`
