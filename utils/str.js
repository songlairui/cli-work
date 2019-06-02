const extractCommitHash = remark => remark.split(/\s+/).find(tmp => /[a-z0-9]{7}/.test(tmp)) // 短 commit

module.exports = {
    extractCommitHash
}
