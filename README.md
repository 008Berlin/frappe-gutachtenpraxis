# Gutachten

## Description
Frappe app based on healthcare module for Gutachtenpraxis

#### License
MIT


# How to install

## Prerequisites
* Docker
* docker-compose
* user added to docker group

It is recommended you allocate at least 4GB of RAM to docker:

- [Instructions for Windows](https://docs.docker.com/docker-for-windows/#resources)
- [Instructions for macOS](https://docs.docker.com/desktop/settings/mac/#advanced)


## Bootstrap Containers for development

Clone and change directory to frappe_docker directory

```shell
git clone https://github.com/frappe/frappe_docker.git
cd frappe_docker
```

Copy example devcontainer config from `devcontainer-example` to `.devcontainer`

```shell
cp -R devcontainer-example .devcontainer
```

Copy example vscode config for devcontainer from `development/vscode-example` to `development/.vscode`. This will setup basic configuration for debugging.

```shell
cp -R development/vscode-example development/.vscode
```

## Use VSCode Remote Containers extension

For most people getting started with Frappe development, the best solution is to use [VSCode Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).


VSCode should automatically inquire you to install the required extensions, that can also be installed manually as follows:

- Install Remote - Containers for VSCode
  - through command line `code --install-extension ms-vscode-remote.remote-containers`
  - clicking on the Install button in the Vistual Studio Marketplace: [Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
  - View: Extensions command in VSCode (Windows: Ctrl+Shift+X; macOS: Cmd+Shift+X) then search for extension `ms-vscode-remote.remote-containers`

After the extensions are installed, you can:

- Open frappe_docker folder in VS Code.
  - `code .`
- Launch the command, from Command Palette (Ctrl + Shift + P) `Remote-Containers: Reopen in Container`. You can also click in the bottom left corner to access the remote container menu.

Notes:

- The `development` directory is ignored by git. It is mounted and available inside the container. Create all your benches (installations of bench, the tool that manages frappe) inside this directory.

## Setup first bench

Run the following commands in the terminal inside the container. You might need to create a new terminal in VSCode.

To setup frappe framework version 14 bench set `PYENV_VERSION` environment variable to `3.10.5` (default) and use NodeJS version 16 (default),

```shell
# Use default environments
bench init --skip-redis-config-generation --frappe-branch version-15 frappe-bench
# Or set environment versions explicitly
nvm use v18
PYENV_VERSION=3.10.5 bench init --skip-redis-config-generation --frappe-branch version-15 frappe-bench
# Switch directory
cd frappe-bench
```

## Setup hosts

We need to tell bench to use the right containers instead of localhost. Run the following commands inside the container:

```shell
bench set-config -g db_host mariadb
bench set-config -g redis_cache redis://redis-cache:6379
bench set-config -g redis_queue redis://redis-queue:6379
bench set-config -g redis_socketio redis://redis-socketio:6379
```

For any reason the above commands fail, set the values in `common_site_config.json` manually.

```json
{
  "db_host": "mariadb",
  "redis_cache": "redis://redis-cache:6379",
  "redis_queue": "redis://redis-queue:6379",
  "redis_socketio": "redis://redis-socketio:6379"
}
```

## Create a new site with bench

You can create a new site with the following command:
```shell
bench new-site health.localhost --mariadb-root-password 123 --admin-password admin --no-mariadb-socket
```
The command will ask the MariaDB root password. The default root password is `123`.
This will create a new site and a `health.localhost` directory under `frappe-bench/sites`.
The option `--no-mariadb-socket` will configure site's database credentials to work with docker.
You may need to configure your system /etc/hosts if you're on Linux, Mac, or its Windows equivalent.

## Set bench developer mode on the new site

To develop a new app, the last step will be setting the site into developer mode. Documentation is available at [this link](https://frappe.io/docs/user/en/guides/app-development/how-enable-developer-mode-in-frappe).

```shell
bench --site health.localhost set-config developer_mode 1
bench --site health.localhost clear-cache
```

## Install an app

To install an app we need to fetch it from the appropriate git repo, then install in on the appropriate site:

You can check [VSCode container remote extension documentation](https://code.visualstudio.com/docs/remote/containers#_sharing-git-credentials-with-your-container) regarding git credential sharing.

To install erpnext app
```shell
bench get-app --branch version-15 --resolve-deps erpnext
bench --site health.localhost install-app erpnext
```

To install healthcare app
```shell
bench get-app healthcare
bench --site health.localhost install-app healthcare
```

To install gutachten app
```shell
bench get-app https://github.com/d0rianw/frappe-gutachtenpraxis.git
bench --site health.localhost install-app health_gutachtenpraxis
```

## Start Frappe without debugging
Execute following command from the `frappe-bench` directory.

```shell
bench start
```

You can now login with user `Administrator` and the password you choose when creating the site.
Your website will now be accessible at location [health.localhost:8000](http://health.localhost:8000)
Note: To start bench with debugger refer section for debugging

## Start Frappe with Visual Studio Code Python Debugging (if needed)

To enable Python debugging inside Visual Studio Code, you must first install the `ms-python.python` extension inside the container. This should have already happened automatically, but depending on your VSCode config, you can force it by:

- Click on the extension icon inside VSCode
- Search `ms-python.python`
- Click on `Install on Dev Container: Frappe Bench`
- Click on 'Reload'

We need to start bench separately through the VSCode debugger. For this reason, **instead** of running `bench start` you should run the following command inside the frappe-bench directory:

```shell
honcho start \
    socketio \
    watch \
    schedule \
    worker_short \
    worker_long \
    worker_default
```

Alternatively you can use the VSCode launch configuration "Honcho SocketIO Watch Schedule Worker" which launches the same command as above.

This command starts all processes with the exception of Redis (which is already running in separate container) and the `web` process. The latter can can finally be started from the debugger tab of VSCode by clicking on the "play" button.

You can now login with user `Administrator` and the password you choose when creating the site, if you followed this guide's unattended install that password is going to be `admin`.

To debug workers, skip starting worker with honcho and start it with VSCode debugger.

For advance vscode configuration in the devcontainer, change the config files in `development/.vscode`.

## Running the containers

```shell
docker-compose -f .devcontainer/docker-compose.yml up -d
```

And enter the interactive shell for the development container with the following command:

```shell
docker exec -e "TERM=xterm-256color" -w /workspace/development -it devcontainer-frappe-1 bash
```

# Production-setup

## Build and push custom app from dev environment - this follows the official frappe docker documentation: https://github.com/frappe/frappe_docker/blob/main/docs/custom-apps.md
### Remember change the repository from "https://github.com/d0rianw/frappe-gutachtenpraxis.git" to yours.

## Clone the Frappe Docker Repository
```shell
git clone https://github.com/frappe/frappe_docker
```

## Change in the frappe_docker folder
```shell
cd frappe_docker
```

## After that
```shell
export APPS_JSON='[
  {
    "url": "https://github.com/frappe/erpnext",
    "branch": "version-15"
  },
  {
    "url": "https://github.com/d0rianw/frappe-gutachtenpraxis.git",
    "branch": "main"
  }
]'
export APPS_JSON_BASE64=$(echo ${APPS_JSON} | base64 -w 0)
```

## Then
```shell
docker build \
  --build-arg=FRAPPE_PATH=https://github.com/frappe/frappe \
  --build-arg=FRAPPE_BRANCH=version-15 \
  --build-arg=PYTHON_VERSION=3.11.6 \
  --build-arg=NODE_VERSION=18.18.2 \
  --build-arg=APPS_JSON_BASE64=$APPS_JSON_BASE64 \
  --tag=ghcr.io/d0rianw/frappe-gutachtenpraxis/app-image_full:1.0.6 \
  --tag=ghcr.io/d0rianw/frappe-gutachtenpraxis/app-image_full:latest \
  --no-cache \
	--platform=linux/amd64 \
  --file=images/custom/Containerfile .
```

## Then Push Custom App to container repository:
## Login to [ghcr.io](http://ghcr.io) with docker
## Use a classic **personal access token** for password
```shell
docker login ghcr.io
```

## and
```shell
docker push ghcr.io/d0rianw/frappe-gutachtenpraxis/app-image_full:1.0.6
docker push ghcr.io/d0rianw/frappe-gutachtenpraxis/app-image_full:latest
```

# Build Container on server
## Create gutachtenpraxis.yaml 
### Remember change the image in compose.yaml to "ghcr.io/d0rianw/frappe-gutachtenpraxis/app-image_full:1.0.6"
```shell
docker compose --project-name gutachtenpraxis \
  --env-file ~/gitops/gutachtenpraxis.env \
  -f compose.yaml \
  -f overrides/compose.redis.yaml \
  -f overrides/compose.multi-bench.yaml \
  -f overrides/compose.multi-bench-ssl.yaml config > ~/gitops/gutachtenpraxis.yaml
```

## Then
```shell
docker compose --project-name gutachtenpraxis -f ~/gitops/gutachtenpraxis.yaml up -d
```
```shell
docker compose --project-name gutachtenpraxis exec backend bench new-site example.com --no-mariadb-socket --mariadb-root-password ChangeMe --install-app erpnext --install-app health_gutachtenpraxis --admin-password ChangeMe
```

# Running the Kanban Script
## Connect to container bash
```shell
docker compose --project-name gutachtenpraxis exec -it backend bash
```

## Run the script
```shell
bench --site example.com execute health_gutachtenpraxis.patches.setup_kanban_board.execute
```
