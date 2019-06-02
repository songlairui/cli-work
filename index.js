#!/usr/bin/env node
var chalk = require('chalk')
var inquirer = require('inquirer')
var test = require('./commands/upload-pkg')
var getCurrentIds = require('./utils/get-current-ids')

var config = require('./state')

async function main() {
  var currentEnv = config.get('current-env')
  var currentRemotePkgId = (await getCurrentIds())[currentEnv]
  // const currentPackageId = 
  try {

    const { next } = await inquirer.prompt({
      type: 'list',
      name: 'next',
      message: '\n===MENU===',
      choices: [
        {
          name: '压缩组件包',
          value: 'pack-zip'
        },
        {
          name: '打开组件包上传网页',
          value: 'open-web'
        },
        new inquirer.Separator(),
        {
          name: '设置输出文件夹',
          value: 'set-folder'
        },
        {
          name: '登陆管理后台',
          value: 'login-web-admin'
        },
        {
          name: `切换环境 [${currentEnv || '--'}]`,
          value: 'switch-env'
        },
        {
          name: `设置组件包id [${currentRemotePkgId || '--'}]`,
          value: 'set-package-id'
        },
        'test']
    })

    switch (next) {
      case 'pack-zip':
      case 'set-folder':
      case 'open-web':
      case 'login-web-admin':
      case 'switch-env':
      case 'set-package-id':
        return await require(`./commands/${next}`)()
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
