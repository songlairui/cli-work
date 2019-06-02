#!/usr/bin/env node
var chalk = require('chalk')
var inquirer = require('inquirer')
var test = require('./commands/upload-pkg')
var { getCurrentId } = require('./utils/get-current-ids')

var config = require('./state')

async function main(action) {
  try {
    var currentEnv = config.get('current-env')
    var currentRemotePkgId = await getCurrentId()
    // const currentPackageId = 
    var choices = [
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
      {
        name: 'test',
        value: 'test'
      }]
    var currentAction = choices.find(choice => choice.value === action)
    if (action && currentAction) {
      console.info(chalk.yellow(`\nACTION:\t${currentAction.name}\n`))
    } else {
      const { next } = await inquirer.prompt({
        type: 'list',
        name: 'next',
        message: '\n===MENU===',
        choices
      })
      action = next
    }
    switch (action) {
      case 'pack-zip':
      case 'set-folder':
      case 'open-web':
      case 'login-web-admin':
      case 'switch-env':
      case 'set-package-id':
        return await require(`./commands/${action}`)()
      case 'test':
        return await test()
      default:
        console.info('~ End')
    }
  } catch (error) {
    console.info(chalk.yellow(error.message))
    if (error.next) {
      main(error.next)
    } else {
      console.info(error.stack.replace(/.*?\n+/, ''))
    }
  }
}

main()
