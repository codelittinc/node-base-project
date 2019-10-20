"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const credentials_1 = require("../../src/db/credentials");
function createDatabase() {
    const { databaseName } = credentials_1.getDatabaseConfig();
    const pool = new pg_1.Pool({
        connectionString: credentials_1.getConnURIWithDatabaseName()
    });
    pool.query('CREATE DATABASE ' + databaseName, err => {
        console.log('Error while creating database: ' + err);
    });
}
exports.createDatabase = createDatabase;
createDatabase();
//# sourceMappingURL=setup.js.map