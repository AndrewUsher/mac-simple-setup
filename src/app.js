import { chalk } from 'zx'
import ora from 'ora'
import { collect, logCollectInfo } from './collect.js'
import { promisifyExec } from './utils.js'

const oraInst = ora('installing...')

const apps = [
  { brewName: 'google-chrome', appName: 'Google Chrome.app' },
  { brewName: 'lark', appName: 'Lark.app' },
  { brewName: 'visual-studio-code', appName: 'Visual Studio Code.app' },
  // { brewName: 'iterm2', appName: 'iTerm.app' },
  { brewName: 'warp', appName: 'warp.app' },
  { brewName: 'figma', appName: 'Figma.app' },
  { brewName: 'postman', appName: 'Postman.app' },
  { brewName: 'docker', appName: 'Docker.app' },
  { brewName: 'raycast', appName: 'Raycast.app' },
  { brewName: 'tweeten', appName: 'Tweeten.app' },
]

async function checkAppInstalledByBrew(app) {
  let installedByBrew = false
  let existedInApplicationDir = false

  const bst = await promisifyExec(`brew list --cask`)
  installedByBrew = (bst || '').includes(app.brewName)

  if (!installedByBrew) {
    const ast = await promisifyExec(`ls /Applications`)
    existedInApplicationDir = (ast || '').includes(app.appName)
  }

  return installedByBrew || existedInApplicationDir
}

async function abInstall(app) {
  const installed = await checkAppInstalledByBrew(app)
  if (installed) {
    collect.setSkipped(app.brewName)
    return
  }

  try {
    console.log(chalk.blue(`\ninstall ${app.appName}...`))
    await promisifyExec(`brew install --cask ${app.brewName}`)
    collect.setInstalled(app.brewName)
  } catch (error) {
    collect.setFailed(app.brewName)
  }
}

export async function installApps() {
  while (apps.length) {
    const app = apps.shift()
    oraInst.start(`install ${app.brewName}`)

    await abInstall(app)
    oraInst.succeed('processed ' + app.brewName)
  }
  oraInst.stop()
  logCollectInfo()
}

export const listAllApps = () => {
  console.log(
    `\n${chalk.blue(
      'mac-simple-setup command: `mac-simple-setup use app` will install below apps:'
    )}`
  )
  console.table(apps)
}
