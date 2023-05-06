import { defineConfig } from 'vitepress'
import allin from '../../dist/index'
import preset from '../../dist/preset'
// https://vitepress.dev/reference/site-config
export default defineConfig({
	vite: {
		plugins: [
			allin({ unit:'px', prefix:'a-', presets:[preset()]})
		]
	},
	// async transformHtml(code, id, context) {
	// 	aa.transformHtml(code, id, context)
	// },
	// async transformHead(context) {
	// 	context.head.unshift( [ 'link',
	// 	  {
	// 	    rel: 'preload stylesheet',
	// 	    href: '/assets/style1111111.d64e77a6.css',
	// 	    as: 'style',
	// 	    type: '',
	// 	    crossorigin: ''
	// 	  }])
	// 	// console.log('==== context :', context);
	// },
	// interface TransformContext {
	//   page: string // e.g. index.md (relative to srcDir)
	//   assets: string[] // all non-js/css assets as fully resolved public URL
	//   siteConfig: SiteConfig
	//   siteData: SiteData
	//   pageData: PageData
	//   title: string
	//   description: string
	//   head: HeadConfig[]
	//   content: string
	// }
	title: "allincss",
	// titleTemplate: 'Custom Suffix',
	// description: "A VitePress Site",
	themeConfig: {
		logo: '/logo.png',
		// search: {
		// 	provider: 'local'
		// },
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			// { text: '首页', link: '/' },
			{ text: '指引', link: '/guide/start' },
			{ text: '配置', link: '/config/' },
			{ text: '预设样式', link: '/preset/' }
		],

		sidebar: {
			'/guide/': [
				{
					text: '指引',
					items: [
						{ text: '简介', link: '/guide/start' },
						{ text: '为什么是', link: '/guide/why' },
						{ text: '入门', link: '/guide/why' }
					]
				},
				{
					text: '安装',
					items: [
						{ text: 'uniapp', link: '/guide/install/uniapp' },
						{ text: 'vite', link: '/guide/install/vite' },
						{ text: 'webpack', link: '/guide/install/webpack' },
						{ text: 'vitepress', link: '/guide/install/vitepress' }
					]
				},
				{
					text: '预设样式',
					items: [
						{ text: 'line', link: '/guide/preset/line' },
					]
				}
			],
			'/config/': [
				{
					text: '指引',
					items: [
						{ text: 'presets预设', link: '/config/presets' },
						{ text: 'rules规则', link: '/config/rules' },
						{ text: 'css权重', link: '/config/i' },
						{ text: 'shortcuts缩写', link: '/config/shortcuts' },
						{ text: '前后缀', link: '/config/fix' },
						{ text: '预览生成css', link: '/config/outPutCss' },
						{ text: '文件转规则', link: '/config/file2rule' }
					]
				}
			],
			'/preset/': [
				{
					text: '指引',
					items: [
						{ text: '默认预设', link: '/preset/presets' },
						{ text: '为什么是', link: '/preset/why' },
						{ text: '入门', link: '/preset/why' }
					]
				}
			]
		},

		// socialLinks: [
		// 	{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }
		// ]
	}
})
