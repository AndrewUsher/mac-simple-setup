import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkgInfo = require('../package.json')
const { name, version } = pkgInfo

export { name, version }
