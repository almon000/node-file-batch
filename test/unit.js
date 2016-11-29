var fbatch = require('../fbatch')

// 测试 traversal 是否正常工作
console.log('开始遍历文件...')
fbatch.traversal(__dirname,
  pathname => { console.log('Directory: ', pathname) },
  pathname => { console.log('File:', pathname) })
console.log('遍历完成')

// 测试 copy 方法
fbatch.copy('./src', './dest')

// 测试 clear 方法
fbatch.clear('./dest')
