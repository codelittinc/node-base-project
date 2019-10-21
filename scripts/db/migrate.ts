import * as path from 'path';
import getMigrationsConfig from '@config/initializers/migrations';
import { getConfig } from '@config';
const child_process = require('child_process');

function logUmzugEvent(eventName) {
  return function(name) {
    console.log(`${name} ${eventName}`);
  };
}

async function processMigration() {
  const umzug = getMigrationsConfig();

  umzug.on('migrating', logUmzugEvent('migrating'));
  umzug.on('migrated', logUmzugEvent('migrated'));
  umzug.on('reverting', logUmzugEvent('reverting'));
  umzug.on('reverted', logUmzugEvent('reverted'));

  async function cmdStatus() {
    let executed = await umzug.executed();
    let pending = await umzug.pending();

    executed = executed.map(m => {
      m.name = path.basename(m.file, '.js');
      return m;
    });

    pending = pending.map(m => {
      m.name = path.basename(m.file, '.js');
      return m;
    });

    const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
    const status = {
      current: current,
      executed: executed.map(m => m.file),
      pending: pending.map(m => m.file)
    };

    console.log(JSON.stringify(status, null, 2));

    return { executed, pending };
  }

  function cmdMigrate() {
    return umzug.up();
  }

  async function cmdMigrateNext() {
    const result = await cmdStatus();
    if (result.pending.length === 0) {
      return Promise.reject(new Error('No pending migrations'));
    }
    const next = result.pending[0].name;
    return umzug.up({ to: next });
  }

  function cmdReset() {
    return umzug.down({ to: 0 });
  }

  async function cmdResetPrev() {
    const result = await cmdStatus();
    const { executed } = result;
    if (executed.length === 0) {
      return Promise.reject(new Error('Already at initial state'));
    }
    const prev = executed[executed.length - 1].name;
    return umzug.down({ to: prev });
  }

  function cmdHardReset() {
    const DB_NAME = getConfig().database.databaseName;
    const DB_USER = getConfig().database.user;

    return new Promise((resolve, reject) => {
      setImmediate(() => {
        try {
          console.log(`dropdb ${DB_NAME}`);
          child_process.spawnSync(`dropdb ${DB_NAME}`);
          console.log(`createdb ${DB_NAME} --username ${DB_USER}`);
          child_process.spawnSync(`createdb ${DB_NAME} --username ${DB_USER}`);
          resolve();
        } catch (e) {
          console.log(e);
          reject(e);
        }
      });
    });
  }

  const cmd = process.argv[2].trim();
  let executedCmd;

  console.log(`${cmd.toUpperCase()} BEGIN`);
  switch (cmd) {
    case 'status':
      executedCmd = cmdStatus();
      break;

    case 'up':
    case 'migrate':
      executedCmd = cmdMigrate();
      break;

    case 'next':
    case 'migrate-next':
      executedCmd = cmdMigrateNext();
      break;

    case 'down':
    case 'reset':
      executedCmd = cmdReset();
      break;

    case 'prev':
    case 'reset-prev':
      executedCmd = cmdResetPrev();
      break;

    case 'reset-hard':
      executedCmd = cmdHardReset();
      break;

    default:
      console.log(`invalid cmd: ${cmd}`);
      process.exit(1);
  }

  try {
    await executedCmd;
    const doneStr = `${cmd.toUpperCase()} DONE`;
    console.log(doneStr);
    console.log('='.repeat(doneStr.length));
  } catch (err) {
    const errorStr = `${cmd.toUpperCase()} ERROR`;
    console.log(errorStr);
    console.log('='.repeat(errorStr.length));
    console.log(err);
    console.log('='.repeat(errorStr.length));
  } finally {
    if (cmd !== 'status' && cmd !== 'reset-hard') {
      await cmdStatus();
    }
    process.exit(0);
  }
}

processMigration();
