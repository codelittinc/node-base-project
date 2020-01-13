import { toCamelCase, toPascalCase } from './utils';
import { plural } from 'pluralize';

export interface Options {
  name: string;
  referenceName: string;
  customMigrationFileName?: string;
  userForeign?: boolean;
}

export abstract class Action {
  protected baseName;
  protected referenceModelName;
  protected migrationFileName;
  protected useForeign;

  protected log = {
    err: text => console.log('\x1b[34m%s\x1b[0m', `err: ${text}`),
    line: text => console.log('\x1b[32m%s\x1b[0m', `* ${text}`),
  };
  protected task = {
    file: t => console.log('\x1b[32m%s\x1b[0m', `* [TODO] ${t}`),
    desc: t => console.log('\x1b[33m%s\x1b[0m', '* * ' + t),
    code: t => console.log(t, '\n'),
  };

  protected table: string;
  protected fkColumn: string;
  protected modelName: string;

  constructor(opts: Options) {
    this.baseName = toCamelCase(opts.name);
    this.referenceModelName = opts.referenceName;
    this.migrationFileName = opts.customMigrationFileName;
    this.useForeign = opts.userForeign;
    this.table = plural(this.baseName);
    this.fkColumn = plural(this.baseName);
    this.modelName = toPascalCase(this.baseName);
  }
  public abstract do(): void;
}
