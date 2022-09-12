<template>
    <div class="my-container">
        <!-- 已登录头部 -->
        <div class="header user-info" v-if="user">
            <div class="base-info">
                <div class="left">
                    <van-image class="avatar" :src="userInfo.photo" round fit="cover" />
                    <span class="name">{{ userInfo.name }}</span>
                </div>
                <div class="right">
                    <van-button size="mini" round>编辑资料</van-button>
                </div>
            </div>
            <div class="data-stats">
                <div class="data-item">
                    <span class="count">{{ userInfo.art_count }}</span>
                    <span class="text">头条</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.follow_count }}</span>
                    <span class="text">关注</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.fans_count }}</span>
                    <span class="text">粉丝</span>
                </div>
                <div class="data-item">
                    <span class="count">{{ userInfo.like_count }}</span>
                    <span class="text">获赞</span>
                </div>
            </div>
        </div>
        <!-- /已登录头部 -->
        <!-- 未登录头部 -->
        <div class="header not-login" v-else>
            <div class="login-btn" @click="$router.push('/login')">
                <!-- 这里的~不添加也是可以的（在css中是必须添加~才能使用@的） -->
                <img class="mobile-img" src="~@/assets/mobile.png" alt="">
                <span class="text">登录 / 注册</span>
            </div>
        </div>
        <!-- 宫格导航column-num: 2 ，列数为2列，代表一行两列: 是否开启格子点击反馈(点击格子之后，会出现灰色效果)-->
        <van-grid class="grid-nav mb-9" :column-num="2" clickable>
            <van-grid-item class="grid-item">
                <i slot="icon" class="iconfont icon-shoucang"></i>
                <span slot="text" class="text">收藏</span>
            </van-grid-item>
            <van-grid-item class="grid-item">
                <i slot="icon" class="iconfont icon-history"></i>
                <span slot="text" class="text">历史</span>
            </van-grid-item>
        </van-grid>
        <!-- /宫格导航 -->
        <van-cell title="消息通知" is-link />
        <van-cell class="mb-9" title="小智同学" is-link />
        <van-cell v-if="user" class="logout-cell" clickable title="退出登录" @click="onLogout" />
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '../../api/user'
export default {
    name: 'MyIndex',
    components: {},
    props: {},
    data() {
        return {
            userInfo: {} // 用户信息
        }
    },
    computed: {
        ...mapState(['user'])
    },
    watch: {},
    created() {
        // 初始化的时候，如果用户登录了，我才请求获取当前登录用户的信息
        if (this.user) {
            this.loadUserInfo()
        }
    },
    mounted() { },
    methods: {
        onLogout() {
            // 退出提示
            // 在组件中需要使用 this.$dialog 来调用弹框组件
            this.$dialog.confirm({
                title: '确认退出吗？'
            }).then(() => {
                // 点击弹框确认执行then
                // on confirm
                // 确认退出：清除登录状态（容器中的 user + 本地存储中的 user）
                this.$store.commit('setUser', null)
            }).catch(() => {
                // 点击弹框取消执行catch
                // on cancel
                console.log('取消执行')
            })
        },
        async loadUserInfo() {
            try {
                const { data } = await getUserInfo()
                this.userInfo = data.data
            } catch (err) {
                console.log(err)
                this.$toast('获取数据失败，请稍后重试')
            }
        }
    }
}
</script>

<style scoped lang="less">
.my-container {
    .header {
        height: 361px;
        background: url("~@/assets/banner.png"); // css中使用@需要添加~,@代表src
        background-size: cover;
    }

    .not-login {
        display: flex;
        justify-content: center;
        align-items: center;

        .login-btn {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .mobile-img {
                width: 132px;
                height: 132px;
                margin-bottom: 15px;
            }

            .text {
                font-size: 28px;
                color: #fff;
            }
        }
    }

    .user-info {
        .base-info {
            height: 231px;
            padding: 76px 32px 23px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left {
                display: flex;
                align-items: center;

                .avatar {
                    width: 132px;
                    height: 132px;
                    border: 4px solid #fff;
                    margin-right: 23px;
                }

                .name {
                    font-size: 30px;
                    color: #fff;
                }
            }
        }

        .data-stats {
            display: flex;

            .data-item {
                height: 130px;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #fff;

                .count {
                    font-size: 36px;
                }

                .text {
                    font-size: 23px;
                }
            }
        }
    }

    .grid-nav {
        .grid-item {
            height: 141px;

            i.toutiao {
                font-size: 45px;
            }

            .toutiao-shoucang {
                color: #eb5253;
            }

            .toutiao-lishi {
                color: #ff9d1d;
            }

            span.text {
                font-size: 28px;
            }
        }
    }

    .logout-cell {
        text-align: center;
        color: #d86262;
    }

    .mb-9 {
        margin-bottom: 9px;
    }
}
</style>
