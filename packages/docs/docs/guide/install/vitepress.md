


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
import { defineConfig } from 'vitepress'
import allin from 'css-allin-class'
import preset from 'css-allin-class/preset'

export default defineConfig({
  vite: {
    plugins: [
      allin({ 
        unit:'px', 
        prefix:'a-', // 建议使用前缀
        presets:[preset()]
      })
    ]
  }
})
```