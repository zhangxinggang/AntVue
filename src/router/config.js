import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login'),
      meta:{
        title:'login.title'
      }
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: 'index',
      component: TabsView,
      redirect: '/login',
      meta:{
        hideTitle:true
      },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          meta: {
            title:'dashboard.title',
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'workplace',
              name: 'workplace',
              meta: {
                title:'dashboard.workplace',
                closable: false
              },
              component: () => import('@/pages/dashboard/workplace'),
            }
          ]
        },
        {
          path: 'example',
          name: 'example',
          meta: {
            icon: 'check-circle-o',
            title:'example.title'
          },
          component: PageView,
          children: [
            {
              path: 'palette',
              name: 'palette',
              component: () => import('@/pages/example/Palette'),
              meta:{
                title:'example.palette'
              }
            },{
              path: 'carousel',
              name: 'carousel',
              component: () => import('@/pages/example/Carousel'),
              meta:{
                title:'example.carousel'
              }
            },{
              path: 'table',
              name: 'table',
              component: () => import('@/pages/example/table'),
              meta:{
                title:'example.table'
              }
            },{
              path: 'tableComponent',
              name: 'tableComponent',
              component: () => import('@/pages/example/table/component.vue'),
              meta:{
                title:'example.component'
              }
            },{
              path: 'map',
              name: 'map',
              component: () => import('@/pages/example/map/index.vue'),
              meta:{
                title:'example.map'
              }
            },{
              path: 'mapLocation',
              name: 'mapLocation',
              component: () => import('@/pages/example/map/location.vue'),
              meta:{
                title:'example.mapLocation'
              }
            },{
              path: 'fabric',
              name: 'fabric',
              component: () => import('@/pages/example/fabric/index.vue')
            }
          ]
        }
      ]
    },
  ]
}

export default options
