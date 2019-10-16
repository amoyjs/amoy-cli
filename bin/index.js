#!/usr/bin/env node
const commander = require('commander');
const init = require('./init')

commander
    .version(require('../package').version);

commander
    .usage('$ amoy init');

commander
    .command('init')
    .description('create a new game project by amoy-cli.')
    .action(init);

commander
    .command('*')
    .action(() => {
        commander.help();
    })

if (!commander.parse(process.argv).args.length) commander.help();