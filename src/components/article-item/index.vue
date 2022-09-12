<template>
    <van-cell class="article-item" :to="{
        name: 'article',
        params: {
            articleId: article.art_id
        }
    }">
        <template #title>
            <div class="title van-multi-ellipsis--l2">{{ article.title }}</div>
        </template>
        <template #label>
            <div v-if="article.cover.type === 3" class="cover-wrap">
                <div class="cover-item" v-for="(img, index) in article.cover.images" :key="index">
                    <van-image class="cover-item-img" fit="cover" :src="img" referrerPolicy="no-referrer" />
                </div>
            </div>
            <div class="label-badge-wrap">
                <span>{{ article.aut_name }}</span>
                <span>{{ article.comm_count }}评论</span>
                <span>{{ article.pubdate | relativeTime }}</span>
            </div>
        </template>
        <template>
            <van-image v-if="article.cover.type === 1" class="right-cover" fit="cover" :src="article.cover.images[0]" />
        </template>
    </van-cell>
</template>

<script>
export default {
    name: 'ArticleItem',
    components: {},
    props: {
        article: {
            type: Object,
            required: true
        }
    },
    data() {
        return {}
    },
    computed: {},
    watch: {},
    created() { },
    mounted() { },
    methods: {}
}
</script>

<style scoped lang="less">
.article-item {
    .title {
        font-size: 32px;
        color: #3a3a3a;
    }

    .van-cell__value {
        flex: unset;
        width: 232px;
        height: 146px;
        padding-left: 25px;
    }

    .right-cover {
        width: 232px;
        height: 146px;
    }

    .label-badge-wrap span {
        font-size: 22px;
        color: #b4b4b4;
        margin-right: 25px;
    }

    .cover-wrap {
        display: flex;
        padding: 30px 0;

        //.cover-item:last-child : 选择最后一个子元素
        //.cover-item:not(:last-child) : 选择非最后一个子元素
        .cover-item {
            flex: 1;
            height: 146px;

            &:not(:last-child) {
                //嵌套语法里&代表父元素.cover-item
                padding-right: 4px;
            }

            .cover-item-img {
                width: 100%;
                height: 146px;
            }
        }
    }
}
</style>
