<template>
    <div class="layout-container">
        <!-- 子路由出口 -->
        <router-view />
        <!-- 导航栏 -->
        <van-tabbar class="layout-tabbar" route>
            <van-tabbar-item :to="{ name: 'home' }">
                <i slot="icon" class="iconfont icon-shouye"></i>
                <span class="text">首页</span>
            </van-tabbar-item>
            <van-tabbar-item to="/qa">
                <i slot="icon" class="iconfont icon-wenda"></i>
                <span class="text">问答</span>
            </van-tabbar-item>
            <van-tabbar-item to="/video">
                <i slot="icon" class="iconfont icon-shipin"></i>
                <span class="text">视频</span>
            </van-tabbar-item>
            <van-tabbar-item to="/my">
                <i slot="icon" class="iconfont icon-wode"></i>
                <span class="text">{{ $store.state.user ? '我的' : '未登录' }}</span>
            </van-tabbar-item>
        </van-tabbar>
        <!-- /标签导航栏 -->
    </div>
</template>

<script>
export default {
    name: 'LayoutIndex',
    components: {},
    props: {},
    data() {
        return {
        }
    },
    computed: {},
    watch: {},
    created() { },
    mounted() { },
    methods: {}
}
</script>

<style scoped lang="less">
.layout-container {
    .layout-tabbar {
        i.toutiao {
            font-size: 40px;
        }

        span.text {
            font-size: 20px;
        }
    }
}
</style>
