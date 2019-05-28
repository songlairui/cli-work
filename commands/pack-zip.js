#!/usr/bin/env node
var path = require("path");
var inquirer = require("inquirer");
var checkPkgInfo = require("../pre-cmds/checkPkgInfo");

async function main() {
  // 检测当前目录存在 package.json
  var { cwd, pkgInfo } = await checkPkgInfo();
  var defaultFilename = `${pkgInfo.name}-${pkgInfo.version}.zip`;
  var { next, filename = defaultFilename } = await inquirer.prompt([
    {
      type: "list",
      message: `组件包:
${pkgInfo.name} ${pkgInfo.version}
LOCATED AT ${cwd}
创建压缩包 '${defaultFilename}'`,
      name: "next",
      choices: [
        {
          name: "压缩",
          value: "ahead"
        },
        {
          name: "自定义文件名",
          value: "change-file-name"
        },
        {
          name: "Abort",
          value: ""
        }
      ],
      default: 0
    },
    {
      type: "input",
      name: "filename",
      message: "自定义压缩包名",
      when: answer => {
        return answer.next === "change-file-name";
      }
    }
  ]);
  if (!path.extname(filename).startsWith(".")) {
    filename = `${filename}.zip`;
  }
  console.info(" next, filename", next, filename);
}

module.exports = main;
