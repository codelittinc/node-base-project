import * as cmd from 'commander';
import { Action, Options } from './action';
import { Migration } from './commands/migration';
import { Model } from './commands/model';
import { Test } from './commands/test';

cmd
  .version('0.0.1')
  .arguments('<name> <referenceName> [customMigrationFileName]')
  .description('Generate all files necessary to create a new model ')
  .option(
    '--foreign',
    'add this flag if your model uses constraints, based on referenceName',
  )
  .action(
    (
      name: string,
      referenceName: string,
      customMigrationFileName: string,
      cmdOpts,
    ) => {
      const opts: Options = {
        name: name,
        referenceName: referenceName,
        customMigrationFileName: customMigrationFileName,
        userForeign: !!cmdOpts.foreign,
      };

      const actions: Action[] = [
        new Model(opts),
        new Migration(opts),
        new Test(opts),
      ];
      actions.forEach(x => x.do());
    },
  );
cmd.parse(process.argv);
