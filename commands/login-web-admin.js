var inquirer = require('inquirer')
var axios = require('axios')
var config = require('../state')

var api = require('../api/admin')

async function askPwd() {
    const adminAccount = config.get('adminAccount') || ''
    const { account, password } = await inquirer.prompt([
        { type: 'input', name: 'account', message: 'account', default: adminAccount },
        { type: 'password', name: 'password', message: 'password' },
    ])
    return { account, password }
}

async function snapAuthCookie(refresh) {
    const cookies = config.get('adminCookieSet')
    const adminToken = config.get('adminToken')
    if (!refresh && cookies && adminToken) {
        return
    }
    const { account, password } = await askPwd()
    if (account) {
        config.set('adminAccount', account)
    }
    if (!account || !password) {
        throw new Error('用户名或密码为空')
    }
    const { status, headers, data } = await api.login({
        account, password
    })
    const { 'set-cookie': cookieToSet = '' } = headers
    config.set('adminCookieSet', JSON.stringify(cookieToSet))
    console.info('get', config.get('adminCookieSet'))
    if (data.code === 0) {
        config.set('adminIdentity', JSON.stringify(data.data))
        config.set('token', JSON.stringify(data.data.token))
    }
}

module.exports = async function main() {
    await snapAuthCookie(true)
}