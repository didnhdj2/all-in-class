
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
### vue2
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
### vue3
```js
// vite.config.js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni';
import allin from "css-allin-class";
import preset from "css-allin-class/preset";

export default defineConfig({
  plugins: [
    uni(),
    allin({
      presets: [preset()] 
    })
  ]
})
```