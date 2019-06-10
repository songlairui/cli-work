var axios = require('axios')
var URLS = require('./url.admin')
var { getHost } = require('../utils/getters')
var { xhttp } = require('../utils/xhttp')

axios.defaults.baseURL = getHost()
xhttp.defaults.baseURL = getHost()

module.exports = {
    login(payload) {
        return axios.post(URLS.LOGIN(), payload)
    },
    listPkgs(params) {
        return xhttp.get(URLS.LIST_PKGS(), { params })
    },
    pkgInfo(packageId) {
        return xhttp.get(URLS.PKG_INFO(packageId))
    },
    pkgVersions(packageId) {
        return xhttp.get(URLS.PKG_VERSIONS(packageId))
    },
    uploadPkg(packageId, ...payload) {
        return xhttp.post(URLS.UPLOAD_PKG(packageId), ...payload)
    }
}