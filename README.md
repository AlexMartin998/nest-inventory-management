<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Features

⚡️ Nest.js\
⚡️ PostgreSQL and TypeORM\
⚡️ Docker

## Running the app

### Dev Env

#### Create .env file based on .env.template

```bash
touch .env
```

#### Dev containers - VS Code

1. Install [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension in VS Code

2. Add your host user

```bash
export DOCKER_USER="$(id -u):$(id -g)"
```

3. Run `docker-compose.devcontainers.yml`

```bash
docker compose -f docker-compose.devcontainers.yml up --build
```

4. Attach to Running Container
   1. Press down: `Ctrl + Shift + P`
   2. Search: `Dev Containers: Attach to Running Container`
   3. Select `/api_nest` container
   4. New VS Code window will open, so open the folder project: `/code/`
   5. Close the remote connections in VS Code
   6. Stop and remove containers, networks

```bash
docker compose -f docker-compose.devcontainers.yml down
```

#### Dev mode

Make sure that you have Node.js installed in your divece.

- Install all dependencies

```bash
# pnpm
npm i -g pnpm

# nest
npm i -g @nestjs/cli

# app deps
pnpm install
```

- Run the app in dev mode

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Stop and remove containers, networks

```bash
docker compose -f docker-compose.dev.yml down
```

### Prod Env

- Configure the app to run in prod

- Running the app

```bash
# compose
docker compose up --build
```

## Documentation

```bash
curl http://localhost:3000/api
```
