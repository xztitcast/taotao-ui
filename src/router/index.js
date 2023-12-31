import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/request'
import { isURL } from '@/utils/validate'

Vue.use(Router)

// 页面路由(独立页面)
export const globalRoutes = [
  {
    path: '/404',
    component: () => import('@/views/global/404'),
    name: '404',
    meta: { title: '404未找到' },
    beforeEnter (to, from, next) {
      // 拦截处理特殊业务场景
      // 如果, 重定向路由包含__双下划线, 为临时添加路由
      if (/__.*/.test(to.redirectedFrom)) {
        return next(to.redirectedFrom.replace(/__.*/, ''))
      }
      next({ name: 'login' })
    }
  },
  { path: '/login', component: () => import('@/views/global/login'), name: 'login', meta: { title: '登录' } }
]

// 模块路由(基于主入口布局页面)
export const mainRoutes = {
  path: '/',
  component: () => import('@/views/main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口布局' },
  children: [
    { path: '/home', component: () => import('@/views/modules/home'), name: 'home', meta: { title: '首页', isTab: true } }
  ]
}

const createRouter = () => new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: globalRoutes.concat(mainRoutes)
})

const router = new createRouter()

function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 已添加或者当前路由为页面路由, 可直接访问
  if (window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] || fnCurrentRouteIsPageRoute(to, globalRoutes)) {
    return next()
  }
  resetRouter()
  // 获取菜单列表, 添加并全局变量保存
  http.get('/sys/menu/nav').then(({ data }) => {
    if(data && data.code === 0){
      window.SITE_CONFIG['menuList'] = data.menuList
      window.SITE_CONFIG['permissions'] = data.permissions
      fnAddDynamicMenuRoutes(window.SITE_CONFIG['menuList'])
      next({ ...to, replace: true })
    }else {
      Vue.prototype.$message.error(data.message)
      return next({ name: 'login' })
    }
  }).catch(() => {
    next({ name: 'login' })
  })

})

/**
 * 判断当前路由是否为页面路由
 * @param {*} route 当前路由
 * @param {*} globalRoutes 页面路由
 */
function fnCurrentRouteIsPageRoute (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return true
    }
    if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteIsPageRoute(route, temp) : false
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
      continue
    }
    // 组装路由
    var route = {
      path: '',
      component: null,
      name: '',
      meta: {
        ...window.SITE_CONFIG['contentTabDefault'],
        id: menuList[i].id,
        title: menuList[i].name
      }
    }
    // eslint-disable-next-line
    let URL = (menuList[i].url || '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}占位符变量
    if (isURL(URL)) {
      route['path'] = route['name'] = `i-${menuList[i].id}`
      route['meta']['iframeURL'] = URL
    } else {
      URL = URL.replace(/^\//, '').replace(/_/g, '-')
      route['path'] = route['name'] = URL.replace(/\//g, '-')
      route['component'] = () => import(`@/views/modules/${URL}`)
    }
    routes.push(route)
  }
  if (temp.length >= 1) {
    return fnAddDynamicMenuRoutes(temp, routes)
  }
  // 添加路由
  router.addRoutes([
    {
      ...mainRoutes,
      name: 'main-dynamic-menu',
      children: routes
    },
    { path: '*', redirect: { name: '404' } }
  ])
  window.SITE_CONFIG['dynamicMenuRoutes'] = routes
  window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] = true
}

export default router
