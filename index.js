#!/usr/bin/env node
var inquirer = require('inquirer')
var packZip = require('./commands/pack-zip')
var setFolder = require('./commands/set-folder')
var openWeb = require('./commands/open-web')

async function main() {
  const { next } = await inquirer.prompt({
    type: 'list',
    name: 'next',
    message: '\n===MENU===',
    choices: ['压缩组件包', '打开网页', '设置文件夹']
  })

  switch (next) {
    case '压缩组件包':
      return packZip()
    case '设置文件夹':
      return setFolder()
    case '打开网页':
      return openWeb()
    default:
      console.info('~ End')
  }
}

main()
