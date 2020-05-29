<template>
    <div id="app">
        <router-view v-wechat-title="$route.meta.title"/>
        <a href="http://www.beian.miit.gov.cn/" style="color: black">
            <div class="icp" >
                {{icp}}
            </div>
        </a>

    </div>
</template>

<script>
    import bg from '../public/images/bg.jpg'
    import bg2 from '../public/images/bg2.jpg'

    export default {
        name: "index",
        data() {
            return {
                icp: '桂ICP备19007827号-1',
                night: true,
                bg: bg,
                bg2: bg2
            };
        }
    }
</script>
<style lang="scss">
    .btn{
        margin-top: 10px;
        margin-left: 10px;
    }
    .icp{
        position: absolute;
        bottom: 0;
        text-align: center;
        width: 100%;
    }
</style>
