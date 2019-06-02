var { xhttp } = require('../utils/xhttp')
var { extractCommitHash } = require('../utils/str')

module.exports = async function main(packageId) {
    if (!packageId || typeof packageId !== 'string') {
        throw new Error(`packageId error: ${packageId}`)
    }
    var infoUrl = `https://paas-test.mypaas.com.cn/api/admin/component-package/${packageId}`
    var versionUrl = `${infoUrl}/versions?pageSize=4&page=1`
    var [pkgInfo, pkfVersions] = await Promise.all([infoUrl, versionUrl].map(url => xhttp(url)))

    var { items: [lastVersion = {}] = [] } = pkfVersions
    var { id, remark = '' } = lastVersion
    if (!id) {
        console.info('没有上一个版本')
        return {}
    }
    var lastCommit = extractCommitHash(remark)

    return { pkgInfo, lastVersion: { ...lastVersion, lastCommit } }

}