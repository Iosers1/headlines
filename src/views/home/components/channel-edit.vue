<template>
    <div class="channel-edit">
        <!-- 我的频道 -->
        <van-cell :border="false">
            <template #title>
                <div class="title-text">我的频道</div>
            </template>
            <van-button class="edit-btn" size="mini" round type="danger" plain @click="isEdit = !isEdit">
                {{ isEdit ? '完成' : '编辑' }}</van-button>
        </van-cell>
        <van-grid class='my-grid' :gutter="10">
            <van-grid-item class="grid-item" v-for="(channel, index) in mychannels" :key="index"
                @click="updatamychannel(channel, index)">
                <template #text>
                    <van-icon v-show="isEdit" slot="icon" name="clear"></van-icon>
                    <span class="text" :class="{ active: index === active }">
                        {{ channel.name }}
                    </span>
                </template>
            </van-grid-item>
        </van-grid>
        <!-- 我的频道 -->

        <!-- 频道推荐 -->
        <van-cell :border="false">
            <template #title>
                <div>频道推荐</div>
            </template>
        </van-cell>
        <van-grid class="recommend-grid" :gutter="10">
            <van-grid-item class="grid-item" v-for="(channel, index) in recommendChannels" :key="index"
                :text="channel.name" icon="plus" @click="addChannel(channel)" />
        </van-grid>
        <!-- /频道推荐 -->
    </div>
</template>

<script>
import { getAllChannels } from '@/api/channel.js'
export default {
    name: 'ChannelEdit',
    components: {},
    props: {
        mychannels: {
            type: Array,
            required: true
        },
        active: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            allChannels: [],
            isEdit: false
        }
    },
    computed: {
        recommendChannels() {
            // [1, 2, 3, 4, 5, 6, 7, 8] 判断全集数组的每一项，看该项是否在【我的频道】中，如果不在，说明是推荐频道
            // [1, 2, 3, 4]
            return this.allChannels.filter(channel => {
                // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
                return !this.mychannels.find(myChannel => {
                    return myChannel.id === channel.id
                })

                // return channels
            })
        }
    },
    watch: {},
    created() {
        this.loadAllChannels()
    },
    mounted() { },
    methods: {
        // 加载所有频道
        async loadAllChannels() {
            try {
                const { data } = await getAllChannels()
                this.allChannels = data.data.channels
                console.log(data)
            } catch (err) {
                this.$toast('获取频道列表数据失败')
            }
        },
        addChannel(channel) {
            // this.mychannels.push(channel)
            this.$emit('onaddChannel', channel)
        },
        updatamychannel(channel, index) {
            // console.log(val)
            // this.mychannels.splice(val, 1)
            // this.$emit('delmychannels', val)
            if (this.isEdit) {
                // console.log(this.myChannel);
                // 1. 删除频道项
                // eslint-disable-next-line vue/no-mutating-props
                this.mychannels.splice(index, 1)

                // 2. 如果删除的激活频道之前的频道，则更新激活的频道项
                // 参数1：要删除的元素的开始索引（包括）
                // 参数2：删除的个数，如果不指定，则从参数1开始一直删除到最后
                if (index <= this.active) {
                    // 让激活频道的索引 - 1
                    this.$emit('update-active', this.active - 1, true) // 当前频道被删除之后，上一个频道高亮，并且不关闭弹出层
                }
            } else {
                this.$emit('updata-active', index)
            }
        }
    }
}
</script>

<style scoped lang="less">
.channel-edit {
    padding: 85px 0;

    .title-text {
        font-size: 32px;
        color: #333333;
    }

    .edit-btn {
        width: 104px;
        height: 48px;
        font-size: 26px;
        color: #20c2db;
        border: 1px solid #0273eb;
    }

    /deep/ .grid-item {
        width: 160px;
        height: 86px;

        .van-grid-item__content {
            white-space: nowrap;
            background-color: #f4f5f6;

            .van-grid-item__text {
                font-size: 28px;
                color: #222;
                margin-top: 0;
            }

            .text {
                font-size: 28px;
                color: #222;
                margin-top: 0;
            }

            .active {
                color: red;
            }

            .van-grid-item__icon-wrapper {
                position: unset;
            }
        }

        .van-icon-clear {
            position: absolute;
            right: -10px;
            top: -10px;
            font-size: 30px;
            color: #cacaca;
            z-index: 2;
        }
    }

    /deep/ .recommend-grid {
        .grid-item {
            .van-grid-item__content {
                flex-direction: row;

                .van-icon-plus {
                    font-size: 28px;
                    margin-right: 6px;
                }

                .van-grid-item__text {
                    margin-top: 0;
                }
            }
        }
    }
}
</style>
