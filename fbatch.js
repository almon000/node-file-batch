var fs = require('fs')
var path = require("path")
var process = require('process')


// 文件遍历，为一切操作的基础方法
// traverse files, base function
function traversal (dir, cb_isDir, cb_isFile) {
  fs.readdirSync(dir).forEach(file => {
    var pathname = path.join(dir, file)
    if (fs.statSync(pathname).isDirectory()) {
      if(cb_isDir) cb_isDir(pathname)
      traversal(pathname, cb_isDir, cb_isFile)
    } else {
      if(cb_isFile) cb_isFile(pathname)
    }
  })
}

// 复制文件
// Copy files
function copy (src, dest) {
  function _copy(pathname) {
    var destPath = path.join(dest, path.basename(pathname))
    console.log(fs.statSync(src).isFile(), src)
    if (fs.statSync(src).isFile()) {
      fs.writeFileSync(destPath)
    }
    else fs.stat(destPath, (err, stat) => {
      if (err) {
        if (err.code === 'ENOENT') fs.mkdirSync(destPath)
        else console.error(err)
      }
    })
  }

  if (fs.statSync(src).isDirectory()) traversal(src, _copy, _copy)
  else _copy(src)
}

module.exports = { traversal: traversal, copy: copy }
