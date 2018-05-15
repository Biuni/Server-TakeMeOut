# Server-TakeMeOut
[![Dependencies](https://david-dm.org/Biuni/Server-TakeMeOut/status.svg)](https://david-dm.org/Biuni/Server-TakeMeOut)
[![devDependencies](https://david-dm.org/Biuni/Server-TakeMeOut/dev-status.svg)](https://david-dm.org/Biuni/Server-TakeMeOut?type=dev)

RESTful API used by [TakeMeOut application](https://github.com/Biuni/App-TakeMeOut).
> TakeMeOut is the final project developed during the course of Software Engineering and CyberSecurity at UnivPM. This app was created under the supervision of Gabriele Bernardini, Silvia Santarelli and Luca Spalazzi and was born from their idea.

## Install the server

  - Install [NodeJS](https://nodejs.org/en/) (reccomendend the last LTS version)
  - Clone this repository (requires [Git](https://git-scm.com/)) on your local machine (or download as a ZIP)
    ```sh
    $ git clone https://github.com/Biuni/Server-TakeMeOut.git
    ```
  - Now open the command line and run the follow commands
    ```sh
    $ cd Server-TakeMeOut
    $ npm install
    $ npm start
    ```
  - Now the server is online on your local network interface on port 3000 (e.g: `192.168.1.8:3000`) and it's visible by all devices connected on the LAN.

  *INFO: The server needs a mysql database. You can request a copy of it by contact one of the contributors. The connection variables are in `./utils/global.js`*

## Authors
  - Gianluca Bonifazi
  - Gianpio Sozzo
  - Emanuele Longheu
  - Mattia Campeggi
  - Luca Sanchioni

## API Documentation
| Type | Path | Params | About |
| ------ | ------ | ------ | ------ |
| `GET` | `/conn/info` | -- | Get information about the server and the database connection |
| `GET` | `/conn/data` | -- | Get the database table with node information |
| `GET` | `/user/get/:uuid` | *uuid* | Get user information by uuid |
| `POST` | `/user/register` | *mail* - *pwd* - *name* | Register a new user |
| `POST` | `/user/login` | *mail* - *pwd* | Login an user |
| `GET` | `/nav/send/:beacon` | *beacon* | Get the shortest path to safe place using beacon id |


[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)