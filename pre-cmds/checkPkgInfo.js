var path = require("path");
var pkgUp = require("pkg-up");
var readPkg = require("read-pkg");

async function main() {
  const pkgFile = await pkgUp();
  const cwd = path.resolve(pkgFile, "..");
  const pkgInfo = await readPkg({ cwd });
  return {
    cwd,
    pkgInfo
  };
}

module.exports = main;
