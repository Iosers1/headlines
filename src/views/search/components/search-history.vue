<template>
    <div class="search-history">
        <van-cell title="搜索历史">
            <div v-if="isDeleteShow">
                <span @click="$emit('clear-search-history')">全部删除</span>
                &nbsp;&nbsp;
                <span @click="isDeleteShow = false">完成</span>
            </div>
            <van-icon v-else name="delete" @click="isDeleteShow = true" />
        </van-cell>
        <van-cell :title="item" v-for="(item, index) in searchHistories" :key="index"
            @click="onSearchItemClick(item, index)">
            <van-icon v-show="isDeleteShow" name="close" />
        </van-cell>
    </div>

</template>

<script>
export default {
    name: 'SearchHistory',
    components: {},
    props: {
        searchHistories: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            isDeleteShow: false // 控制删除显示状态
        }
    },
    computed: {},
    watch: {},
    created() { },
    mounted() { },
    methods: {
        onSearchItemClick(item, index) {
            // 如果是删除状态，则执行删除操作
            if (this.isDeleteShow) {
                // eslint-disable-next-line vue/no-mutating-props
                this.searchHistories.splice(index, 1)
            } else {
                // 否则执行搜索操作
                this.$emit('search', item)
            }
        }
    }
}
</script>

<style scoped lang="less">
</style>
