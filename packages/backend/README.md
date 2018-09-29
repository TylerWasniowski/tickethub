# TBD PROJECT BACKEND

[![Dependency Status](https://david-dm.org/vikr01/tbd-project-name/status.svg?path=packages/backend)](https://david-dm.org/vikr01/tbd-project-name?path=packages/backend)
[![DevDependency Status](https://david-dm.org/vikr01/tbd-project-name/dev-status.svg?path=packages/backend)](https://david-dm.org/vikr01/tbd-project-name?path=packages/backend&type=dev)

## Run in Development Mode

To start the development server, run:

```bash
yarn dev
```

By default, the development server will be launched on [port 2000](http://localhost:2000).

## Run in Production Mode

First build the package by running:

```bash
yarn build
```

Then start the application in production by running:

```bash
yarn start
```

## Choosing a specific port

To specify a port, set an environment variable `PORT` first:

```bash
export PORT=3000
```

In this case, the server will be launched on [port 3000](http://localhost:3000).

Alternatively, you can set your `PORT` environment variable in the `.env` file generated from [`.env.example`](./.env.example) after installation.

```bash
# .env file
PORT=3000
```
