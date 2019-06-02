var inquirer = require('inquirer')
var config = require('../state')
var { xhttp } = require('../utils/xhttp')
var checkPkgInfo = require('../pre-cmds/checkPkgInfo')
var getCurrentIds = require('../utils/get-current-ids')
var chalk = require('chalk')

module.exports = async function main() {
    var { pkgInfo } = await checkPkgInfo()
    var currentEnv = config.get('current-env')
    var url = `https://paas-test.mypaas.com.cn/api/admin/component-packages`
    var CONFIG_KEY = `remote-package-ids_${pkgInfo.name}`

    var currentIds = await getCurrentIds()

    console.group('当前组件包 PaaS 平台 id:')
    console.info('env \t package id')
    console.info('---- \t -------------------------------------')
    console.info(chalk.blue(Object.entries(currentIds).map(([env, pkgId]) => `${env}\t${pkgId}`).join('\n')))
    console.groupEnd()
    var { items: [remotePkgInfo] = [] } = await xhttp.get(url, { params: { pageSize: 11, page: 1, name: pkgInfo.name } })
    if (!remotePkgInfo) {
        throw new Error(`组件包${pkgInfo.name}不存在，或数据异常。 先上传`)
    }
    if (currentIds[currentEnv] !== remotePkgInfo.id) {
        currentIds[currentEnv] = remotePkgInfo.id
        config.set(CONFIG_KEY, JSON.stringify(currentIds))
        console.info(chalk.yellow('\n已设置'), await getCurrentIds())
    } else {
        console.info(chalk.cyan('\n未变更'))
    }
}