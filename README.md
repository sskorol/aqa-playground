## AQA Playground

:mortar_board: The AQA Playground is a comprehensive testbed designed primarily for passionate SDETs to practice their skills in a real-world scenario.

:fire: Integrating PostgreSQL, NestJS / Swagger / JWT Auth, React, Docker, and Stripe, this project simulates a full-fledged application ecosystem, providing a hands-on experience for frontend and backend testing activities. 

<video src="https://github.com/sskorol/aqa-playground/assets/6638780/887f3b92-4558-4ffe-a35b-127037bfb73a"></video>

### Table of Contents
1. [Installation](#installation)
    - [NodeJS](#nodejs)
    - [Docker](#docker)
    - [Stripe Payments](#stripe-payments)
    - [Source Code](#source-code)
    - [Environment Variables](#environment-variables)
      - [Frontend Config](#frontend-config)
      - [Backend Config](#backend-config)
    - [Database](#database)
2. [Docker](#docker-1)
    - [Partial mode](#partial-mode)
    - [Full deployment](#full-deployment)
3. [Running](#running)
    - [Dev Mode](#dev-mode)
    - [Prod Mode](#prod-mode)
    - [Operating](#operating)
4. [Tests](#tests)
5. [Credits](#credits)
6. [ToDo or Dreams](#todo-or-dreams)

### Installation

Use the following instructions to set everything up on your local machine.

#### NodeJS

Ensure [node-16](https://nodejs.org/en/blog/release/v16.20.2) and npm 8+ are installed:
```shell
node --version  # v16.20.2
npm --version   # 8.19.4
```

[**Go top**](#table-of-contents) :point_up:

#### Docker

You have to have Docker to be able to deploy either only DB services or the entire app in containers.
Follow the official guide to install:
- [Docker](https://docs.docker.com/engine/install/)
- [Compose](https://docs.docker.com/compose/install/)

[**Go top**](#table-of-contents) :point_up:

#### Stripe Payments

- Sign up to [Stripe](https://dashboard.stripe.com/register) to access their API.
- **Important**: don't activate live payments! Testing mode is enabled by default. Just leave it as is. 
- Go to **Developers** tab -> API keys -> copy **Publishable** and **Secret** keys. The former is required for frontend, the latter is for backend.

[**Go top**](#table-of-contents) :point_up:

#### Source Code

Clone sources:
```shell
git clone https://github.com/sskorol/aqa-playground.git && cd aqa-playground
```

Install dependencies:
```shell
npm ci
```

[**Go top**](#table-of-contents) :point_up:

#### Environment Variables

The recommended way of setting up sensitive data for development is using your IDE's run/debug configuration profiles.
However, for production builds you'll likely use CLI or Docker.
That's where you need to adjust `.env.production` file for such scenarios (see [Environment Variables](#environment-variables)).
Below you'll find sample values that could be also used in IDE.

[**Go top**](#table-of-contents) :point_up:

##### Backend Config

```shell
cd packages/backend && nano .env.production
```

```shell
# .env.production

# Postgres
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=aqa
# PG Admin
PGADMIN_DEFAULT_EMAIL=admin@email.com
PGADMIN_DEFAULT_PASSWORD=admin
# BE
DB_HOST=postgres
DB_LOGGING=true
DB_NAME=aqa
DB_PASSWORD=admin
DB_PORT=5432
DB_SYNC=true
DB_USERNAME=admin
JWT_SECRET=aqasecret
PORT=9090
CORS_WHITELIST=http://localhost:3000
STRIPE_API_SECRET_KEY=YOUR_SECRET_STRIPE_KEY
```

Here, you can use any values. Just a small note regarding PGAdmin and Postgres communication.
PGAdmin provides GUI to manage Postgres instance in Docker. But as you'd access it from host OS,
it's quite easy to get confused with connection settings. Just always keep in mind that when you run services in Docker,
and expect them communicating each other, the actual connection request will always be made from within Docker network.
So despite you run GUI on the host from your web-browser, and expose external docker ports,
you should still provide the **name** of the docker service `postgres` and it's **internal** port `5432` to establish connection.
That differs from the direct DB access from the host, where you have to use an **external** port specified in docker-compose config.

Also note about dependencies: if you change ports or service names, don't forget to update the relevant info within FE/BE env vars
and Vite/Nginx configs (currently they use a hardcoded BE URL).

Regarding Stripe integration: just don't mix up the keys. Secret is always on the BE, publishable key is on FE-side.

[**Go top**](#table-of-contents) :point_up:

##### Frontend Config

```shell
VITE_REACT_APP_BE_URL=/api
VITE_REACT_APP_STRIPE_PUB_KEY=YOUR_PUBLICHABLE_STRIPE_KEY
```

Note that frontend production environment setup slightly differs from backend.
By default, you can't pass environment variables to React app in runtime unless you're running a dev server.
Build process produces static assets that contain hardcoded values picked up from the CLI.
There are several hacks that allows you to workaround this. But it doesn't worth doing it for just 2 env vars.
So you should either set them up in IDE or pass to Docker image via CLI / Compose.

Also note that frontend uses [Vite](https://vitejs.dev/) which allows you to spawn the dev server in milliseconds.
But we have to pay for it by following their conventions. Specifically, env vars must have `VITE_` prefix.
Moreover, you can't use `process.env.VAR_NAME` in the code. Vite uses [import-meta-env](https://iendeavor.github.io/import-meta-env/guide/getting-started/introduction.html)
which forces us switching to `import.meta.env.VAR_NAME` syntax.

It's also worth mentioning that `VITE_REACT_APP_BE_URL` value is different for dev and prod modes.
In dev mode you have to provide a full BE URL like `http://localhost:9090`. In prod mode, as we produce static assets,
reverse proxy is used on Nginx-level. It maps BE URL in Docker to `/api`. So env variable should refer to a short path instead.

[**Go top**](#table-of-contents) :point_up:

#### Database

DB is persisted locally via Docker volumes. So when you start the images listed in docker-compose configs (see [Partial Mode](#partial-mode)),
you'll see a new `./data` folder within backend root.

[**Go top**](#table-of-contents) :point_up:

### Docker

There are 2 options:
- run the app in the dev mode but Postgres and PGAdmin in Docker
- run the entire app in prod mode in Docker

[**Go top**](#table-of-contents) :point_up:

#### Partial Mode

The former option simplifies DB configuration stuff, but still require the initial setup to be done for spawning dev environment on your host OS.
Run the following command when your environment variables are ready:
```shell
docker compose -f docker-compose.dev.yml up -d
```

It deploys Postgres with PGAdmin, so that you can connect to the database from within BE or GUI.

[**Go top**](#table-of-contents) :point_up:

#### Full Deployment

To run the entire app in Docker, you have to build FE and BE first. But before doing that, you have to adjust `docker-compose.prod.yml`
with your Stripe publishable key (see notes about [FE env variables](#environment-variables) and deployment specifics).

```yaml
  frontend:
    build:
      context: ./packages/frontend
      args:
        VITE_REACT_APP_BE_URL: "/api"
        VITE_REACT_APP_STRIPE_PUB_KEY: ""
    restart: always
    container_name: frontend
    image: sskorol/aqa-fe:0.0.1
    ports:
      - "3000:80"
    networks:
      - aqa
```

Paste your `VITE_REACT_APP_STRIPE_PUB_KEY` and you are good to go.

Now you can build the images:
```shell
docker compose -f docker-compose.prod.yml build
```

To run the entire stack, use the following command:
```shell
docker compose -f docker-compose.prod.yml up -d
```

[**Go top**](#table-of-contents) :point_up:

### Running

Depending on the previous choice, you'd either run DB in Docker and BE/FE in IDE, or everything in Docker.

[**Go top**](#table-of-contents) :point_up:

#### Dev Mode

First, ensure you've set everything up, created IDE run/debug configurations with env vars, and started DB containers.
Note that as it's a multi-module project, you have to select a valid `package.json` depending on the sub-module you want to deploy.
Also, in case of multiple NodeJS versions, ensure you've selected 16. This project hasn't been tested in the other versions. 

To deploy the backend locally in the watch mode, use `start:dev` script. A similar script should be used on the frontend-side.

When you start the backend, it connects to the DB and creates the required tables based on the entities defined in the code.
Note that there's a `SYNCHRONIZE` flag (env var) set to `true`, which always re-creates the schema in case of any changes.
It's not recommended to activate it on prod, but as it's a test app, this flag gives only benefits.

At this point, you should be able to run FE and BE locally with DB in Docker.

[**Go top**](#table-of-contents) :point_up:

#### Prod Mode

To deploy everything in containers, just run the following command:
```shell
docker compose -f docker-compose.prod.yml up -d
```

[**Go top**](#table-of-contents) :point_up:

#### Operating

- Open web-browser on http://localhost:3000/.
- Create a new user via sign up form.
- Open Swagger interface http://localhost:9090/api and try `/auth/login` endpoint with newly created user.
- Copy the `accessToken` value returned from response and perform the global authorization to ensure corresponding header is injected into all requests.
- Run `/producst/mock` endpoint to generate a set of products.
- Go to web-browser, refresh the page and see a list of newly created products. Note, you can also add products one by one from within GUI.
- Add a couple of products to the card and click the Cart icon.
- Open `Need help? See Stripe testing cards.` link, copy some test card details and try to proceed with a test payment.

Note that the flow would be the same in case of the local and containerized deployment.

[**Go top**](#table-of-contents) :point_up:

### Tests

There are no tests. But that's the point, right? :smirk:

I'd also recommend you to perform an exercise by adding custom attributes to elements you'd interact with on FE.
That would be a good practice to know your FE better. :mortar_board:

[**Go top**](#table-of-contents) :point_up:

### Credits

Inspired by @jayamaljayamaha who is the author of the original implementation:
- [backend](https://github.com/jayamaljayamaha/stripe-integration-back-end)
- [frontend](https://github.com/jayamaljayamaha/stripe-integration-front-end)

[**Go top**](#table-of-contents) :point_up:

### ToDo or Dreams

- [ ] Add API and UI tests using different stacks
- [ ] Revise and optimize styles
- [ ] Decouple and optimize FE components
- [ ] Extend Checkout logic
- [ ] Add Product details component
- [ ] Add Product and User management screens
- [ ] Add file upload support for images
- [ ] Revise DTOs, possibly add DAOs
- [ ] Add dynamic environment variables support to FE

[**Go top**](#table-of-contents) :point_up: