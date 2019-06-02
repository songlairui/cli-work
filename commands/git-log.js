var chalk = require('chalk')
var simpleGit = require('simple-git/promise')
var defaultDevBranch = 'develop'

module.exports = async function main({ from, to, cwd, branch } = {}) {
    var devBranch = branch || defaultDevBranch
    var git = simpleGit()
    if (cwd) {
        git.cwd(cwd)
        console.info(chalk.yellow(`cwd: ${cwd} `))
    }
    var logOptions = {
        '--format': '%h %s'
    }
    var localBranches = (await git.branchLocal()).all
    if (!localBranches.includes(devBranch)) {
        console.info(chalk.cyan(`没有 ${devBranch} 分支`))
    } else {
        logOptions[devBranch] = true

    }
    if (from && to) {
        logOptions[`${from}...${to}`] = true
    } else {
        logOptions['-5'] = true
    }
    var data = await git.log(logOptions)
    return data.latest.hash
}