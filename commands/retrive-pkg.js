var { xhttp } = require('../utils/xhttp')
var { extractCommitHash } = require('../utils/str')
var api = require('../api/admin')

module.exports = async function main(packageId) {
    if (!packageId || typeof packageId !== 'string') {
        throw new Error(`packageId error: ${packageId}`)
    }
    var [pkgInfo, pkfVersions] = await Promise.all([
        api.pkgInfo(packageId),
        api.pkgVersions(packageId)
    ])

    var { items: [lastVersion = {}] = [] } = pkfVersions
    var { id, remark = '' } = lastVersion
    if (!id) {
        console.info('没有上一个版本')
        return {}
    }
    var lastCommit = extractCommitHash(remark)

    return { pkgInfo, lastVersion: { ...lastVersion, lastCommit } }

}