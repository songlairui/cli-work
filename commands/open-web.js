var inquirer = require('inquirer')
var opn = require('better-opn');

var prompts = [
    {
        type: 'list',
        message: '打开页面(paas-test)',
        name: 'url',
        choices: [
            {
                name: '组件包',
                value: 'https://paas-test.mypaas.com.cn/pages/admin.html#/package'
            },
            {
                name: '基础组件包(paas-component-basic)',
                value: 'https://paas-test.mypaas.com.cn/pages/admin.html#/package-info/39eb2a2a-9502-1b6c-2fd3-dce236b9c4a7'
            },
            {
                name: '数据组件包(paas-component-data)',
                value: 'https://paas-test.mypaas.com.cn/pages/admin.html#/package-info/39edd244-133d-04f6-2361-1eda6ac11a59'
            },
        ]
    }
]

module.exports = async function main() {
    const { url } = await inquirer.prompt(prompts)
    if (url) {
        opn(url)
    }
}