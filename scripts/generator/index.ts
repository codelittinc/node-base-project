import { compile } from 'handlebars';
import { toCamelCase, toPascalCase, toSnakeCase } from './utils';
import { plural } from 'pluralize';
import { readFileSync, writeFile } from 'fs';

const generate = () => {
  // Get base model name and reference name from argument
  // TODO: Modular cli arguments based on flags
  if (process.argv.length < 4) {
    console.error(
      'Please specify your model name and you reference model name',
    );
    console.error('npm run generate:model -- [modelName] [modelReference]');
    return;
  }
  const baseName = toCamelCase(process.argv[2]);
  const referenceModelName = process.argv[3];
  const migration =
    process.argv.length === 5
      ? process.argv[4]
      : `add_${toSnakeCase(baseName)}s_table`;

  const log = {
    err: text => console.log('\x1b[34m%s\x1b[0m', `err: ${text}`),
    line: text => console.log('\x1b[32m%s\x1b[0m', `* ${text}`),
  };

  const task = {
    file: t => console.log('\x1b[32m%s\x1b[0m', `* [TODO] ${t}`),
    desc: t => console.log('\x1b[33m%s\x1b[0m', '* * ' + t),
    code: t => console.log(t, '\n'),
  };

  const yyyymmdd = new Date()
    .toISOString()
    .split('T')[0]
    .split('-')
    .join('');

  // model variables
  const table = plural(baseName);
  const modelName = toPascalCase(baseName);
  const lowerModelName = baseName;
  const referenceTable = plural(`${referenceModelName.toLowerCase()}`);
  const constraint = `fk_${plural(toSnakeCase(baseName))}${plural(
    toSnakeCase(referenceModelName),
  )}`;

  // TODO: Populate variables
  const seedCountVariableName = plural(
    `COUNT_${toSnakeCase(baseName.toUpperCase())}`,
  );
  const fkColumn = `${baseName}Id`;

  // file names
  const modelFileName = `./src/models/${referenceModelName.toLowerCase()}/${modelName}Model.ts`;
  const migrationFileName = `./src/db/migrations/schema/${yyyymmdd}.${migration}`;

  // templates
  const modelFile = readFileSync(
    './scripts/generator/templates/model.template',
    'utf8',
  );
  const modelFileContent = compile(modelFile);

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

  // Templates processing
  const modelFileContentProcessed = modelFileContent({
    modelName,
    table,
  });

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

  // Generate files
  writeFile(modelFileName, modelFileContentProcessed, err => {
    if (err) {
      log.err('unable to save model file');
    } else {
      log.line('written model file');
    }
  });

  writeFile(
    `${migrationFileName}.down.sql`,
    downMigrationFileContentProcessed,
    err => {
      if (err) {
        log.err('unable to save DOWN migration');
      } else {
        log.line('written DOWN schema migration');
      }
    },
  );

  writeFile(
    `${migrationFileName}.up.sql`,
    upMigrationFileContentProcessed,
    err => {
      if (err) {
        log.err('unable to save UP migration');
      } else {
        log.line('written UP schema migration');
      }
    },
  );

  // MANUAL
  task.file('src/db/seeds/helpers/count.ts');
  task.desc('add export');
  task.code(`export const ${seedCountVariableName} = 100;`);

  task.file('src/db/seeds/index.ts');
  task.desc('add import');
  task.code(`import ${modelName}Seed from './${lowerModelName}Seed';`);
  task.desc('add item to array');
  task.code(`${modelName}Seed`);

  task.file('src/models/index.ts');
  task.desc('add export');
  task.code(`export { ${modelName} } from './office/${modelName}Model';`);

  task.file(`src/models/${referenceModelName}Model.ts`);
  task.desc('add model import');
  task.code(`import { ${modelName} } from '@models';`);
  task.desc('add properties');
  task.code(`public ${fkColumn}?: number;
public ${lowerModelName}?: ${modelName};
`);
  task.desc('add column definition');
  task.code(`${fkColumn}: {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: ${modelName},
    key: 'id',
  },
},`);
  task.desc('add belongsTo relation');
  task.code(`${referenceModelName}.belongsTo(${modelName}, {
  foreignKey: '${fkColumn}',
  as: '${lowerModelName}',
});`);

  task.file('tests/integration/factory/definitions.ts');
  task.desc('add export');
  task.code(
    `export { default as ${modelName}Definitions } from './${lowerModelName}Definitions';`,
  );

  task.file('tests/integration/setup/clearDB.ts');
  task.desc('add model to clearDB');
  task.code(`m.${modelName}`);
};

generate();
