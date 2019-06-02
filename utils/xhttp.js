var axios = require('axios')
var chalk = require('chalk')
var configStore = require('../state')


var xhttp = axios.create()

xhttp.interceptors.request.use(config => {
    try {
        const cookies = JSON.parse(configStore.get('adminCookieSet') || '[]')

        config.headers = {
            ...config.headers,
            cookie: cookies.join('')
        }
    } catch (error) {
        console.info('interceptors fail:', chalk.red(`${error.message}`))
    }
    return config
})


xhttp.interceptors.response.use(response => {
    const res = response.data
    if (res.code === 0 || res.result) {
        return res.data
    }
    return Promise.reject({
        data: res.data,
        message: res.msg,
        code: res.code,
        toString() {
            return this.message
        }
    })
}, error => {
    if (!error.response) {
        return Promise.reject({
            message: '网络连接失败',
            code: -1,
            toString() {
                return this.message
            }
        })
    }
    return Promise.reject(error)
});



module.exports = { xhttp }