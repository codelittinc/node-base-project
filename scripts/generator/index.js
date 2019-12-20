const fs = require("fs");
const handlebars = require('handlebars');


// Get base model name and reference name from argument
// TODO: Modular cli arguments based on flags
if(process.argv.length < 4){
  console.error("Please specify your model name and you reference model name");
  console.error("npm run generate:model -- [modelName] [modelReference]");
  return;
}
const baseName = process.argv[2];
const referenceModelName = process.argv[3];


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
const table = `${baseName.charAt(0).toLowerCase() + baseName.slice(1)}s`;
const modelName = `${baseName.charAt(0).toUpperCase() + baseName.slice(1) }`;
const lowerModelName = `${baseName.charAt(0).toLowerCase() + baseName.slice(1)}`;

// TODO: Populate variables
const seedCountVariableName = "TODO_COUNT_SEED";
const fkColumn = "todoId";


// file names
const modelFileName = `./src/models/${referenceModelName.toLowerCase()}/${modelName}Model.ts`;

// templates
const modelFile = fs.readFileSync(
    './scripts/generator/templates/model.template',
    'utf8',
);
let modelFileContent = handlebars.compile(modelFile);


// Templates processing
modelFileContent = modelFileContent({modelName: modelName, table: table});

// Generate files
fs.writeFile(modelFileName, modelFileContent, err => {
    if (err) {
        log.err("unable to save model file");
    } else {
        log.line("written model file");
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
