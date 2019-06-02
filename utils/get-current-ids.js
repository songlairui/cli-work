var config = require('../state')
var checkPkgInfo = require('../pre-cmds/checkPkgInfo')

const getCurrentIds = async function () {
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
const getCurrentId = async function (env = config.get('current-env')) {
    const currentIds = await getCurrentIds()
    return currentIds[env]
}
module.exports = {
    getCurrentIds,
    getCurrentId
}