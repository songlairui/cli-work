var _ = require('lodash')
var chalk = require('chalk')
var config = require('../state')
var checkPkgInfo = require('../pre-cmds/checkPkgInfo')
var { getCurrentIds } = require('../utils/get-current-ids')
var api = require('../api/admin')

module.exports = async function main() {
    var { pkgInfo } = await checkPkgInfo()
    var currentEnv = config.get('current-env')
    var CONFIG_KEY = `remote-package-ids_${pkgInfo.name}`

    var currentIds = await getCurrentIds()
    if (!_.isEmpty(currentIds)) {
        console.group('当前组件包 PaaS 平台 id:')
        console.info('env \t package id')
        console.info('---- \t -------------------------------------')
        console.info(chalk.blue(Object.entries(currentIds).map(([env, pkgId]) => `${env}\t${pkgId}`).join('\n')))
        console.groupEnd()
    }

    var { items: [remotePkgInfo] = [] } = await api.listPkgs({ pageSize: 11, page: 1, name: pkgInfo.name })

    if (!remotePkgInfo) {
        throw new Error(`PaaS 平台不存在组件包 ${pkgInfo.name}， 先上传`)
    }
    if (currentIds[currentEnv] !== remotePkgInfo.id) {
        currentIds[currentEnv] = remotePkgInfo.id
        config.set(CONFIG_KEY, JSON.stringify(currentIds))
        console.info(chalk.yellow('\n已设置'), await getCurrentIds())
    } else {
        console.info(chalk.cyan('\n未变更'))
    }
}