import { fileURLToPath } from 'url'
import fs from 'fs'
import { dirname, resolve, join, isAbsolute, normalize } from 'path'
import { PLUGIN_NAME, PLUGIN_PREFIX } from '../constant'
import { createStyleSheet } from '../styles/createStyleSheet'
import { getEnv } from '../utils/envInfo.js'
import { genOutputStr } from '../utils/style'
import { normalizeAbsolutePath } from '../utils/path'
import { reloadConfig } from '../utils/getConfig'
// import { setPlugin } from './loader'
import { transformVueClass } from '../utils/transform'
import { genStyle } from '../styles'

const webpackwebpack = require("webpack-sources")
const RawSource = webpackwebpack.RawSource

const _dirname = typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(
	import.meta.url))
const TRANSFORM_LOADER = resolve(_dirname, './loader')
// console.log('==== TRANSFORM_LOADER :', TRANSFORM_LOADER);
const env = getEnv()


class WebpackPlugin {
	constructor(userConfig = {}) {
		this.modelsCssCache = {} // 记录每个模块的css变动
		this.outputCssCache = {} // 生成过的css缓存，用于输出css
		this.styleSheet = {
			staticRules: {},
			dynamicRules: {},
			dynamicCompRules: {}
		} // 
		this.hasStyleSheet = false
		this.isFirst = true
		this.lastModifiedTime = null;
		this.resetAll = null;
		this.namename = '111111';
		this.depFiles = [{
			normalPath: env.configPath,
			name: 'configPath',
			path: '',
		}]
		this.changeTime = {};

		this.numm = 0;

		this.changeTime[env.configPath] = null
		this.setConfig(userConfig)
	}
	// 经验
	// 单个方法 
	// 控制代码长度
	// 控制代码分支
	async setConfig(userConfig) {
		this.userConfig = userConfig
		this.config = Object.assign({ out: './public.css' }, userConfig)
	}
	async apply(compiler) {
		this.compiler = compiler

		this.injectHooksEvent()
	}
	transform(code, id) {

	}
	tokens(code, id) {
		// 解析获取toekn
		// 生成css
		let { classTokens } = transformVueClass(code, id)
		let changed = genStyle(classTokens, this, id)
	}
	injectHooksEvent() {

		this.useTransformLoader()
		this.watchConfigChange()
		this.injectInitStyleSheetEvent()
		this.injectOutputCssEvent()

		this.UpdateAppCssPlugin()
	}
	UpdateAppCssPlugin() {
		const meta = {
			framework: "webpack",
			webpack: {
				compiler: this.compiler
			}
		};
		const plugin = Object.assign(
			this, {
				__unpluginMeta: meta,
				__virtualModulePrefix: 'VIRTUAL_MODULE_PREFIX'
			}
		);

		const injected = this.compiler.$_MainPluginContext || { plugin };
		this.compiler.$_MainPluginContext = injected;

		injected.plugin = plugin;
		this.compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
			compilation.hooks.childCompiler.tap(PLUGIN_NAME, (childCompiler) => {
				childCompiler.$_MainPluginContext = injected;
			});
		});

		this.compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
			compilation.hooks.optimizeAssets.tapPromise(PLUGIN_NAME, async () => {
				const files = Object.keys(compilation.assets)
				for (const file of files) {
					if (file === '*') continue;
					this.outputCssStr(compilation, file)
				}
			});
		});
	}
	outputCssStr(compilation, file) {
		let code = compilation.assets[file].source().toString()
		const fun = (placeholder) => {
			let outputStr = genOutputStr({ outputCss: this.outputCssCache })
			code = code.replace(placeholder, outputStr.replace(/\n*/g, ''))
			compilation.assets[file] = new RawSource(code)
			console.log('css已生成');
			if(this.config.preview){
				this.outputCssTofile(outputStr)
			}
		}

		if (code.includes('.app-css-placeholder{color:#2c3e50}')) {
			// h5
			fun('.app-css-placeholder{color:#2c3e50}')
		} else if (code.includes('.app-css-placeholder{color:#2c3e50;}')) {
			// app，小程序
			fun('.app-css-placeholder{color:#2c3e50;}')
		}

		// let code = compilation.assets[file].source().toString()
		// if (code.includes('.app-css-placeholder{color:#2c3e50}')) {
		// 	// h5
		// 	let outputStr = genOutputStr({ outputCss: this.outputCssCache })
		// 	code = code.replace('.app-css-placeholder{color:#2c3e50}', outputStr
		// 		.replace(/\n*/g, ''))
		// 	compilation.assets[file] = new RawSource(code)

		// }else if (code.includes('.app-css-placeholder{color:#2c3e50;}')) {
		// 	// app，小程序
		// 	let outputStr = genOutputStr({ outputCss: this.outputCssCache })
		// 	code = code.replace('.app-css-placeholder{color:#2c3e50;}', outputStr
		// 		.replace(/\n*/g, ''))
		// 	compilation.assets[file] = new RawSource(code)
		// }
	}
	outputCssTofile(outputStr) {
		// 输出css到文件进行预览
		const cssOutPutFilePath = join(env.projectRoot, this.config.out)
		fs.writeFile(cssOutPutFilePath, outputStr, "utf-8", (err) => {
			if (err) {
				throw new Error("写入数据失败");
			}
		});
	}
	useTransformLoader() {
		let useLoader = [{
			loader: TRANSFORM_LOADER,
			ident: PLUGIN_NAME + '-loader-ident',
			options: {}
		}]
		let plugin = this
		// setPlugin(this)
		if (env.isUniapp) {
			delete useLoader[0].ident // uniapp的微信小程序 不支持ident的存在
		}

		this.compiler.options.module.rules.unshift({
			enforce: 'pre',
			use: (data) => {
				if (!data.resource) return []

				const id = normalizeAbsolutePath(data.resource + (data.resourceQuery || ''))

				if (data.resource.endsWith('.vue') || id.includes('vue?vue&type=template') || id
					.endsWith('.vue') || id.includes('vue?vue')) {
					return useLoader
				}

				return []
			},
		})

	}
	async reset() {
		// await this.reloadConfig()
		// this.modelsCssCache = {} // 记录每个模块的css变动
		// this.outputCssCache = {} // 生成过的css缓存，用于输出css
		// this.styleSheet = {
		// 	staticRules: {},
		// 	dynamicRules: {},
		// 	dynamicCompRules: {}
		// } // 
		// this.resetAll && this.resetAll(this)
	}
	async reloadConfig() {
		// 读取文件内容修改配置

		let { config, depFiles } = await reloadConfig({ projectRoot: env.projectRoot })
		if (depFiles) {
			depFiles && depFiles.push({
				normalPath: env.configPath,
				name: 'configPath',
				path: '',
			})
			this.depFiles = depFiles
		}
		if (config) {
			this.userConfig = config
		}
	}
	createStyleSheet() {
		return new Promise(async (resl, reject) => {
			await this.initVueConfigChanged()
			const isChanged = await this.checkVueConfigChanged()
			if (isChanged) {
				this.hasStyleSheet = false
				// await this.reset()
			}

			if (this.hasStyleSheet) return resl()
			this.styleSheet = await createStyleSheet({ userConfig: this.userConfig })
			this.hasStyleSheet = true

			resl();
		});
	}
	async injectInitStyleSheetEvent() {
		// 打包才会运行
		this.compiler.hooks.run.tapPromise(PLUGIN_NAME, (compiler) => {
			return this.createStyleSheet()
		});

		// 编译阶段运行
		this.compiler.hooks.watchRun.tapPromise(PLUGIN_NAME, (compiler) => {
			return this.createStyleSheet()
		});
	}
	injectOutputCssEvent() {
		// 输出css
		let oldStr
		let timer
		// const out = this.config.out
		// const fileDir = env.projectRoot
		// const cssOutPutFilePath = join(fileDir, out)

		// this.compiler.hooks.done.tap(PLUGIN_NAME, (compilation) => {

		// 	let outputStr = genOutputStr({ outputCss: this.outputCssCache })
		// 	if (this.isFirst) {
		// 		// 第一次,判断文件内容是否与当前的内容一至,一至不需要修改

		// 		// return
		// 	}
		// 	if (outputStr !== oldStr) {
		// 		oldStr = outputStr
		// 		let backupOld = oldStr
		// 		// clearTimeout(timer)
		// 		// timer = setTimeout(() => {
		// 		// 	fs.writeFile(cssOutPutFilePath, outputStr, "utf-8", (err) => {
		// 		// 		if (err) {
		// 		// 			throw new Error("写入数据失败");
		// 		// 			oldStr = backupOld
		// 		// 		}
		// 		// 	});

		// 		// 	clearTimeout(timer)
		// 		// }, 500);
		// 	}
		// });
	}
	initVueConfigChanged() {
		if (!this.isFirst) return

		this.isFirst = false
		return new Promise(async (resolve1, reject) => {
			let i = 0
			for (let dep of this.depFiles) {
				let lastModifiedTime = this.changeTime[dep.normalPath]
				try {
					await fs.stat(dep.normalPath, async (err, stats) => {
						i++
						if (!err && stats.mtimeMs !== lastModifiedTime) {
							this.changeTime[dep.normalPath] = stats.mtimeMs;
							// 改变了
						} else {
							// 没有改变呀.
						}

						if (i == this.depFiles.length) {
							// await this.reloadConfig()
							resolve1(false)
						}
					});
				} catch (err) {
					continue
				}

			}

		})
	}
	statFile(isInit = false) {
		return new Promise(async (resolve1, reject) => {
			let i = 0
			for (let dep of this.depFiles) {
				let lastModifiedTime = this.changeTime[dep.normalPath]
				try {
					await fs.stat(dep.normalPath, (err, stats) => {
						i++
						if (!err && stats.mtimeMs !== lastModifiedTime) {
							this.changeTime[dep.normalPath] = stats.mtimeMs;

							if (isInit) return
							return resolve1(true)
						} else {

						}

						if (i == this.depFiles.length) {
							resolve1(false)
						}
					});
				} catch (err) {
					continue
				}

			}

		})
	}
	checkVueConfigChanged() {
		return new Promise(async (resolve1, reject) => {
			let i = 0
			for (let dep of this.depFiles) {
				let lastModifiedTime = this.changeTime[dep.normalPath]
				try {
					await fs.stat(dep.normalPath, (err, stats) => {
						i++
						if (!err && stats.mtimeMs !== lastModifiedTime) {
							this.changeTime[dep.normalPath] = stats.mtimeMs;

							return resolve1(true)
						} else {

						}

						if (i == this.depFiles.length) {
							resolve1(false)
						}
					});
				} catch (err) {
					continue
				}

			}

		})
	}
	watchConfigChange() {

	}
}
export default WebpackPlugin
