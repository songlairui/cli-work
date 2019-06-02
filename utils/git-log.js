var chalk = require('chalk')
var simpleGit = require('simple-git/promise')
var defaultDevBranch = 'develop'
var { extractCommitHash } = require('./str')

const gitLog = async function ({ from, to = 'HEAD', cwd, branch } = {}) {
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
    if (from) {
        logOptions[`${from}...${to}`] = true
    } else {
        logOptions['-2'] = true
    }
    var data = await git.log(logOptions)
    return data.latest.hash
}

let lastHash = ''

const getLastHash = async function ({ branch = '...' } = {}) {
    if (!lastHash) {
        var logs = await gitLog({ branch })
        lastHash = extractCommitHash(logs)
    }
    return lastHash
}

module.exports = {
    gitLog,
    getLastHash
}