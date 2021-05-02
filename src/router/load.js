import guards from './guards'
//应用配置
let appOptions = {
	router: undefined,
	i18n: undefined,
	store: undefined
}

/**
 * 设置应用配置
 * @param options
 */
function setAppOptions(options) {
	const { router, store, i18n } = options
	appOptions.router = router
	appOptions.store = store
	appOptions.i18n = i18n
}

function loadRoutes() {
	const { router, store, i18n } = appOptions
	const rootRoute = router.options.routes.find(item => item.path === '/' || item.name ==='index')
	const menuRoutes = rootRoute && rootRoute.children
	if (menuRoutes) {
		store.commit('setting/setMenuData', menuRoutes)
	} else {
		console.warn('routes必须存在路径/，且/路径下有children')
	}
}

function loadGuards(options) {
	const { beforeEach, afterEach } = guards
	const { router } = options
	beforeEach.forEach(guard => {
		if (guard && typeof guard === 'function') {
			router.beforeEach((to, from, next) => guard(to, from, next, options))
		}
	})
	afterEach.forEach(guard => {
		if (guard && typeof guard === 'function') {
			router.afterEach((to, from) => guard(to, from, options))
		}
	})
}

export { loadRoutes, loadGuards, setAppOptions }