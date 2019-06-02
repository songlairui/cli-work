var retrivePkg = require('./retrive-pkg')
var checkPkgInfo = require('../pre-cmds/checkPkgInfo')
var { xhttp } = require('../utils/xhttp')


module.exports = async function main(packageId) {
    var { cwd, pkgInfo: localPkg } = await checkPkgInfo()
    var { pkgInfo = {}, lastVersion = {} } = await retrivePkg(packageId)

    if (pkgInfo.name !== localPkg.name) {
        throw new Error(`组件包名不匹配 ${pkgInfo.name} !== ${localPkg.name}`)
    }
}