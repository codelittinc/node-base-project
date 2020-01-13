import { compile } from 'handlebars';
import { Action } from '../action';
import { plural } from 'pluralize';
import { toSnakeCase } from '../utils';
import { readFileSync, writeFile } from 'fs';

export class Migration extends Action {
  public do(): void {
    const seedCountVariableName = plural(
      `COUNT_${toSnakeCase(this.baseName.toUpperCase())}`,
    );
    const yyyymmdd = new Date()
      .toISOString()
      .split('T')[0]
      .split('-')
      .join('');
    const migration = this.migrationFileName
      ? this.migrationFileName
      : `add_${toSnakeCase(this.baseName)}s_table`;

    const referenceTable = plural(`${this.referenceModelName.toLowerCase()}`);
    const constraint = `fk_${plural(toSnakeCase(this.baseName))}${plural(
      toSnakeCase(this.referenceModelName),
    )}`;
    const fkColumn = this.fkColumn;
    const table = this.table;

    // file name
    const migrationFileName = `./src/db/migrations/schema/${yyyymmdd}.${migration}`;

    // templates
    const upMigrationFile = readFileSync(
      './scripts/generator/templates/migrationUp.template',
      'utf8',
    );
    const upMigrationFileContent = compile(upMigrationFile);

    const downMigrationFile = readFileSync(
      './scripts/generator/templates/migrationDown.template',
      'utf8',
    );
    const downMigrationFileContent = compile(downMigrationFile);

    // templates processing
    const downMigrationFileContentProcessed = downMigrationFileContent({
      referenceTable,
      constraint,
      fkColumn,
      table,
    });

    const upMigrationFileContentProcessed = upMigrationFileContent({
      referenceTable,
      constraint,
      fkColumn,
      table,
    });

    // generate files
    writeFile(
      `${migrationFileName}.down.sql`,
      downMigrationFileContentProcessed,
      err => {
        if (err) {
          this.log.err('unable to save DOWN migration');
        } else {
          this.log.line('written DOWN schema migration');
        }
      },
    );

    writeFile(
      `${migrationFileName}.up.sql`,
      upMigrationFileContentProcessed,
      err => {
        if (err) {
          this.log.err('unable to save UP migration');
        } else {
          this.log.line('written UP schema migration');
        }
      },
    );

    // manual
    this.task.file('src/db/seeds/helpers/count.ts');
    this.task.desc('add export');
    this.task.code(`export const ${seedCountVariableName} = 100;`);

    this.task.file('src/db/seeds/index.ts');
    this.task.desc('add import');
    this.task.code(
      `import ${this.modelName}Seed from './${this.baseName}Seed';`,
    );
    this.task.desc('add item to array');
    this.task.code(`${this.modelName}Seed`);
  }
}
