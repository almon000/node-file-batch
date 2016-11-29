let fs = require('fs')
let path = require("path")
let process = require('process')


// 文件遍历，为一切操作的基础方法
function traversal (dir, cb_isDir, cb_isFile) {
  let absDir = path.resolve(dir)
  fs.readdirSync(absDir).forEach(file => {
    let pathname = path.join(absDir, file)
    if (fs.statSync(pathname).isDirectory()) {
      // 文件夹操作
      // stop： 是否停止在该文件夹遍历
      // 回调函数中不返回或返回false，继续遍历该文件夹。
      // 回调函数中返回true, 停止遍历该文件夹。例如回调函数要删除文件夹时。
      // 回调函数中返回字符串，会按返回值进行遍历。例如回调函数更改了文件夹名称时。
      let stop = false
      if (cb_isDir) stop = cb_isDir(pathname)
      if(!stop) {
        // 如果停止标志返回false，则继续遍历
        traversal(pathname, cb_isDir, cb_isFile)
      } else if (typeof stop === 'string') {
        // 如果停止标志返回了新的路径，则遍历新的路径
        traversal(path.resolve(stop), cb_isDir, cb_isFile)
      }
    } else {
      // 文件操作
      if(cb_isFile) cb_isFile(pathname)
    }
  })
}

// 复制文件
function copy (src, dest) {
  // 内部函数，对指定路径的复制操作
  function _copy(pathname) {
    let destPath = path.resolve(pathname)
        .replace(path.resolve(src), path.resolve(dest))
    if (fs.statSync(pathname).isFile()) {
      // 如果原路径是文件，直接复制
      console.log(`正在复制文件${destPath} ...`)

      // 如果复制的源对象就是文件，那么把文件名提取出来放到destPath最后
      // 因为这种情况下destPath 返回的是此文件所在的文件夹
      if (src === pathname) fs.writeFileSync(path.join(destPath, path.basename(src)))

      // 否则正常写文件
      else fs.writeFileSync(destPath)
    } else {
      // 如果原路径是文件夹，检测是否在目标路径存在
      // 若不存在则新建文件夹，否则不做任何事情
      try {
        fs.statSync(destPath)
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log(`正在创建文件夹${destPath} ...`)
          fs.mkdirSync(destPath)
        }
        else console.error(err)
      }
    }
  }

  // copy函数主体
  if (fs.statSync(src).isDirectory()) traversal(src, _copy, _copy)
  else _copy(src)
}

// 清除指定目录下的所有文件（不删除目录）
function clear(src) {
  traversal(src, null, pathname => {
    console.log(`正在删除文件${pathname} ...`)
    fs.unlinkSync(pathname)
  })
  traversal(src, pathname => {
    console.log(`正在删除文件夹${pathname} ...`)
    fs.rmdirSync(pathname)
    return true
  }, null)
}

// 运行时主函数
// 命令文本
let com = {
  copy: 'copy',
  clear: 'clear'
}

// 外部config文件
let config = null

!(function () {
  let help = [
    `${com.copy} <src> <dist>     复制src目录下所有内容至dist目录\r\n`,
    `${com.copy} -conf <config>   按照指定config文件操作\r\n`,
    `${com.clear} <src>           删除指定目录下所有内容，不会删除目录本身\r\n`,
    `${com.clear} -conf <config>  按照指定config文件操作\r\n`
  ]
  if (typeof process.argv[2] === 'undefined') {
    console.log(`可使用的操作: \r\n`)
    help.forEach(text => console.log(text))
  } else {
    switch(process.argv[2]) {
      case com.copy:
        if (process.argv[3] && process.argv[4]) {
          if (process.argv[3] === '-conf') {
            config = require(path.resolve(process.cwd(), process.argv[4]))
            for (let i in config.copySrc) {
              copy(config.copySrc[i], config.copyDest[i])
            }
          } else {
            copy(process.argv[3], process.argv[4])
          }
        } else {
          console.log(`用法：\r\n${help[0]}${help[1]}`)
        }
        break
      case com.clear:
        if (process.argv[3]) {
          if (process.argv[3] === '-conf') {
            if (process.argv[4]) {
              config = require(path.resolve(process.cwd(), process.argv[4]))
              for (let i in config.clearSrc) {
                clear(config.clearSrc[i])
              }
            } else {
              console.log(`用法：\r\n${help[2]}${help[3]}`)
            }
          } else {
            clear(process.argv[3])
          }
        } else {
          console.log(`用法：\r\n${help[2]}${help[3]}`)
        }
        break
      default:
        console.log(`可使用的操作: \r\n`)
        help.forEach(text => console.log(text))
        break
    }
  }
})()


module.exports = {
  traversal: traversal,
  copy: copy,
  clear: clear
}
