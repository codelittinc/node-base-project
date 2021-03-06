import { Action } from '../action';
import { readFileSync, writeFile } from 'fs';
import { compile } from 'handlebars';
import * as mkdirp from 'mkdirp';

export class Model extends Action {
  public do(): void {
    // init
    mkdirp.sync(`./src/models/${this.referenceModelName.toLowerCase()}`);

    // file name
    const modelFileName = `./src/models/${this.referenceModelName.toLowerCase()}/${
      this.modelName
    }Model.ts`;

    // template
    const modelFile = readFileSync(
      './scripts/generator/templates/model.template',
      'utf8',
    );
    const modelFileContent = compile(modelFile);

    // template processing
    const modelFileContentProcessed = modelFileContent({
      modelName: this.modelName,
      table: this.table,
    });

    writeFile(modelFileName, modelFileContentProcessed, err => {
      if (err) {
        this.log.err('unable to save model file');
        return;
      }
      this.log.line('written model file');
    });

    // manual tasks
    this.task.file('src/models/index.ts');
    this.task.desc('add export');
    this.task.code(
      `export { ${this.modelName} } from './office/${this.modelName}Model';`,
    );

    if (this.useForeign) {
      this.task.file(`src/models/${this.referenceModelName}Model.ts`);
      this.task.desc('add model import');
      this.task.code(`import { ${this.modelName} } from '@models';`);
      this.task.desc('add properties');
      this.task.code(`public ${this.fkColumn}?: number;
public ${this.baseName}?: ${this.modelName};
`);
      this.task.desc('add column definition');
      this.task.code(`${this.fkColumn}: {
  type: DataTypes.INTEGER,
  allowNull: true,
  references: {
    model: ${this.modelName},
    key: 'id',
  },
},`);
      this.task.desc('add belongsTo relation');
      this.task.code(`${this.referenceModelName}.belongsTo(${this.baseName}, {
  foreignKey: '${this.fkColumn}',
  as: '${this.baseName}',
});`);
    }
  }
}
