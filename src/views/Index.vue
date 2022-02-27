<template>
    <div id="app">
        <div class="main">
            <el-row>
                <el-col>
                    <el-menu
                            default-active="1"
                            class="el-menu-vertical-demo"
                            background-color="#545c64"
                            text-color="#fff"
                            active-text-color="#ffd04b">
                        <router-link to="/user">
                            <el-menu-item index="1">
                                <i class="el-icon-user-solid"></i>
                                <span slot="title">用户</span>
                            </el-menu-item>

                        </router-link>
                        <router-link to="/message">
                            <el-menu-item index="2">
                                <i class="el-icon-document"></i>
                                <span slot="title">留言</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/comment">
                            <el-menu-item index="3">
                                <i class="el-icon-s-comment"></i>
                                <span slot="title">评论</span>
                            </el-menu-item>
                        </router-link>

                        <router-link to="/article">
                            <el-menu-item index="4">
                                <i class="el-icon-reading"></i>
                                <span slot="title">文章</span>
                            </el-menu-item>
                        </router-link>

                        <router-link to="/web">
                            <el-menu-item index="5">
                                <i class="el-icon-s-platform"></i>
                                <span slot="title">网站信息</span>
                            </el-menu-item>
                        </router-link>

                        <router-link to="/attention">
                            <el-menu-item index="6">
                                <i class="el-icon-phone"></i>
                                <span slot="title">关注我</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/carousel">
                            <el-menu-item index="7">
                                <i class="el-icon-picture"></i>
                                <span slot="title">轮播图</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/icon">
                            <el-menu-item index="8">
                                <i class="el-icon-camera-solid" @click=""></i>
                                <span slot="title">默认头像</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/link">
                            <el-menu-item index="9">
                                <i class="el-icon-link"></i>
                                <span slot="title">友情链接</span>
                            </el-menu-item>
                        </router-link>
                        <router-link to="/timeline">
                            <el-menu-item index="10">
                                <i class="el-icon-time"></i>
                                <span slot="title">开发历程</span>
                            </el-menu-item>
                        </router-link>

                        <el-menu-item index="11" @click="exit">
                            <i class="el-icon-switch-button"></i>
                            <span slot="title">退出</span>
                        </el-menu-item>
                    </el-menu>

                </el-col>
            </el-row>

        </div>
        <div class="router">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import bg from '../../public/images/bg.jpg'
    import bg2 from '../../public/images/bg2.jpg'
    import {SUCCESS_CODE} from "../assets/contant";

    export default {
        name: "index",
        data() {
            return {
                night: false,
                bg: bg,
                bg2: bg2
            };
        },
        methods:{
            exit() {
                sessionStorage.removeItem('token');
                this.$router.push('/login');
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../assets/scss/app";

    .router-link-active {
        background-color: rgb(255, 0, 0);
    }
    .router{

    }
</style>