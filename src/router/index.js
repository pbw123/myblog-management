import Vue from 'vue'
import VueRouter from 'vue-router'
import User from '../views/User.vue'
import Message from '../views/Message.vue'
import Comment from '../views/Comment.vue'
import Article from '../views/Article.vue'
import Web from '../views/Web.vue'
import Attention from '../views/Attention.vue'
import Carousel from '../views/Carousel.vue'
import Icon from '../views/Icon.vue'
import Link from '../views/Link.vue'
import Login from '../views/Login.vue'
import Index from '../views/Index.vue'
import Timeline from '../views/Timeline.vue'
import ArticleMarkdown from '../views/ArticleMarkdown.vue'



Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'index',
        component: Index,
        meta: {
            title:'首页'
        },
        children: [
            {
                path: '/',
                redirect: '/user',
                meta:{
                    title:'用户'
                }
            },
            {
                path: '/user',
                name: 'user',
                component: User,
                meta:{
                    title:'用户'
                }
            },
            {
                path: '/message',
                name: 'message',
                component: Message,
                meta:{
                    title:'留言'
                }
            },
            {
                path: '/comment',
                name: 'comment', 
                component: Comment,
                meta:{
                    title:'评论'
                }
            },
            {
                path: '/article',
                name: 'article',
                component: Article,
                meta:{
                    title:'文章'
                }
            },
            {
                path: '/web',
                name: 'web',
                component: Web,
                meta:{
                    title:'网站信息'
                }
            },
            {
                path: '/attention',
                name: 'attention',
                component: Attention,
                meta:{
                    title:'关注我'
                }
            },
            {
                path: '/carousel',
                name: 'carousel',
                component: Carousel,
                meta:{
                    title:'轮播图'
                }
            },
            {
                path: '/icon',
                name: 'icon',
                component: Icon,
                meta:{
                    title:'头像'
                }
            },
            {
                path: '/link',
                name: 'link',
                component: Link,
                meta:{
                    title:'友情链接'
                }
            },
            {
                path: '/timeline',
                name: 'timeline',
                component: Timeline,
                meta:{
                    title:'开发历程'
                }
            }
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta:{
            title:'登录'
        }
    },
    {
        path: '/articleMarkdown',
        name: 'articleMarkdown',
        component: ArticleMarkdown,
        meta:{
            title:'编辑'
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    // 如果有token 说明该用户已登陆

    if (sessionStorage.getItem('token')) {
        // 在已登陆的情况下访问登陆页会重定向到首页
        //     next()

        if (to.path === '/login') {
            // next({path: '/'})
            //         next({path:'/'})
            next(`/login?redirect=${to.path}`)

        } else {
            // next({path: to.path || '/'})

            next()
        }

    } else {
        // 没有登陆则访问任何页面都重定向到登陆页
        if (to.path === '/login') {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
            // next({path: '/login'})
        }
    }
})
export default router
