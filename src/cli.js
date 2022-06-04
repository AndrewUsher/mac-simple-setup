#!/usr/bin/env node
import { program } from 'commander'
import * as pkg from './pkg.js'
import { installApps, listAllApps } from './app.js'
import { misc, listAllMisc, installMisc } from './misc.js'
import { chalk } from 'zx'

program.name(pkg.name).version(pkg.version)

program
  .command('list')
  .description('list all will be installed.')
  .action(function () {
    listAllApps()
    listAllMisc()
  })

program
  .command('use')
  .argument('<type>', 'type of use [app|misc...], more list on above.')
  .description(
    `Install applications or misc. See more info by <mac-simple-setup use -h>.\n
    ${chalk.bold('mac-simple-setup use <type>')}\n
    ${chalk.blue(
      'app:'
    )} install applications, you can use 'mac-simple-setup list' to check app infos.
    ${chalk.blue(
      'misc:'
    )} install all plugins below, also you can use below type install one by one.
    ${[...misc].map((m) => chalk.blue(`${m.name}: `) + m.desc).join('\n    ')}
  `
  )
  .action(function (type) {
    switch (type) {
      case 'app':
        installApps()
        break
      case 'misc':
        installMisc()
        break
    }
  })

program.parse(process.argv)
