
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
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import allin from "css-allin-class";
import preset from "css-allin-class/preset";

export default defineConfig({
  plugins: [
    vue(),
    allin({
      presets: [preset()] 
    })
  ]
})
```