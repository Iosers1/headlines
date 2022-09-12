<template>
    <div class="user-profile">
        <!-- 导航栏 -->
        <van-nav-bar class="page-nav-bar" title="个人信息" left-arrow @click-left="$router.back()" />
        <!-- /导航栏 -->
        <!-- 头像修改 -->
        <input type="file" hidden ref="file" @change='onFileChange'>
        <van-cell title="头像" is-link class="photo-cell" center @click="$refs.file.click()">
            <van-image class="avatar" fit="cover" round :src="user.photo" />
        </van-cell>
        <!-- 编辑头像弹层 -->
        <van-popup v-model="isUpdatePhotoShow" style="height: 100%" position="bottom">
            <update-photo v-if="isUpdatePhotoShow" :img="img" @close="isUpdatePhotoShow = false"
                @update-photo="user.photo = $event" />
        </van-popup>
        <!-- 编辑头像弹层 -->
        <!-- 头像修改 -->

        <van-cell title="昵称" @click="isUpdateNameShow = true" :value="user.name" is-link />
        <!-- 编辑昵称弹层 -->
        <van-popup v-model="isUpdateNameShow" style="height: 100%;" position="bottom">
            <update-name v-if="isUpdateNameShow" @close="isUpdateNameShow = false" v-model="user.name" />
        </van-popup>
        <!-- 编辑昵称弹层 -->
        <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link @click="isUpdateGenderShow = true" />
        <!-- 编辑性别弹层 -->
        <van-popup v-model="isUpdateGenderShow" position="bottom">
            <update-gender v-if="isUpdateGenderShow" v-model="user.gender" @close="isUpdateGenderShow = false" />
        </van-popup>
        <!-- 编辑性别弹层 -->
        <van-cell title="生日" :value="user.birthdy" is-link @click="isUpdateBirthdayShow = true" />
        <!-- 编辑生日弹层 -->
        <van-popup v-model="isUpdateBirthdayShow" position="bottom">
            <update-birthday v-if="isUpdateBirthdayShow" v-model="user.birthday"
                @close="isUpdateBirthdayShow = false" />
        </van-popup>
        <!-- 编辑生日弹层 -->
    </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdatePhoto from './components/update-photo'
export default {
    name: 'UserProfile',
    components: {
        UpdateName,
        UpdateGender,
        UpdateBirthday,
        UpdatePhoto
    },
    props: {},
    data() {
        return {
            user: {}, // 个人信息
            isUpdateNameShow: false,
            isUpdateGenderShow: false,
            isUpdateBirthdayShow: false,
            isUpdatePhotoShow: false,
            img: ''
        }
    },
    computed: {},
    watch: {},
    created() { this.loadUserProfile() },
    mounted() { },
    methods: {
        async loadUserProfile() {
            try {
                const { data } = await getUserProfile()
                this.user = data.data
            } catch (err) {
                this.$toast('获取数据失败')
            }
        },
        // 获取头像文件信息的方法
        onFileChange() {
            // 获取文件对象
            const file = this.$refs.file.files[0]
            // 基于文章对象获取 blob 数据
            const data = window.URL.createObjectURL(file)
            this.img = window.URL.createObjectURL(file)
            console.log(data)
            // 展示预览图片弹出层
            this.isUpdatePhotoShow = true

            // file-input 如果选了同一个文件不会触发 change 事件
            // 解决办法就是每次使用完毕，把它的 value 清空
            this.$refs.file.value = ''
        }
    }
}
</script>

<style scoped lang="less">
.user-profile {
    .avatar {
        width: 60px;
        height: 60px;
    }

    .van-popup {
        background-color: #f5f7f9;
    }

    .photo-cell {
        .van-cell__value {
            display: flex;
            flex-direction: row-reverse;
        }
    }
}
</style>
