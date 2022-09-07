# bETHer spaces

Empowering students with healthy spaces.

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

#### Apache2

Install the following configuration file in `/etc/apache2/sites-available/bether.tenderribs.cc.conf`. This sets up a reverse proxy to strapi running on the local machine.

Update the environment files for the project. Specifically you need to update the domain name everywhere.

```conf
<IfModule mod_ssl.c>
<VirtualHost *:443>
        ServerName bether.tenderribs.cc
        ServerAlias bether.tenderribs.cc

        ProxyPreserveHost On
        ProxyPass / http://127.0.0.1:6969/
        ProxyPassReverse / http://127.0.0.1:6969/

        SSLProxyEngine on
        SSLEngine on

        RewriteEngine on

    SSLCertificateFile /etc/letsencrypt/live/bether.tenderribs.cc/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/bether.tenderribs.cc/privkey.pem
    Include /etc/letsencrypt/options-ssl-apache.conf
</VirtualHost>
</IfModule>
```

```conf
# ./.env
HOST=127.0.0.1
PORT=6969
PUBLIC_URL=https://bether.tenderribs.cc
APP_KEYS=
JWT_SECRET=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
```


#### Webserver

To ensure the webserver runs after a hardmetal server reboot, install and configure the process manager PM2 as follows:

```sh
npm install pm2@latest -g
pm2 start app.js
```
