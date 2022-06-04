import { chalk } from 'zx'

class Collect {
  #installed = new Set()
  #failed = new Set()
  #skipped = new Set()

  getInstalled() {
    return this.#installed
  }

  setInstalled(name) {
    this.#installed.add(name)
  }

  getFailed() {
    return this.#failed
  }

  setFailed(name) {
    this.#failed.add(name)
  }

  getSkipped() {
    return this.#skipped
  }

  setSkipped(name) {
    return this.#skipped.add(name)
  }
}

export const collect = new Collect()

export const logCollectInfo = () => {
  const checkNone = (set) => {
    return set.size > 0 ? [...set].join(', ') : '<empty>'
  }

  console.log(chalk.yellow('\n✨ The result for adorable you.\n'))
  console.info(`${chalk.cyan(' 1. installed (congrats!):')} ${checkNone(collect.getInstalled())}`)
  console.error(`${chalk.red(' 2. failed (oops~):')} ${checkNone(collect.getFailed())}`)
  console.warn(`${chalk.dim(' 3. skipped (already.):')} ${checkNone(collect.getSkipped())}`)
  console.log('\n')
}
