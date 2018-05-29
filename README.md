# Server-TakeMeOut
[![Dependencies](https://david-dm.org/Biuni/Server-TakeMeOut/status.svg)](https://david-dm.org/Biuni/Server-TakeMeOut)
[![devDependencies](https://david-dm.org/Biuni/Server-TakeMeOut/dev-status.svg)](https://david-dm.org/Biuni/Server-TakeMeOut?type=dev)

RESTful API used by [TakeMeOut application](https://github.com/Biuni/App-TakeMeOut).
> TakeMeOut is the final project developed during the course of Software Engineering and CyberSecurity at UnivPM. This app was created under the supervision of Gabriele Bernardini, Silvia Santarelli and Luca Spalazzi and was born from their idea.

## Install and setup the server

  - Install [NodeJS](https://nodejs.org/en/) (reccomendend the last LTS version)
  - Clone this repository (requires [Git](https://git-scm.com/)) on your local machine (or download as a ZIP)
    ```sh
    $ git clone https://github.com/Biuni/Server-TakeMeOut.git
    ```
  - The server needs a [MySQL](https://www.mysql.com/it/downloads/) database. You can request a dump of it by contact one of the authors.
  - After receiving it you can now create the database. Import the SQL dump and set the connection variables in `./utils/global.js`
  - Into the same file change also the *SESSION_KEY* variable with another string. **It's very important for security!**
  - Now open the command line and run the follow commands
    ```sh
    $ cd Server-TakeMeOut
    $ npm install
    $ npm start
    ```
  - If you read&nbsp; *"Live on ..."* &nbsp;the server is online on your local network interface on port 3000 (e.g: `192.168.1.8:3000`) and it's visible by all devices connected on the LAN.
  - Go to `/admin/login` (e.g: `http://192.168.1.8:3000/admin/login`) and authenticate with `admin` and `secret`.
  - Click over the Administrator icon and Change Password. Modify it with a more secure string.
  - *All right! The server is ready to production mode.*

## Test
If you want to check all the system you can run the unit tests. It's very easy, go on your command line, execute `npm run test` and the results will be displayed directly on the console.
> *INFO: By executing the command `npm run test` also makes a check on the style of writing the code. For more information you can see the official website of [StandardJS](https://standardjs.com/)*

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