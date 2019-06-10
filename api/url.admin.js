module.exports = {
    LOGIN: () => '/api/auth/admin/login',
    LIST_PKGS: () => '/api/admin/component-packages',
    PKG_INFO: (packageId) => `/api/admin/component-package/${packageId}`,
    PKG_VERSIONS: (packageId) => `/api/admin/component-package/${packageId}/versions?pageSize=4&page=1`,
    UPLOAD_PKG: (packageId) => `/api/admin/component-package/${packageId}/version`
}