#!/usr/bin/env node
var chalk = require('chalk')
var inquirer = require('inquirer')
var packZip = require('./commands/pack-zip')
var setFolder = require('./commands/set-folder')
var openWeb = require('./commands/open-web')
var loginWebAdmin = require('./commands/login-web')
var test = require('./commands/upload-pkg')
var switchEvn = require('./commands/switch-env')
var config = require('./state')

async function main() {
  const currentEnv = config.get('current-env')
  try {

    const { next } = await inquirer.prompt({
      type: 'list',
      name: 'next',
      message: '\n===MENU===',
      choices: [
        '压缩组件包',
        '打开网页',
        '设置文件夹',
        new inquirer.Separator(),
        '登陆管理后台',
        {
          name: `切换环境 [${currentEnv || ''}]`,
          value: 'switch-env'
        },
        'test']
    })

    switch (next) {
      case '压缩组件包':
        return packZip()
      case '设置文件夹':
        return setFolder()
      case '打开网页':
        return openWeb()
      case '登陆管理后台':
        return await loginWebAdmin()
      case 'switch-env':
        return await switchEvn()
      case 'test':
        return await test()
      default:
        console.info('~ End')
    }
  } catch (error) {
    console.info(chalk.yellow(error.message))
    console.info(error.stack.replace(/.*?\n+/, ''))
  }
}

main()
