<template>
    <div class="home-container">
        <!-- 导航栏 原本只能通过title属性设置一个导航栏的标题，现在添加一个搜索按钮，需要插槽-->
        <!-- 这样的效果就是将原本标题的位置，换成一个按钮进行显示 -->
        <van-nav-bar class="page-nav-bar" fixed>
            <!--增加一个名字为title的插槽 -->
            <van-button class="search-btn" slot="title" type="badge" size="small" round icon="search" to="/search">搜索
            </van-button>
        </van-nav-bar>
        <!-- /导航栏 -->

        <!-- 频道编辑 -->
        <van-popup v-model="isChannelEditShow" position="bottom" :style="{ height: '100%' }" closeable
            close-icon-position="top-left">
            <channel-edit :mychannels="channels" :active="active" @onaddChannel="addChannel"
                @updata-active="onUpdateActive" />
        </van-popup>
        <!-- /频道编辑 -->

        <van-tabs class="channel-tabs" v-model="active" animated swipeable>
            <van-tab v-for="obj in channels" :key="obj.id" :title="obj.name">

                <!-- 文章列表 -->
                <articlelist :channel="obj"></articlelist>
                <!-- 文章列表 -->
            </van-tab>
            <div slot="nav-right" class="placeholder"></div>
            <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow = true">
                <i class="iconfont icon-gengduo"></i>
            </div>
        </van-tabs>
    </div>
</template>

<script>
import { getUserChannels } from '../../api/user'
import articlelist from '../../components/article-list.vue'
import ChannelEdit from './components/channel-edit'
export default {
    name: 'HomeIndex',
    components: {
        articlelist,
        ChannelEdit
    },
    props: {},
    data() {
        return {
            active: 0,
            channels: [], // 频道列表
            isChannelEditShow: false // 这里我们先设置为 true 就能看到弹窗的页面了
        }
    },
    computed: {},
    watch: {},
    created() {
        this.loadchannels()
    },
    mounted() { },
    methods: {
        async loadchannels() {
            try {
                const { data } = await getUserChannels()
                this.channels = data.data.channels
                // console.log(data)
            } catch (err) {
                this.$toast('获取频道失败')
            }
        },
        addChannel(channel) {
            this.channels.push(channel)
        },
        onUpdateActive(index) {
            this.active = index
            // 这个变量名，保持跟视频中的字符错误一致，如果写正确 isChannelEditShow
            this.isChannelEditShow = false
        }

    }

}
</script>

<style scoped lang="less">
.home-container {
    padding-top: 174px;
    padding-bottom: 100px;

    /* 视频问题 */
    /* #这里需要添加deep，这个标签样式并不是我们自己添加的标签所带的样式，所以需要添加/deep/或者全局控制，只有是自己添加的标签才可以直接在scoped中控制样式 */
    /deep/.van-nav-bar__title {
        max-width: unset;
    }

    .search-btn {
        width: 555px;
        height: 64px;
        background-color: #5babfb;
        border: none;
        font-size: 28px;

        .van-icon {
            font-size: 32px;
        }
    }

    /deep/ .channel-tabs {
        .van-tabs__wrap {
            //这里只需要给父节点channel-tabs添加/deep/,这样下边的子节点都会生效
            position: fixed;
            top: 92px;
            z-index: 1;
            left: 0;
            right: 0;
            height: 82px;
        }

        .van-tab {
            //这个比较特殊，我们在结构中写有van-tab标签，但是在渲染的时候没有data标记，所以也需要deep
            border-right: 1px solid #edeff3;
            min-width: 200px;
            font-size: 30px;
            color: #777777;
        }

        .van-tab--active {
            //这里只需要给父节点channel-tabs添加/deep/,这样下边的子节点都会生效
            color: #333333;
        }

        .van-tabs__nav {
            //这里只需要给父节点channel-tabs添加/deep/,这样下边的子节点都会生效
            padding-bottom: 0;
        }

        .van-tabs__line {
            //这里只需要给父节点channel-tabs添加/deep/,这样下边的子节点都会生效
            bottom: 8px;
            width: 31px !important;
            height: 6px;
            background-color: #3296fa;
        }

        .placeholder {
            //占位元素为了解决最后一个tab标签被汉堡盖住问题（看下边的图）
            flex-shrink: 0; //此元素不参与flex的
            width: 66px;
            height: 82px;
        }

        .hamburger-btn {
            position: fixed;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 66px;
            height: 82px;
            background-color: #fff;
            opacity: 0.902;

            i.toutiao {
                font-size: 33px;
            }

            &:before {
                //找到父节点，添加伪元素（这个是汉堡按钮与tab之间的一个竖线）
                content: "";
                position: absolute;
                left: 0;
                width: 1px; //在模拟器上看不到（手机上没问题），如果想看到改为2px
                height: 100%;
                background-image: url(~@/assets/gradient-gray-line.png);
                background-size: contain;
            }
        }
    }
}
</style>
