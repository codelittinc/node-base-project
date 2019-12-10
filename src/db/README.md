# Database

## Library (ORM) used

[Sequelize](https://sequelize.org/) is an Object-Relation Mapping (ORM) library that allows us to treat the relational database as objects in our application.

### Creating a Model

As we mentioned, Sequelize allow us to map **TypeScript Classes** to a **Database Table**, for that we have to create a **Model**.
To create a model add a .ts file inside the `src/models` folder, as `NAME.model.ts`, where NAME could be `purchase` or `paymentType`.

Models must extend from the **sequelize** Model class, to get the full db access functionality such as `create`, `find` or `delete`.
Apart from extending the Sequelize class and adding the model's properties we must define the corresponding `DataTypes` to let Sequelize understand the relation between our class and the corresponding table.

Table names should always be in plural.

```ts
import { DataTypes } from 'sequelize';
import { database } from '@db';
import BaseModel from '@models/base.model';

export class Purchase extends BaseModel {
  public id!: number;
  public name!: string;
}

Purchase.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false
    }
  },
  {
    tableName: 'purchases',
    sequelize: database
  }
);
```

#### Adding it to the Database

Apart from creating the model, since we use migrations, we have to create the corresponding **Database Table**.
For that, you should create a **schema migration** using the following command:

```shell
NAME=purchase npm run db:migrate:schema create
```

Inside the file `yyyyymmdd.purchase.up.sql` add the SQL statement that creates the table. Keys and Indexes should also be added.

To update your database then just run:

```shell
npm run db:migrate:schema up
```

Also, make sure to add the SQL statement to perform the opposite job in `yyyyymmdd.purchase.down.sql`.
For instance, if your UP migration creates a table, the DOWN migration would typically delete it.
The command to run the DOWN migration is alike:

```shell
npm run db:migrate:schema down
``` 

For more information check out the [**migrations**](#migrations) section.

## Configuration

The current configuration example is this:

```conf
# Database
DB_HOST=localhost
DB_DATABASE=node_graphql
DB_USER=postgres
DB_PASSWORD=postgres
DB_SQLLOG=false
```

Where:

- `DB_HOST` : Is the DB server. If you are running inside docker it will be `db` or if you have a database of your own it would be `localhost`.
- `DB_DATABASE` : Is the main database name
- `DB_USER` : Application user access, should have write permissions to create schemas.
- `DB_PASSWORD` : Application user password.
- `DB_SQLLOG` : By default false. This sets the SQL logging for **Sequelize**.

## Migrations

Migrations are explained on the root [readme](../../README.md)

## Seeding

Seeding a database is a process in which an initial set of data is provided to a database when it is being installed for a Developer.
It's very important for developers to have seeds to start faster their environment since they won't be depending on data creation.

### What is a Seed?

A seed is a specific collection of models / entities that will populate the DB, like a small data package that will run, on the development environment.

### How can I create a Seed?

Seeds can be created easily as TS files under the `db/seeds` folder. When creating a seed we just export a default function with the business logic to fulfill that seed.
As an example checkout the `user.seed.ts`, this will populate the `Users` table with some users.

### Do I want to create a seed?

Seeds are for initial and testing purposes, so creating seeds will only be related to development purposes.
If you have created a entity that needs data by default required by the application, you don't need a **seed**, you need a **Data Migration**.

Examples:

- _Seed_: I have created a `Purchase History` view and it would be interesting to have pre-populated that view by default. This way all developers could see this view's functionality without having to go through the full purchase flow.
- _Data Migration_: I have created the `PaymentType` entity that can be `Cash` or `Credit Card` and this should be added to all environments, most importantly **production**.

## Configuration

### Production

Azure PostgreSQL requires SSL to be enabled between the client and the service, otherwise it won't be possible to connect to the database.
For that we have configured on production environment to have the `DB_SSL` with **true** value, keep that in mind when connecting from a different environment.
