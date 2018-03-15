# Single page application optimization tips

This repository is a collection of optimization tips for single page
applications. First of all, we will build a little web shop app, and then we
will gradually improve it focusing on first load metrics.

This specific application is built with Webpack, React and Redux, but the
general bits of advice could be applied to many other web applications. Find the
one that suits your setup!

This is the structure of this repository:

```
. <- You are here
├── application
├── docs
├── sandbox
├── tools
└── README.md
```

Let's have a quick overview.

## Application

This sandbox is all about optimizing our web shop application. You can find the
most current version of the application in the [`application`][1.0] folder. This
is a small-ish React application, where the state is managed with Redux, routing
is handled with React-Router and build process is handled with Webpack. So a
pretty basic one by today's standards.

### application/README.md

You can find a more thorough description of this application in the application
[`README.md`][1.1]

### application/metrics.json

Inside the application folder, you can also find [`metrics.json`][1.2] that
contains data from a median lighthouse test run for every page of the app.

To gather these metrics we are doing three runs of [`lighthouse`][1.3], using
[`pwmetrics`][1.4] lighthouse config as a base. Our only change to this config
is modified event timeouts. That way we get a more precise recording of the
collected timings.

Below is a list of timings we are collecting with the help of lighthouse:

* First Contentful Paint
* First Meaningful Paint
* Perceptual Speed Index
* First Visual Change
* Visually Complete 85%
* Visually Complete 100%
* First Interactive (vBeta)
* Time to Consistently Interactive (vBeta)

## Docs

Without describing what we've done to improve page performance, this repo would
hardly be useful, right? This is why we have [`docs`][2.0] folder! For each
[`release`][2.1] we publish, we will have a description of the **cause** of the
performance hit, **what** and **why** will be done to improve it and **how** it
will be implemented in this application.

Don't rush to copy-paste the solution! Your setup is probably a little bit
different, but hopefully you can get an understanding of possible performance
bottlenecks and an idea of how to solve them.

## Sandbox

Have you ever wanted to travel back in time? With the help of our [Tools][3.0]
you can do it inside the `sandbox` folder! Tools will allow you to check out
every release of the application to the `sanbox/<release-version>`. After that
you can browse the code, build or run the application. If you feeling
adventurous enough, you can even try to deploy the application yourself!

## Tools

Checking out specific release version to look at the code or running performance
tests manually is boring and tedious, this is why this repo comes with a set of
tools that will allow you to do various things with every application version
available!

Let's go through the commands that will hopefully allow you to play around in
this repository in an easy and fun way:

### Update

This command will check if there are any new releases available in the origin
and will ask you if you want to fetch them.

```
npm run update
```

(if you really not a big fan of npm scripts for some reason you can just
`git fetch` in the repository folder)

### Fetch

This command will clone selected releases into the `sandbox/<release-version>`
folder. When it is done, you are ready to explore application!

You can use `--overwrite` flag to remove selected release before fetching it
again from the origin.

```
npm run fetch -- --override
```

### Build

This command will install application dependencies and build an application for
the selected releases.

```
npm run build
```

### Start

This command will start the application server. If the application is not built
of fetched, this commands will be done before starting the server.

You can use `--dev` flag to start the application in the development mode.

```
npm run start -- --dev
```

### Clear

This command removes selected applications `build` and `node_modules` folders.
Useful to prepare an app for a clean build.

```
npm run clear
```

### Measure

This command will bootstrap selected applications (with the help of `build` and
`start` tools), start headless chrome and do several runs of lighthouse
measurement tool for every route. After that, the command will write (or update)
[`metrics.json`][1.2] file with new values and ask you if you want to see the
results in your terminal.

You can use `--skipResults` flag to skip results prompt completely. Useful when
you want to run tests for several applications and don't want to pause this
process.

```
npm run measure -- --skipResults
```

### Print metrics

This command will print application performance metrics that are stored with
every release in [`metrics.json`][1.2] file. After running this command you will
see a nice bar chart with collected metrics for every route.

```
npm run print-metrics
```

## Contributing

If you have an idea for application performance improvement or you found a the
bottleneck that wasn't dealt with before we will be glad to hear about it!

### Issues

The easiest way to share your knowledge would be to create an issue. Describe
your findings in the issue, a few timings or pictures would be a good addition,
if applicable.

If you already have a solution in mind, feel free to add it to the ticket! A
small description of **why** your solution will resolve the issue and **how** it
can be approached would be very helpful.

Keep in mind that we are trying to go with our optimizations in small, gradual
steps, so if you have a big thing in mind or several suggestions, maybe it is a
good idea to split them into several issues.

### Pull Requests

Want to handle one of the performance issues yourself? Great!

First of all, mention this in the issue. Then fork repository, clone it to your
local machine, install project dependencies and you are good to go!

Start by creating the new [`docs`][2.0] section from a template. Copy
`docs/000-template.md` to `docs/000-my-perf-improvement.md` (where
`my-perf-improvement` is descriptive). Don't assign a number yet. Try to fill
out as many points mentioned in the template as possible. This whole sandbox is
about providing people with a good documentation, so the better your
documentation, the more chances there are that it will be merged.

> Want to gather feedback right away before implementing? Submit a PR and ask
> for feedback.

After that, you can start working on your performance improvements. Please make
**meaningful commits** and **commit messages**. Keep in mind that people could
browse those to understand how your solution was implemented.

When you are finished, don't forget to update performance metrics for current
application! The easiest way to do it is to run [`npm run measure`][4.0] for the
current project in the root of this repository.

If you see some metrics going down, do not worry ahead of time!

* There is always space for measurement error, you should expect 2-3% errors for
  metrics that weren't affected by your optimization.
* Some optimizations could improve one part of the application, and downgrade
  others. Web development contains a lot of areas where you have to sacrifice
  one thing to improve another. Don't be afraid to submit it, we will look at
  this together!

At this point, you should be completely ready to submit a PR. When it passes the
review process, you will change `docs` number to an appropriate one, your PR
will be merged to master and will be released with the same name as the
documentation file.

## Questions?

Have any questions left about performance improvements? Feel free to ask in the
related isssue or PR, they should be mentioned in documentation.

Encounter a bug or have any other questions? Open a new issue!

## License

[MIT][5.0]

[1.0]: ./application
[1.1]: ./application/README.md
[1.2]: ./application/metrics.json
[1.3]: https://github.com/GoogleChrome/lighthouse
[1.4]: https://github.com/paulirish/pwmetrics
[2.0]: ./docs
[2.1]: ./releases
[3.0]: #tools
[4.0]: #measure
[5.0]: ./LICENSE
