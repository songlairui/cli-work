var retrivePkg = require('./retrive-pkg')
var checkPkgInfo = require('../pre-cmds/checkPkgInfo')
var { xhttp } = require('../utils/xhttp')
var { getCurrentId } = require('../utils/get-current-ids')

module.exports = async function main(packageId) {
    var currentPkgId = await getCurrentId()
    if (!currentPkgId) {
        var next = new Error('未设置PaaS平台 package id')
        next.next = 'set-package-id'
        throw next
    }
    var { cwd, pkgInfo: localPkg } = await checkPkgInfo()
    var { pkgInfo = {}, lastVersion = {} } = await retrivePkg(packageId)

    if (pkgInfo.name !== localPkg.name) {
        throw new Error(`组件包名不匹配 ${pkgInfo.name} !== ${localPkg.name}`)
    }
}