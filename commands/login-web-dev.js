var inquirer = require('inquirer')
var config = require('../state')

var api = require('../api/dev')

async function askPwd() {
    const devAccount = config.get('devAccount') || ''
    const { account, password } = await inquirer.prompt([
        { type: 'input', name: 'account', message: 'account', default: devAccount },
        { type: 'password', name: 'password', message: 'password' },
    ])
    return { account, password }
}

async function snapAuthCookie(refresh) {
    const cookies = config.get('devCookieSet')
    const devToken = config.get('devToken')
    if (!refresh && cookies && devToken) {
        return
    }
    const { account, password } = await askPwd()
    if (account) {
        config.set('devAccount', account)
    }
    if (!account || !password) {
        throw new Error('用户名或密码为空')
    }
    const { status, headers, data } = await api.login({
        account, password
    })

    let { 'set-cookie': cookieToSet = '' } = headers
    if (!cookieToSet) {
        const { account: paas_name, token: paas_token, user_id, user_account_id, user_relation_role } = data.data || {}
        cookieToSet = [Object.entries({ paas_name, paas_token, user_id, user_account_id, user_relation_role }).reduce((str, [key, value]) => value ? `${str} ${key}=${value};` : str, '').trim()]
    }
    let cookiesToSet = JSON.stringify(cookieToSet)

    config.set('devCookieSet', cookiesToSet)
    if (data.code === 0) {
        config.set('devIdentity', JSON.stringify(data.data))
        config.set('devToken', JSON.stringify(data.data.token))
    }
}

module.exports = async function main() {
    await snapAuthCookie(true)
}