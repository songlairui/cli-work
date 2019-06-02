var config = require('../state')
var checkPkgInfo = require('../pre-cmds/checkPkgInfo')

module.exports = async function main() {
    var { pkgInfo } = await checkPkgInfo()
    var CONFIG_KEY = `remote-package-ids_${pkgInfo.name}`
    var currentIds
    try {
        currentIds = JSON.parse(config.get(CONFIG_KEY) || '{}')
    } catch (error) {
        currentIds = {}
        //
    }
    return currentIds
}