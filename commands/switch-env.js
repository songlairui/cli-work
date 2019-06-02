var config = require('../state')
var inquirer = require('inquirer')

module.exports = async function main() {
    const currentEnv = config.get('current-env')
    const choices = [
        { name: '测  试\tpaas-test', value: 'test' },
        { name: '生  产\tpaas.mypaas.com.cn', value: 'prod' },
        { name: '预发布\tpaas-beta', value: 'beta' },
        { name: '开  发\tpaas-dev', value: 'dev' },
    ]
    const currentIndex = choices.findIndex(item => item.value === currentEnv)
    const currentChoice = choices[currentIndex] || {}
    const { env } = await inquirer.prompt({
        choices,
        name: 'env',
        type: 'list',
        message: `切换环境 [${currentChoice.name || '-'}]`,
        default: currentIndex
    })
    config.set('current-env', env)
}