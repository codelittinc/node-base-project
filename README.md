# Base Node + GraphQL project

This is basic nodejs + graphQl project starter

## Running the project

## Installation

This base project is intended to be used with db ownership from the developer so there are multiple scripts created to manage the database.

### Plug & Play

* clone this project and access the folder where you cloned it
* `make config` creates an `env` file with the example config
* `make start.all` starts the docker environment
* visit `http://localhost:9090`

### Running from you local env with docker database

You can run the project from your local environemnt, using a dockerized postgres database configured for that!

* `make db` starts the docker db environment
* `make db.create` setups & migrates the app's database
* `npm start` starts the server


## Makefile

The project comes with a `Makefile` created to run usefull commands.
The following are the current command list:
- `start.dev`: runs docker-compose containers, and starts bash. (Database will be not populated you will need to run extra commands)
- `start`: same as `start.dev` but it will run the server
- `build`: builds the docker-compose containers
- `config`: creates a basic env file to run your server, no sensible keys are available
- `db`: starts the database container
- `db.setup / db.setup.test`: creates the database if it not exists for dev / test environment
- `db.create / db.create.test`: creates & execute migrations of the database if it not exists for dev / test environment

Execute a command via:

```shell
make <command>
```

## Migrations

Migrations are configured as SQL files stored under the `db/migrations` folder.  
This files are required to be stored as `DATE.NAME.up.sql`. Where `DATE` is the current `yyyymmdd` date, and `NAME` is a meaningfull name for the migration we are creating.

To speed things up you can create a new migration doing:

```
make db-migrate-create name="properties"
```

This will generate two files, `yyyyymmdd.properties.up.sql` and  `yyyyymmdd.properties.down.sql`.  
The UP file should have the logic to create and insert all the elements needed to execute that migration.  
The DOWN file should have the logic to decrease the migration, delete exactly what was created and inserted.

The project comes with a helper created to run migrations using `umzug` api and `sequelize` database connection. It supports the following commands:

- `status`: print current migration status
- `up/migrate`: executed all unexecuted migrations
- `down/reset`: revert all executed migrations
- `next/migrate-next`: execute the next pending migration
- `prev/reset-prev`: revert the previous executed migration
- `reset-hard`: reset the database using a `dropdb`/`createdb` postgres command

Execute a command via:

```shell
npm run db:migrate <command>
```


## Project Structure
The full folder structure of this app is explained below:
| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **.vscode**              | Contains VS Code specific settings                                                            |
| **dist**                 | Contains the distributable (or output) from your TypeScript build. This is the code you ship  |
| **node_modules**         | Contains all your npm dependencies                                                            |
| **src**                  | Contains your source code that will be compiled to the dist dir                               |
| **src/config**           | Passport authentication strategies and login middleware. Add other complex config code here   |
| **src/controllers**      | Controllers define functions that respond to various http requests                            |
| **src/models**           | Models define Mongoose schemas that will be used in storing and retrieving data from MongoDB  |
| **src/types**            | Holds .d.ts files not found on DefinitelyTyped.                                               |
| **src**/index.ts        | Entry point to the express app                                                               |
| **test**                 | Contains your tests. Separate from source because there is a different build process.         |
| .env.example             | API keys, tokens, passwords, database URI. Clone this, but don't check it in to public repos. |
| jest.*.config.js           | Used to configure Jest running tests written in TypeScript                                    |
| package.json             | File that contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)                          |
| tsconfig.json            | Config settings for compiling server code written in TypeScript                               |
| tsconfig.tests.json      | Config settings for compiling tests written in TypeScript                                     |
| tsconfig.json                | Config settings for TSLint code style checking                                                |



## Built With

* [Express](https://expressjs.com) - Nodejs framework
* [Sequelize](https://sequelize.org/) - DB ORM used with PG driver
* [Umzug](https://github.com/sequelize/umzug) - Library to programmatically handle execution and logging of migration tasks
