import { genStyle, matchClassToken } from "../styles";
import { getEnv } from '../utils/envInfo.js'
import { transformVueClass } from '../utils/transform';
import MagicString from 'magic-string'

let tempPlugin
let env = getEnv()
let isAdded = false

export const setPlugin = (plugin) => {
	tempPlugin = plugin
}

export default function (source, map) {
	const callback = this.async()

	const id = this.resource
	// const getOptions = this.getOptions();
	// query: '??plugin-prefixed-allin-class-loader-ident'
	const plugin = this._compiler?.$_MainPluginContext?.plugin

	// 添加依赖
	if (plugin && plugin.depFiles) {
		plugin.depFiles.forEach(deps => deps.normalPath && this.addDependency(deps.normalPath))
	}

	// 开发模式,可以正常使用
	// 打包期间，修改样式和生成css分开做
	// 打包期间,部分loader上下文会丢失，丢失后生，手动生成规则，修改vue?vue&type=template的class内容
	// 有$_MainPluginContext上下文的时候,调用插件的接口,获取到页面的内容,生成css样式
	if (id.endsWith('.vue') || id.endsWith('.vue?mpType=page')) {

		if (!plugin) {
			function sleep() {
				return new Promise(async (resolve, reject) => {
					const timer = setTimeout(() => {
						resolve()
						clearTimeout(timer)
					}, 20);
					
				})
			}
			sleep().then(res=>{
				plugin = this._compiler?.$_MainPluginContext?.plugin
				console.log('==== sleep plugin :', !plugin);
				if (plugin) {
					tokens() 
				}
			})
			return
		}
		tokens() 
		function tokens() {
			function fun() {
				return new Promise(async (resolve, reject) => {
					await plugin.tokens(source, id)
					resolve()
				})
			}
			fun().then(res => {
				if (id.endsWith('App.vue')) {
					if (!source.includes('</style>')) {
						// TODO
						// throw 'app.vue必须包含style标签' 生成一个App.vue?vue&type=style
						source = source.replace('</style>',
							`
							.app-css-placeholder{color:#2c3e50}
							</style>`
						)
					}
				}
				callback(null, source)
			})
		}
		// console.log('==== id :', id);

		return
	}


	// path: 'D:\\file\\HBuilderProjects\\uniapp-css-loader\\node_modules\\.pnpm\\registry.npmmirror.com+vue-loader@15.10.1_y5o36p7qrshhm4v7l6yk7rwfsu\\node_modules\\vue-loader\\lib\\index.js',
	//      query: '??vue-loader-options',
	//      fragment: '',
	//      options: [Object],
	//      ident: 'vue-loader-options',
	//      normal: [Function],
	//      pitch: undefined,
	//      raw: undefined,
	//      data: null,
	//      pitchExecuted: true,
	//      normalExecuted: false,
	//      request: [Getter/Setter],
	//      type: undefined
	// console.log('\n==== loader执行 :', this.query);

	if (id.includes('App.vue?vue&type=style')) {
		source = source.replace('</style>',
			`
		.app-css-placeholder{color:#2c3e50;}
		</style>`
		)

		callback(null, source)
		return
	}


	if (!source.includes('<template>')) {
		callback(null, source)
		return
	}

	if (id.includes('vue?vue&type=template') && source.includes('<template>')) {
		let { classTokens, code, map: mapmap } = transformVueClass(source, id)
		callback(null, code, mapmap)
		return
	}

	callback(null, source)
}