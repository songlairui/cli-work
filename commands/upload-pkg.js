var fs = require('fs-extra')
var inquirer = require('inquirer')
var semver = require('semver')
var retrivePkg = require('./retrive-pkg')
var checkPkgInfo = require('../pre-cmds/checkPkgInfo')
var { xhttp } = require('../utils/xhttp')
var { getCurrentId } = require('../utils/get-current-ids')
var gitLog = require('../utils/git-log')
var config = require('../state')

module.exports = async function main(packageId) {
    var { cwd, pkgInfo: localPkg } = await checkPkgInfo()

    var outputFile = config.get(`zip_${localPkg.name}`)
    if (!outputFile || !fs.existsSync(outputFile)) {
        throw new Error(`outputFile not found, ${outputFile || '未打包'}`)
    }

    var currentPkgId = await getCurrentId()
    if (!currentPkgId) {
        var next = new Error('未设置PaaS平台 package id')
        next.next = 'set-package-id'
        throw next
    }
    var { pkgInfo = {}, lastVersion = {} } = await retrivePkg(packageId)

    if (pkgInfo.name !== localPkg.name) {
        throw new Error(`组件包名不匹配 ${pkgInfo.name} !== ${localPkg.name}`)
    }
    var { lastCommit, version: remoteVersion, is_built_in, is_nightly, min_engine_version, max_engine_version } = lastVersion

    var remark = await gitLog({ from: lastCommit, branch: 'xx' })
    var version
    if (remoteVersion) {
        version = (await inquirer.prompt([{
            type: 'list',
            name: 'version',
            message: `要上传的版本号 remote: ${remoteVersion}`,
            default: 0,
            choices: ['patch', 'minor', 'major'].map(v => {
                var nextVersion = semver.inc(remoteVersion, v)
                return {
                    value: nextVersion,
                    name: `${v}  ${nextVersion}`
                }
            })
        }])).version
    } else {
        version = '0.0.1'
    }

    console.info('log\n', remark, '\n', version, is_built_in, is_nightly, min_engine_version, max_engine_version)
}