var { xhttp } = require('../utils/xhttp')

module.exports = async function main(packageId = '39edd244-133d-04f6-2361-1eda6ac11a59') {
    if (!packageId || typeof packageId !== 'string') {
        throw new Error(`packageId error: ${packageId}`)
    }
    var infoUrl = `https://paas-test.mypaas.com.cn/api/admin/component-package/${packageId}`
    var versionUrl = `${infoUrl}/versions?pageSize=4&page=1`
    var [pkgInfo, pkfVersions] = await Promise.all([infoUrl, versionUrl].map(url => xhttp(url)))

    var { items: [lastVersion = {}] = [] } = pkfVersions
    const { id, remark = '' } = lastVersion
    if (!id) {
        console.info('没有上一个版本')
        return {}
    }
    const lastCommit = remark.split(/\s+/).find(tmp => /[a-z0-9]{7}/.test(tmp)) // 短 commit

    return { pkgInfo, lastVersion: { ...lastVersion, lastCommit } }

}