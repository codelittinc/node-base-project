const fs = require("fs");
const handlebars = require('handlebars');

// Handy string extensions

function capitalLetterFunc(){
    return this.charAt(0).toUpperCase() + this.slice(1)
}
String.prototype.capitalizeFirstLetter = capitalLetterFunc;

function lowerLetterFunc(){
    return this.charAt(0).toLowerCase() + this.slice(1);
}
String.prototype.lowerFirstLetter = lowerLetterFunc;

function snakeCaseFunc(){
    return this.toString().replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}
String.prototype.toSnakeCase = snakeCaseFunc;

function pascalFunc(){
    return this.toCamelCase().capitalizeFirstLetter();
}
String.prototype.toPascalCase = pascalFunc;

function camelCaseFunc() {
    // FROM https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
    return this.toString().replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
}
String.prototype.toCamelCase = camelCaseFunc;


// Get base model name and reference name from argument
// TODO: Modular cli arguments based on flags
if(process.argv.length < 4){
  console.error("Please specify your model name and you reference model name");
  console.error("npm run generate:model -- [modelName] [modelReference]");
  return;
}
const baseName = process.argv[2].toCamelCase();
const referenceModelName = process.argv[3];
const migration = process.argv.length === 5 ? process.argv[4] : `add_${baseName.toSnakeCase()}s_table`;

const log = {
    err: text => console.log("\x1b[34m%s\x1b[0m", `err: ${text}`),
    line: text => console.log("\x1b[32m%s\x1b[0m", `* ${text}`)
};

const task = {
    file: t => console.log("\x1b[32m%s\x1b[0m", `* [TODO] ${t}`),
    desc: t => console.log("\x1b[33m%s\x1b[0m", "* * " + t),
    code: t => console.log(t, "\n")
};

const yyyymmdd = new Date().toISOString().split("T")[0].split("-").join("");

// model variables
const table = `${baseName}s`;
const modelName = baseName.toPascalCase();
const lowerModelName = baseName;
const referenceTable = `${referenceModelName.toLowerCase()}s`;
const constraint = `fk_${baseName.toSnakeCase()}s`;


// TODO: Populate variables
const seedCountVariableName = `COUNT_${baseName.toSnakeCase().toUpperCase()}S`;
const fkColumn = `${baseName}Id`;


// file names
const modelFileName = `./src/models/${referenceModelName.toLowerCase()}/${modelName}Model.ts`;
const migrationFileName = `./src/db/migrations/schema/${yyyymmdd}.${migration}`;

// templates
const modelFile = fs.readFileSync(
    './scripts/generator/templates/model.template',
    'utf8',
);
let modelFileContent = handlebars.compile(modelFile);

const upMigrationFile = fs.readFileSync(
    './scripts/generator/templates/migrationUp.template',
    'utf8'
);
let upMigrationFileContent = handlebars.compile(upMigrationFile);

const downMigrationFile = fs.readFileSync(
    './scripts/generator/templates/migrationDown.template',
    'utf8'
);
let downMigrationFileContent = handlebars.compile(downMigrationFile);

// Templates processing
modelFileContent = modelFileContent({
    modelName,
    table
});

downMigrationFileContent = downMigrationFileContent({
    referenceTable,
    constraint,
    fkColumn,
    table,
});

upMigrationFileContent = upMigrationFileContent({
    referenceTable,
    constraint,
    fkColumn,
    table,
});

// Generate files
fs.writeFile(modelFileName, modelFileContent, err => {
    if (err) {
        log.err("unable to save model file");
    } else {
        log.line("written model file");
    }
});

fs.writeFile(`${migrationFileName}.down.sql`, downMigrationFileContent, err => {
    if (err) {
        log.err("unable to save DOWN migration");
    } else {
        log.line("written DOWN schema migration");
    }
});

fs.writeFile(`${migrationFileName}.up.sql`, upMigrationFileContent, err => {
    if (err) {
        log.err("unable to save UP migration");
    } else {
        log.line("written UP schema migration");
    }
});

// MANUAL
task.file("src/db/seeds/helpers/count.ts");
task.desc("add export");
task.code(`export const ${seedCountVariableName} = 100;`);

task.file("src/db/seeds/index.ts");
task.desc("add import");
task.code(`import ${modelName}Seed from './${lowerModelName}Seed';`);
task.desc("add item to array");
task.code(`${modelName}Seed`);

task.file("src/models/index.ts");
task.desc("add export");
task.code(`export { ${modelName} } from './office/${modelName}Model';`);

task.file(`src/models/${referenceModelName}Model.ts`);
task.desc("add model import");
task.code(`import { ${modelName} } from '@models';`);
task.desc("add properties");
task.code(`public ${fkColumn}?: number;
public ${lowerModelName}?: ${modelName};
`);
task.desc("add column definition");
task.code(`${fkColumn}: {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: ${modelName},
    key: 'id',
  },
},`);
task.desc("add belongsTo relation");
task.code(`${referenceModelName}.belongsTo(${modelName}, {
  foreignKey: '${fkColumn}',
  as: '${lowerModelName}',
});`);

task.file("tests/integration/factory/definitions.ts");
task.desc("add export");
task.code(`export { default as ${modelName}Definitions } from './${lowerModelName}Definitions';`);

task.file("tests/integration/setup/clearDB.ts");
task.desc("add model to clearDB");
task.code(`m.${modelName}`);
