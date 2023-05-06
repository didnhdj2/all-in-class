# 文字超出隐藏

<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

## 文字超出省略
line-1
<div class="a-line-1 a-w-100">文字文字文字文字文字文字文字文字</div>

```css
.line-1{
  -webkit-line-clamp: 1;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
```
line-2
<div class="a-line-2 a-w-100">文字文字文字文字文字文字文字文字</div>

```css
.line-2{
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
```
