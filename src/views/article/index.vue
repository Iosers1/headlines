<template>
    <div class="article-container">
        <!-- 导航栏 -->
        <van-nav-bar class="page-nav-bar" title="黑马头条">
            <template #left>
                <van-icon name="arrow-left" @click="$router.back()" />
            </template>
        </van-nav-bar>
        <!-- /导航栏 -->

        <div class="main-wrap">
            <!-- 加载中 -->
            <div class="loading-wrap" v-if="isLoading">
                <van-loading color="#3296fa" vertical>加载中</van-loading>
            </div>
            <!-- /加载中 -->

            <!-- 加载完成-文章详情 -->
            <div v-else-if="article.title" class="article-detail">
                <!-- 文章标题 -->
                <h1 class="article-title">{{ article.title }}</h1>
                <!-- /文章标题 -->

                <!-- 用户信息 -->
                <van-cell class="user-info" center :border="false">
                    <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
                    <div slot="title" class="user-name">{{ article.aut_name }}</div>
                    <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
                    <follow-user class="follow-btn" v-model="article.is_followed" :user-id="article.aut_id" />
                    <!-- <follow-user class="follow-btn" :is-followed="article.is_followed" :user-id="article.aut_id"
                        @update-is_followed="article.is_followed = $event" /> -->
                    <!-- <van-button v-if="article.is_followed" class="follow-btn" round size="small" @click="onFollow"
                        :loading="followLoading">已关注
                    </van-button>
                    <van-button class="follow-btn" type="badge" color="#3296fa" round size="small" icon="plus" v-else
                        @click="onFollow" :loading="followLoading">关注
                    </van-button> -->
                </van-cell>
                <!-- /用户信息 -->

                <!-- 文章内容 -->
                <div class="article-content markdown-body" v-html="article.content" ref="articleContent"></div>
                <van-divider>正文结束</van-divider>
                <!-- 文章评论列表 -->
                <comment-list :source="article.art_id" :list="commentList"
                    @onload-success="totalCommentCount = $event.total_count" @reply-click="onReplyClick" />
                <!-- 底部区域 (品论、点赞、转发)-->
                <div class="article-bottom">
                    <van-button class="comment-btn" type="default" round size="small" @click="isPostShow = true">写评论
                    </van-button>
                    <van-icon name="comment-o" :badge="totalCommentCount" color="#777" />
                    <collect-article class="btn-item" v-model="article.is_collected" :articleId="article.art_id" />
                    <!-- <van-icon color="#777" name="star-o" /> -->
                    <like-article class="btn-item" v-model="article.attitude" :article-id="article.art_id" />
                    <!-- <van-icon color="#777" name="good-job-o" /> -->
                    <van-icon name="share" color="#777777"></van-icon>
                </div>
                <!-- /底部区域 -->
                <!-- 发布文章评论 -->
                <van-popup v-model="isPostShow" position="bottom">
                    <comment-post :target="article.art_id" @post-success="onPostSuccess" />
                </van-popup>
                <!-- /发布文章评论 -->
            </div>
            <!-- /加载完成-文章详情 -->

            <!-- 加载失败：404 -->
            <div class="error-wrap" v-else-if="errStatus === 404">
                <van-icon name="failure" />
                <p class="text">该资源不存在或已删除！</p>
            </div>
            <!-- /加载失败：404 -->

            <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
            <div v-else class="error-wrap">
                <van-icon name="failure" />
                <p class="text">内容加载失败！</p>
                <van-button @click="loadArticle" class="retry-btn">点击重试</van-button>
            </div>
            <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
        </div>
        <!-- 评论回复 -->
        <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
            <comment-reply :comment="currentComment" @close="isReplyShow = false" v-if="isReplyShow" />
        </van-popup>
        <!-- /评论回复 -->

    </div>
</template>

<script>
import { getArticleById } from '@/api/article.js'
// import { ImagePreview } from 'vant'
import { addFollow, deleteFollow } from '@/api/user'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'
// ImagePreview({
//     images: [
//         // 图片预览的数组，这里有几张图片，就可以在图片预览这几张图片
//     ],
//     // 预览图片的起始位置
//     startPosition: 1,
//     // 点击关闭
//     onClose() {
//         // do something
//     }
// })
export default {
    name: 'ArticleIndex',
    components: {
        FollowUser,
        CollectArticle,
        LikeArticle,
        CommentList,
        CommentPost,
        CommentReply
    },
    props: {
        articleId: {
            type: [Number, String, Object],
            required: true
        }
    },
    provide: function () {
        // 这个是选项，与data，props同级
        return {
            articleId: this.articleId
        }
    },
    data() {
        return {
            article: {},
            isLoading: true, // 文章加载状态
            errStatus: '', // 请求异常状态 // 文章详情,
            followLoading: false,
            totalCommentCount: 0,
            isPostShow: false, // 控制评论弹出层
            commentList: [],
            isReplyShow: false, // 控制回复评论弹出层
            currentComment: {} // // 当前点击回复的评论项
        }
    },
    computed: {},
    watch: {},
    created() { this.loadArticle() },
    mounted() { },
    methods: {
        async loadArticle() {
            try {
                this.isLoading = true
                const { data } = await getArticleById(this.articleId)
                this.article = data.data
                // console.log(this.article)
                // 注意：数据更新后并不会同步更新页面，所以想要获取数据更新后的页面元素，需要延时处理
                // setTimeout(() => {
                //     this.previewImg()
                // }, 0)
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    this.errStatus = 404
                }
                this.$toast('获取失败')
            }
            // 加载完成
            this.isLoading = false
        },
        // previewImg() {
        //     const contentEl = this.$refs.articleContent
        //     // console.log(contentEl)
        //     const allImg = contentEl.querySelectorAll('img')
        //     console.log(allImg)

        //     const images = []
        //     allImg.forEach((element, index) => {
        //         images.push(element.src)
        //         element.onclick = () => {
        //             ImagePreview({
        //                 images,
        //                 startPosition: index
        //             })
        //         }
        //     })
        // },
        async onFollow() {
            this.followLoading = true // 展示关注按钮的 loading 状态
            try {
                if (this.article.is_followed) {
                    // 已关注，取消关注
                    await deleteFollow(this.article.aut_id)
                    // this.article.is_followed = false
                } else {
                    // 没有关注，添加关注
                    await addFollow(this.article.aut_id)
                    // this.article.is_followed = true
                }

                // 更新视图状态
                this.article.is_followed = !this.article.is_followed
            } catch (err) {
                console.log(err)
                let message = '操作失败，请重试！'
                if (err.response && err.response.status === 400) { // 如果是400错误，则是关注自己的结果
                    message = '你不能关注你自己！'
                }
                this.$toast(message)
            }
            this.followLoading = false // 关闭关注按钮的 loading 状态
        },
        onPostSuccess(data) {
            // 关闭弹出层
            this.isPostShow = false
            // 将发布内容显示到列表顶部
            this.commentList.unshift(data.new_obj)
        },
        onReplyClick(comment) {
            // 将子组件中传给我评论对象存储到当前组件
            this.currentComment = comment
            // 显示评论回复弹出层
            this.isReplyShow = true
        }
    }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
    .main-wrap {
        position: fixed;
        left: 0;
        right: 0;
        top: 92px;
        bottom: 88px;
        overflow-y: scroll;
        background-color: #fff;
    }

    .article-detail {
        .article-title {
            font-size: 40px;
            padding: 50px 32px;
            margin: 0;
            color: #3a3a3a;
        }

        .user-info {
            padding: 0 32px;

            .avatar {
                width: 70px;
                height: 70px;
                margin-right: 17px;
            }

            .van-cell__label {
                margin-top: 0;
            }

            .user-name {
                font-size: 24px;
                color: #3a3a3a;
            }

            .publish-date {
                font-size: 23px;
                color: #b7b7b7;
            }

            .follow-btn {
                width: 170px;
                height: 58px;
            }
        }

        .article-content {
            padding: 55px 32px;

            /deep/ p {
                text-align: justify;
            }
        }
    }

    .loading-wrap {
        padding: 200px 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
    }

    .error-wrap {
        padding: 200px 32px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #fff;

        .van-icon {
            font-size: 122px;
            color: #b4b4b4;
        }

        .text {
            font-size: 30px;
            color: #666666;
            margin: 33px 0 46px;
        }

        .retry-btn {
            width: 280px;
            height: 70px;
            line-height: 70px;
            border: 1px solid #c3c3c3;
            font-size: 30px;
            color: #666666;
        }
    }

    .article-bottom {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-sizing: border-box;
        height: 88px;
        border-top: 1px solid #d8d8d8;
        background-color: #fff;

        .comment-btn {
            width: 282px;
            height: 46px;
            border: 2px solid #eeeeee;
            font-size: 30px;
            line-height: 46px;
            color: #a7a7a7;
        }

        .van-icon {
            font-size: 40px;

            .van-info {
                font-size: 16px;
                background-color: #e22829;
            }
        }
    }
}
</style>
