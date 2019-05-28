#!/usr/bin/env node
var inquirer = require('inquirer')
var packZip = require('./commands/pack-zip')

async function main() {
    const { next } = await inquirer.prompt({
        type: 'list',
        name: 'next',
        message: 'DO?',
        choices: ['压缩组件包']
    })

    switch (next) {
        case '压缩组件包':
            packZip()
            break
        default:
            console.info('~ End')
    }
}

main()