import { Action } from '../action';
import { toPascalCase } from '../utils';

export class Test extends Action {
  public do(): void {
    const modelName = toPascalCase(this.baseName);

    this.task.file('tests/integration/factory/definitions.ts');
    this.task.desc('add export');
    this.task.code(
      `export { default as ${modelName}Definitions } from './${this.baseName}Definitions';`,
    );

    this.task.file('tests/integration/setup/clearDB.ts');
    this.task.desc('add model to clearDB');
    this.task.code(`m.${modelName}`);
  }
}
