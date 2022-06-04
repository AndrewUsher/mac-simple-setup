import { chalk, which } from 'zx'
import ora from 'ora'
import { echo } from 'zx/experimental'
import { collect, logCollectInfo } from './collect.js'
import { promisifyExec } from './utils.js'

const oraInst = ora('process misc...')

async function installOhMyZsh() {
  const stdout = await which('zsh')
  if (stdout.includes('/bin/zsh')) {
    collect.setSkipped('oh-my-zsh')
    return
  }

  try {
    echo(chalk.blue('\ninstall oh-my-zsh...'))
    await promisifyExec(
      `sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"`
    )

    // add oh-my-zsh plugins
    await addZshPlugins()

    // set homebrew path
    await promisifyExec`echo "export PATH=/opt/homebrew/bin:$PATH" >> ~/.zshrc`
    // set git language
    await promisifyExec`echo "alias git='LANG=en_GB git'" >> ~/.zshrc`

    await promisifyExec(`source ~/.zshrc`)

    collect.setInstalled('oh-my-zsh')
  } catch (error) {
    collect.setFailed('oh-my-zsh')
  }
}

async function addZshPlugins() {
  // install the plugin for zsh-autosuggestions
  echo(chalk.blue('\nadd plugin zsh-autosuggestions...'))
  await promisifyExec(
    `git clone https://github.com/zsh-users/zsh-autosuggestions ~/.zsh/zsh-autosuggestions`
  )
  await promisifyExec(
    `echo "source ~/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh" >> ~/.zshrc`
  )

  // install the plugin for zsh-syntax-highlighting
  echo(chalk.blue('\nadd plugin zsh-syntax-highlighting...'))
  await promisifyExec(
    `git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting`
  )
  await promisifyExec(
    `echo "source ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> ~/.zshrc`
  )
}

async function installAutoJump() {
  const installed = await whichInstalled('autojump')
  if (installed) {
    collect.setSkipped('autojump')
    return
  }

  try {
    await promisifyExec(`brew install autojump`)
    collect.setInstalled('autojump')
  } catch (error) {
    collect.setFailed('autojump')
  }
}

async function installHttpServer() {
  const installed = await whichInstalled('http-server')
  if (installed) {
    collect.setSkipped('http-server')
    return
  }

  try {
    await promisifyExec(`brew install http-server`)
    collect.setInstalled('http-server')
  } catch (error) {
    collect.setFailed('http-server')
  }
}

async function installJq() {
  const installed = await whichInstalled('jq')
  if (installed) {
    return
  }

  try {
    await promisifyExec(`brew install jq`)
    collect.setInstalled('jq')
  } catch (error) {
    collect.setFailed('jq')
  }
}

async function installZx() {
  const installed = await whichInstalled('zx')
  if (installed) {
    return
  }

  try {
    await promisifyExec(`npm install -g zx`)
    collect.setInstalled('zx')
  } catch (error) {
    collect.setFailed('zx')
  }
}

async function whichInstalled(shellName, appName) {
  const stdout = await which(shellName).catch(() => '')

  if (stdout.includes('/bin/' + shellName)) {
    collect.setSkipped(appName || shellName)
    return true
  }
  return false
}

const misc = new Set()

misc.add({
  name: 'oh-my-zsh',
  desc: 'install zsh and set some plugins: <autosuggestions|highlight...>.',
  install: installOhMyZsh,
})

misc.add({
  name: 'zx',
  desc: 'fancy bash.',
  install: installZx,
})

misc.add({
  name: 'zsh-plugins',
  desc: 'should be used while zsh installed. plugins: <autosuggestions|highlight...>.',
  install: addZshPlugins,
})

misc.add({
  name: 'autojump',
  desc: 'j <short path>',
  install: installAutoJump,
})

misc.add({
  name: 'http-server',
  desc: 'http-server <path to folder>',
  install: installHttpServer,
})

misc.add({
  name: 'jq',
  desc: 'jq <filter>',
  install: installJq,
})

function listAllMisc() {
  echo(
    chalk.blue(
      '\nmac-simple-setup command: `mac-simple-setup use misc` will install all the following tools:'
    )
  )
  console.table([...misc].map((m) => ({ tool: m.name })))
}

async function installMisc() {
  const candidates = [...misc]
  oraInst.start()
  while (candidates.length) {
    const item = candidates.shift()
    oraInst.start(`install ${item.name}...`)
    await item.install()
    oraInst.succeed('processed ' + item.name)
  }
  oraInst.stop()
  logCollectInfo()
}

export { misc, listAllMisc, installMisc }
