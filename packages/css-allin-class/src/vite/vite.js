import { PLUGIN_NAME, PLUGIN_PREFIX, CSS_PLACE_HOLDER_KEY, VITE_HMR_CONTENT } from '../constant'
import { genStyle } from '../styles';
import MagicString from 'magic-string'
import { createStyleSheet } from '../styles/createStyleSheet';
import { getEnv } from '../utils/envInfo';
import { genOutputStr } from '../utils/style';
import { transformVueClass } from '../utils/transform';
const fs = require('fs');
const path = require('path');

export default function vitePlugin(userConfig, pluginShare) {
	const virtualModuleId = 'virtual:my-module'
	const resolvedVirtualModuleId = '\0' + virtualModuleId

	let styleSheet, outputCssCache = {},
		modelsCssCache = {}
	pluginShare.outputCssCache = outputCssCache
	let server
	let errCache = new Map()
	let timer
	let notAddCssPlaceholder = true



	const injectCssToBrowser = () => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			server?.ws.send({
				type: 'custom',
				event: 'my:greetings',
				data: genOutputStr({ outputCss: outputCssCache })
			})
			clearTimeout(timer)
		}, 500);
	}



	return {
		name: PLUGIN_NAME,
		order: 'pre',
		// configResolved(resolvedConfig) {
		// 	console.log('==== resolvedConfig :', resolvedConfig);
		// },
		configureServer(_server) {
			server = _server
		},
		async buildStart() {
			styleSheet = await createStyleSheet({ userConfig })
		},
		resolveId(id) {
			if (id === virtualModuleId) return resolvedVirtualModuleId;

			return null;
		},
		load(id) {
			if (id === resolvedVirtualModuleId) return VITE_HMR_CONTENT;

			return null;
		},
		async transform(source, id) {
			if (!id || !source) {
				return {
					code: source,
					map: null
				};
			}
			if(getEnv().isUniapp&&id.endsWith('App.vue')) {
				return {
					code: source,
					map: null
				};
			};
			
			if (id.endsWith('main.js') && server) {
				let ms = new MagicString(source)
				ms.appendRight(source.length, `\nimport virtual from '${virtualModuleId}'\n`)
				// ms.appendLeft(0, `import virtual from '${virtualModuleId}'\n`)
				return {
					code: ms.toString(),
					map: ms.generateMap({
						file: id,
						hires: true,
						source: id, // 原始文件路径
					})
				}
			}

			if (notAddCssPlaceholder && id.includes('/App.vue?vue&type=style') && (id.endsWith('lang.css') || id
					.endsWith('lang.scss'))) {
				// console.log('==== id :', id);
				let ms = new MagicString(source)
				ms.appendLeft(0, `${CSS_PLACE_HOLDER_KEY}\n`)
				notAddCssPlaceholder = false
				return {
					code: ms.toString(),
					map: ms.generateMap({
						file: id,
						hires: true,
						source: id, // 原始文件路径
					})
				}
			}
			if (id.endsWith('App.vue')) {
				// // 增加css引用
				// 	let ms = new MagicString(source)
				// 	ms.appendLeft(0, `<style>\n@import '${virtualModuleId}'\n</style>`)
				// 	return {
				// 		code: ms.toString(),
				// 		map: ms.generateMap({
				// 			file: id,
				// 			hires: true,
				// 			source: id, // 原始文件路径
				// 		})
				// 	}
			}

			// if (id.endsWith('.vue') && !source.includes('<template>') && !id.toLowerCase().endsWith('app.vue')) {

			// 	if (!errCache.get(1)) {
			// 		errCache.set(1, true)
			// 		// for (let i = 0; i < 16; i++) {
			// 		//   for (let j = 0; j < 16; j++) {
			// 		//     const code = i * 16 + j;
			// 		//     process.stdout.write(`\u001b[38;5;${code}m ${'pl'+code.toString().padEnd(5)}`);
			// 		//   }
			// 		//   process.stdout.write('\u001b[0m\n');
			// 		// }
			// 		// console.log('\x1b[33m%s\x1b[0m', 'Hello world');
			// 		let start = `  配置项错误：\n  export default defineConfig({\n    plugins: [`
			// 		let config = `      allin({ presets: [preset()] }),\n      vue(),`
			// 		let end =
			// 			`    ],\n    resolve: {\n      alias: {\n        '@': fileURLToPath(new URL('./src',\n          import.meta.url))\n      }\n    }\n  })`

			// 		if (!env.isUniapp) {
			// 			// console.log('\u001b[38;5;1m%s\x1b[0m', start);
			// 			// console.log('\u001b[38;5;3m%s\x1b[0m', config);
			// 			// console.log('\u001b[38;5;1m%s\x1b[0m', end);
			// 			// console.log('\u001b[38;5;5m%s\x1b[0m', `  解决方案：在配置文件中把 allin 放在 vue 的前面，如上面黄色部分`);
			// 		} else {
			// 			console.error(start);
			// 			console.error(config);
			// 			console.error(end);
			// 			console.warn(`  解决方案：在配置文件中plugins数组把 allin 放在 vue 的前面`);
			// 		}

			// 	}
			// }
			
			
			if (process.env.UNI_PLATFORM === 'mp-weixin') {
				// 微信小程序,在前,
				if (id.endsWith('.vue') && source.includes('<template>')) {
					let { classTokens, code, map } = transformVueClass(source, id)
					// 匹配

					let changed = genStyle(classTokens, {
						styleSheet,
						outputCssCache,
						modelsCssCache,
						userConfig
					}, id)

					// cssOutPut() 
					if (server) injectCssToBrowser()
					return {
						code,
						map: { mappings: map.mappings }
					}
				}
			} else if (id.endsWith('.vue')) {
				let { classTokens, code, map } = transformVueClass(source, id)
				// 匹配
				let changed = genStyle(classTokens, {
					styleSheet,
					outputCssCache,
					modelsCssCache,
					userConfig
				}, id)

				// cssOutPut() 
				if (server) injectCssToBrowser()
				return {
					code,
					map: { mappings: map.mappings }
				}
			}

			return {
				code: source,
				map: null
			};
		},
		// h5才会生效
		async transformIndexHtml(html) {
			injectCssToBrowser()
			const outputStr = genOutputStr({ outputCss: outputCssCache })
			// 避免刷新网页，样式闪烁
			return html.replace(
				/<\/head>/,
				`	<style type="text/css" data-vite-dev-id="serverTempPublic.css">${outputStr}</style>\n	<\/head>`
			)
		},
		async generateBundle(options, bundle) {
			const files = Object.keys(bundle)
				.filter(i => i.endsWith('.css'))
			for (const file of files) {
				const code = bundle[file].source
				if (code.includes(CSS_PLACE_HOLDER_KEY)) {
					const outCssStr = genOutputStr({ outputCss: pluginShare.outputCssCache })
					bundle[file].source = code.replace(CSS_PLACE_HOLDER_KEY, outCssStr)
					console.log('css生成了');
					break
					// console.log('==== 包含了:', file, outCssStr);
				} 
			}
		},
		closeBundle() {
			const out = userConfig.out || './public.css'
			const cssPreviewFilePath = path.join(getEnv().projectRoot, out)
			
			if (out) {
				// cssOutPut(cssPreviewFilePath, genOutputStr({ outputCss: outputCssCache }))
			}
		}
	};
	
	function cssOutPut(filePath, outputStr) {
		fs.writeFile(filePath, outputStr, "utf-8", (err) => {
			if (err) {
				throw new Error("css文件生成失败");
			}
		});
	}
	function sleep() {
		return new Promise((resolve, reject) => {
			const timer = setTimeout(() => {
				resolve()
				clearTimeout(timer)
			}, 3000);
		})
	}
}
