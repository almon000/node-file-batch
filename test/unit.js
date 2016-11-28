var fbatch = require('../fbatch')

// 测试 traversal 是否正常工作
console.log(__dirname)
fbatch.traversal(__dirname,
  pathname => { console.log('Directory: ', pathname) },
  pathname => { console.log('File:', pathname) })
fbatch.copy('./src', './dest')
