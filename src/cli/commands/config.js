'use strict'

const debug = require('debug')
const log = debug('cli:config')
log.error = debug('cli:config:error')
module.exports = {
  command: 'config <key> [value]',

  description: 'Get and set IPFS config values',

  builder (yargs) {
    return yargs
      .commandDir('config')
      .options({
        bool: {
          type: 'boolean',
          default: false
        },
        json: {
          type: 'boolean',
          default: false
        }
      })
  },

  handler (argv) {
    if (argv._handled) return
    argv._handled = true

    const bool = argv.bool
    const json = argv.json
    const key = argv.key
    let value = argv.value

    if (!value) {
      // Get the value of a given key
      argv.ipfs.config.get(key, (err, value) => {
        if (err) {
          log.error(err)
          throw new Error('failed to read the config')
        }

        if (typeof value === 'object') {
          console.log(JSON.stringify(value, null, 2))
        } else {
          console.log(value)
        }
      })
    } else {
      // Set the new value of a given key

      if (bool) {
        value = (value === 'true')
      } else if (json) {
        try {
          value = JSON.parse(value)
        } catch (err) {
          log.error(err)
          throw new Error('invalid JSON provided')
        }
      }

      argv.ipfs.config.set(key, value, (err) => {
        if (err) {
          log.error(err)
          throw new Error('failed to read the config')
        }
      })
    }
  }
}
