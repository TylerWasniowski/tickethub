# TBD PROJECT FRONTEND

[![Dependency Status](https://david-dm.org/vikr01/tbd-project-name/status.svg?path=packages/frontend)](https://david-dm.org/vikr01/tbd-project-name?path=packages/frontend)
[![DevDependency Status](https://david-dm.org/vikr01/tbd-project-name/dev-status.svg?path=packages/frontend)](https://david-dm.org/vikr01/tbd-project-name?path=packages/frontend&type=dev)

## Run in Development Mode

To start the development server, run:

```bash
yarn dev
```

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
export PORT=4000
```

In this case, the server will be launched on [port 4000](http://localhost:3000).

Alternatively, you can set your `PORT` environment variable in the `.env` file generated from [`.env.example`](./.env.example) after installation.

```bash
# .env file
PORT=4000
```
