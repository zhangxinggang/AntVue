const path = require('path')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const {getThemeColors, modifyVars} = require('./src/utils/themeUtil')
const {resolveCss} = require('./src/utils/theme-color-replacer-extend')
module.exports = {
	services: {
		viewServer: {
			entry: {
				index: path.resolve(__dirname, 'src/main.js')
			},
			resolve: {
				alias: {
					"@": path.resolve(__dirname, './src')
				}
			},
			externals: {
				'vue': 'Vue',
				'vuex': 'Vuex',
				'vue-router': 'VueRouter',
				'vue-i18n': 'VueI18n',
				'nprogress': 'NProgress',
				'axios': 'axios',
				'mockjs': 'Mock',
				_cdn:{
					index:[
						'//cdn.jsdelivr.net/npm/@babel/polyfill@7.12.1/dist/polyfill.min.js',
						'//cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
						'//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
						'//cdn.jsdelivr.net/npm/vue-i18n@8.24.1/dist/vue-i18n.min.js',
						'//cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js',
						'//cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
						'//cdn.jsdelivr.net/npm/axios@0.21/dist/axios.min.js',
						'//cdn.jsdelivr.net/npm/mockjs@1.1.0/dist/mock-min.js'
					]
				}
			},
			module: {
				rules: [{
					test:/\.js$/,
					use:[{
						loader: 'babel-loader',
						options: {
							presets:[
								'@babel/preset-env'
							],
							plugins:[
								[
									'import',
									{
									  libraryName: 'ant-design-vue',
									  libraryDirectory: 'es',
									  style: true
									},
									'syntax-dynamic-import'
								]
							]
						}
					}]
				},{
					test: /\.css$/,
					use:['style-loader','css-loader']
				},{
					test: /\.less$/,
					use: [{
						loader: "style-loader",
					}, {
						loader: 'css-loader',
						options: { sourceMap: true },
					},
					// {
					// 	loader: 'px2rem-loader',
					// 	options: {
					// 		remUnit: 14
					// 	}
					// },
					// {
					// 	loader: 'postcss-loader',
					// 	options: {
					// 	  plugins: () => {
					// 		require('postcss-pxtorem')({
					// 			rootValue: 192,
					// 			minPixelValue: 2,
					// 			propList: ['*']
					// 		})
					// 	  }
					// 	}
					// },
					{
						loader: "less-loader",
						options: {
							lessOptions: {
								modifyVars: modifyVars(),
								javascriptEnabled: true
							}
						}
					}, {
						loader: 'style-resources-loader',
						options: {
							patterns: [path.resolve(__dirname, "./src/theme/theme.less")],
							injector: 'append'
						}
					}]
				}]
			},
			plugins: [
				new ThemeColorReplacer({
					fileName: 'css/theme-colors-[contenthash:8].css',
					matchColors: getThemeColors(),
					injectCss: true,
					resolveCss
				})
			]
		}
	},
	project: {
		sysTitle: '后台管理项目'
	}
}