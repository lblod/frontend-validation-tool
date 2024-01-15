# Validation Monitoring Tool

Concept for a tool to validate publications for harvesting.
When multiple publishers are publishing data to a triple store, this tool can be used to validate the data against a blueprint of said data.

A publication can have several requirements in order to make structural sense. These are the type of requirements that can be checked by this tool:

1. **Document Type**: This can be one of the following:

   - `besluit`
   - `notulenlijst`

2. **Title**: Each publication must have a title. The title should be a string.

## NPM Package

In order for the functionality of this tool to be used by other instances, an NPM package was created. This does mean that when developing this tool, you will have to clone the NPM package as well, and link it to the main project.

To make this easier, a script was created that will do this for you. Run the following command in the root of the project:

```bash
sh ./initProject.sh
```

In order for the changes made in the NPM package to be reflected in the main project, you will have to run the following command in the root of the NPM package:

```bash
npm run watch-module
```

## Ember Frontend

### Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)

### Installation

- `git clone git@github.com:lblod/validation-monitoring-tool.git`
- `cd validation-monitoring-tool`
- `npm install`

### Running / Development

- `npm run dev:proxy:local` [(with local proxy)](#local-proxy)
- `npm run dev:proxy` [(with remote proxy)](#linked-data-proxy)

## Proxy

<h3 id="local-proxy">Local Proxy</h3>

To increase the performance, we created an HTTP proxy that sets the Cache-Control header to immutable for every publication. Run following commands in a separate terminal to setup the proxy on `localhost:8080`:

```bash
npm run init:proxy
```

Then run the ember frontend with the following command:

```bash
npm run dev:proxy:local
```

<h3 id="linked-data-proxy">Linked Data Fragment Proxy</h3>

To run the application with the remote [Linked Data Fragments proxy](https://linkeddatafragments.org/) you can just run the ember frontend with the following command:

```bash
npm run dev:proxy
```

## Link traversal client

The browser-build version of Comunica link traversal must be added as Javascript file in the index.html.
If you want to adapt to another Comunica config, build an engine with your config + webpack to a browser js:
https://github.com/brechtvdv/comunica-feature-link-traversal/commit/c42d57e6d9328de962de66f28413660454319efe
