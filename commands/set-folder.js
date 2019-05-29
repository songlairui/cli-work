var inquirer = require('inquirer')
var config = require('../state')

var setConfKey = async function(key) {
  const { value } = await inquirer.prompt([
    {
      type: 'input',
      name: 'value'
    }
  ])
  if (!value.trim()) {
    console.info('no change')
    return
  }
  config.set(key, value)
}

module.exports = async function main() {
  const { next } = await inquirer.prompt([
    {
      type: 'list',
      name: 'next',
      message: '设置参数',
      choices: [
        { value: 'zip-out', name: `zip-out [${config.get('zip-out')}]` },
        { value: '', name: 'continue..' }
      ]
    }
  ])
  switch (next) {
    case 'zip-out':
      await setConfKey(next)
      break
    case '':
    default:
      return await main()
  }
}
