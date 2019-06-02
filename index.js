#!/usr/bin/env node
var chalk = require('chalk')
var inquirer = require('inquirer')
var test = require('./commands/upload-pkg')
var { getCurrentId } = require('./utils/get-current-ids')
var checkPkgInfo = require('./pre-cmds/checkPkgInfo')
var config = require('./state')

async function main(action) {
  try {
    var { cwd, pkgInfo: localPkg } = await checkPkgInfo()

    var currentOutputFile = config.get(`zip_${localPkg.name}`)
    var currentEnv = config.get('current-env')
    var currentRemotePkgId = await getCurrentId()
    // const currentPackageId = 
    var choices = [
      {
        name: `压缩组件包 [${cwd}]`,
        value: 'pack-zip'
      },
      {
        name: `上传组件包 [${currentOutputFile}]`,
        value: 'upload-pkg'
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
    // trace-the-log

    switch (action) {
      case '':
        throw new Error('no ACTION')
      case 'test':
        return await test()
      case 'pack-zip':
      case 'set-folder':
      case 'open-web':
      case 'login-web-admin':
      case 'switch-env':
      case 'set-package-id':
      default:
        return await require(`./commands/${action}`)()
    }
  } catch (error) {
    console.info(chalk.yellow(error.message))
    if (error.next) {
      return main(error.next)
    } else {
      console.info(error.stack.replace(/.*?\n+/, ''))
    }
  }
  process.exit(0)
}

main()
