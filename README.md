# TBD PROJECT NAME

[![Dependency Status](https://david-dm.org/vikr01/tbd-project-name/status.svg)](https://david-dm.org/vikr01/tbd-project-name)
[![DevDependency Status](https://david-dm.org/vikr01/tbd-project-name/dev-status.svg)](https://david-dm.org/vikr01/tbd-project-name?type=dev)

## Installation

First, clone the repo via git:

```bash
git clone --depth=1 https://github.com/vikr01/tbd-project-name.git your-project-name
```

And then install dependencies with yarn:

```bash
cd your-project-name
yarn install
```

## Run in Development Mode

It is recommended to run the backend and frontend in separate terminal sessions.

See [the instructions in the frontend package](./packages/frontend#tbd-project-frontend) for starting the frontend.

See [the instructions in the backend package](./packages/backend#tbd-project-backend) for starting the backend.

If you would rather run both frontend and backend in a single terminal session, you can run:

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
