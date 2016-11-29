# node-file-batch
node文件批处理

## 功能
- copy     复制文件
- clear    清空目录

## 使用方法
- ```node fbatch``` 查看全部用法

- ```node fbatch copy <src> <dest>``` 指定原路径和目标路径复制

- ```node fbatch copy -conf <config>``` 指定 config 文件进行复制

- ```node fbatch clear <src>``` 指定路径清空其下所有文件和文件夹

- ```node fbatch clear -conf``` 指定 config 文件进行清空

## config.js 配置文件格式

```javascript
module.exports = {
  copySrc: ['./test/src'],      // 复制原路径
  copyDest: ['./test/dest'],    // 复制目标路径
  clearSrc: ['./test/dest']     // 清空路径
}
```

## 测试
根目录下运行 ```node unit``` 测试每个模块是否正常工作
