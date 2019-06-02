var config = require('../state')
var { HOSTS } = require('../constant')

var getHost = () => HOSTS[config.get('current-env')]

module.exports = {
    getHost
}