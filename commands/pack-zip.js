#!/usr/bin/env node
var fs = require('fs')
var path = require('path')
var inquirer = require('inquirer')
var execa = require('execa')
var checkPkgInfo = require('../pre-cmds/checkPkgInfo')
var config = require('../state')
var { getLastHash } = require('../utils/git-log')

function getOutputDir(fallback = process.cwd()) {
  var outDir = config.get('zip-out')
  return fs.existsSync(outDir) && fs.statSync(outDir).isDirectory()
    ? outDir
    : fallback
}

async function main() {
  // 检测当前目录存在 package.json
  var { cwd, pkgInfo } = await checkPkgInfo()
  var outputDir = getOutputDir()
  var hash = await getLastHash()
  var defaultFilename = `${pkgInfo.name}-${pkgInfo.version}-${hash}.zip`
  var { next, filename = defaultFilename } = await inquirer.prompt([
    {
      type: 'list',
      message: `组件包:
${pkgInfo.name} ${pkgInfo.version}
LOCATED AT ${cwd}, 打包至： ${outputDir}
创建压缩包 ' ${path.join(outputDir, defaultFilename)} '`,
      name: 'next',
      choices: [
        {
          name: '压缩',
          value: 'ahead'
        },
        {
          name: '自定义文件名',
          value: 'change-file-name'
        },
        {
          name: 'Abort',
          value: ''
        }
      ],
      default: 0
    },
    {
      type: 'input',
      name: 'filename',
      default: defaultFilename,
      message: '自定义压缩包名',
      when: answer => {
        return answer.next === 'change-file-name'
      }
    }
  ])
  if (next) {
    if (!path.extname(filename).startsWith('.')) {
      filename = `${filename}.zip`
    }
    filename = filename.replace(/\s/g, '-')
    const outputFile = path.join(outputDir, filename)
    // `7z a -tzip ${filename} ./* -x!.git -x!*.zip`,
    const { stdout: zipOut } = await execa.shell(
      `git archive -o ${outputFile} HEAD`,
      { cwd }
    )
    config.set(`zip_${pkgInfo.name}`, outputFile)
    console.info('压缩', zipOut, '完成', outputFile)
  }
}

module.exports = main
