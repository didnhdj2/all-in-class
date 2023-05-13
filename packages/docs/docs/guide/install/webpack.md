
## 安装
::: code-group
```bash [npm]
npm i -D css-allin-class
```

```bash [pnpm]
pnpm i -D css-allin-class
```
:::
## 修改vue配置文件
```js
// vue.config.js
const { allin } = require('css-allin-class')
const { preset } = require('css-allin-class/preset')

module.exports = {
  configureWebpack: {
    plugins: [
      allin({
        presets: [preset()]
      })
    ]
  }
}
```