<template>
    <div class="login-container">
        <!-- 导航栏 -->
        <van-nav-bar class="page-nav-bar" title="登录">
            <template #left>
                <van-icon name="cross" @click="$router.back()" />
            </template>
        </van-nav-bar>
        <!-- /导航栏 -->

        <!-- 登录表单 -->
        <van-form @submit="onSubmit" ref="loginForm">
            <van-field name="mobile" placeholder="请输入手机号" v-model="user.mobile" :rules="userFormRules.mobile">
                <!--通过插槽处理自定义图标 -->
                <template #left-icon>
                    <i class=" iconfont icon-shouji"></i>
                </template>
            </van-field>
            <van-field type="number" name="code" placeholder="请输入验证码" v-model="user.code" :rules="userFormRules.code"
                maxlength="6">
                <!-- 通过插槽处理自定义图标 -->
                <template #left-icon>
                    <i class="iconfont icon-yanzhengma54"></i>
                </template>
                <!-- 新版本插槽的写法 ， 相当于slot="button" -->
                <template #button>
                    <!-- time: 倒计时时间 -->
                    <van-count-down v-if="isCountDownShow" :time="1000 * 60" format="ss s"
                        @finish="isCountDownShow = false" />
                    <van-button v-else class="send-sms-btn" native-type="button" round size="small" type="default"
                        @click="onSendSms">
                        发送验证码</van-button>
                </template>
            </van-field>
            <div class="login-btn-wrap">
                <van-button class="login-btn" block type="badge" native-type="submit">
                    登录
                </van-button>
            </div>
        </van-form>
        <!-- /登录表单 -->
    </div>
</template>

<script>
// 导入登录api
import { login, sendSms } from '@/api/user'
export default {
    name: 'LoginIndex',
    components: {},
    props: {},
    data() {
        return {
            user: {
                mobile: '',
                code: ''
            },
            userFormRules: {
                mobile: [{
                    required: true,
                    message: '手机号不能为空'
                }, {
                    pattern: /^1[3|5|7|8]\d{9}$/,
                    message: '手机号格式错误'
                }],
                code: [{
                    required: true,
                    message: '验证码不能为空'
                }, {
                    pattern: /^\d{6}$/,
                    message: '验证码格式错误'
                }]
            },
            isCountDownShow: false
        }
    },
    computed: {},
    watch: {},
    created() { },
    mounted() { },
    methods: {
        async onSubmit() {
            // 开始转圈圈
            this.$toast.loading({
                duration: 0, // 持续时间，默认时间2s，0表示持续展示不停止，直到成功或失败
                forbidClick: true, // 是否禁止背景点击（forbid：禁止）
                message: '登录中...' // 提示消息
            })

            try {
                const { data } = await login(this.user)
                console.log('登录成功', data)
                this.$store.commit('setUser', data.data)
                this.$toast.success('登录成功')
                // 成功后跳转到原来的页面
                this.$router.back()
            } catch (err) {
                if (err.response.status === 400) {
                    this.$toast.fail('手机号或验证码错误')
                } else {
                    this.$toast.fail('登录失败，请稍后重试')
                }
            }
        },
        async onSendSms() {
            // 1. 校验手机号
            try {
                await this.$refs.loginForm.validate('mobile')
            } catch (err) {
                return console.log('验证失败', err)
            }

            // 2. 验证通过，显示倒计时
            this.isCountDownShow = true
            // 3. 请求发送验证码
            try {
                await sendSms(this.user.mobile)
                this.$toast('发送成功')
            } catch (err) {
                // 发送失败，关闭倒计时
                this.isCountDownShow = false
                if (err.response.status === 429) {
                    this.$toast('发送太频繁了，请稍后重试')
                } else {
                    this.$toast('发送失败，请稍后重试')
                }
            }
        }
    }
}
</script>

<style scoped lang="less">
.login-container {
    .toutiao {
        font-size: 37px;
    }

    .send-sms-btn {
        width: 162px;
        height: 46px;
        line-height: 46px;
        background-color: #ededed;
        font-size: 22px;
        color: #666;
    }

    .login-btn-wrap {
        padding: 53px 33px;

        .login-btn {
            background-color: #6db4fb;
            border: none;
        }
    }
}
</style>
