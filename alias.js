import { resolve } from 'path'

const r = (p) => resolve(__dirname, p)

export const alias = {
	'css-allin-class': r('./packages/css-allin-class/src/'),
	'odcss': r('./packages/css/src/'),
	'@odcss/vite': r('./packages/vite/src/'),
	'@odcss/postcss': r('./packages/postcss/src/'),
	'@odcss/webpack': r('./packages/webpack/src/'),
	'@odcss/share-core': r('./packages/share-core/src/'),
	'@odcss/share-gen': r('./packages/share-gen/src/'),
}
