<template>
    <div class="update-birthday">
        <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate"
            @cancel="$emit('close')" @confirm="onConfirm" />
    </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
    // 组件名称
    name: 'UpdateBirthday',
    // 局部注册的组件
    components: {},
    // 组件参数 接收来自父组件的数据
    props: {
        value: {
            type: String,
            required: true
        }
    },
    // 组件状态值
    data() {
        return {
            minDate: new Date(1970, 0, 1),
            maxDate: new Date(),
            currentDate: new Date(this.value)
        }
    },
    // 计算属性
    computed: {},
    // 侦听器
    watch: {},
    created() { },
    mounted() { },
    // 组件方法
    methods: {
        async onConfirm() {
            this.$toast.loading({
                message: '保存中...',
                forbidClick: true,
                duration: 0
            })
            try {
                const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')

                await updateUserProfile({
                    birthday: currentDate
                })
                // 更新视图
                this.$emit('input', currentDate)
                // 关闭弹层
                this.$emit('close')
                // 提示成功
                this.$toast.success('更新成功')
            } catch (err) {
                this.$toast.fail('更新失败')
            }
        }
    }
}
</script>

<style scoped lang="less">
</style>
