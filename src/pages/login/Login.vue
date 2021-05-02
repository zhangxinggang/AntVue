<template>
  <common-layout>
    <div class="main">
      <div class="top">
        <div class="header">
          <span class="title">{{systemName}}</span>
        </div>
        <div class="desc">前端UI展示</div>
      </div>
      <div class="login">
        <a-form @submit="onSubmit" :form="form">
          <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;" />
          <a-form-item>
            <a-input
              autocomplete="autocomplete"
              size="large"
              placeholder="admin"
              v-decorator="['name', {rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]"
            >
              <a-icon slot="prefix" type="user" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              placeholder="123456"
              autocomplete="autocomplete"
              type="password"
              v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
            >
              <a-icon slot="prefix" type="lock" />
            </a-input>
          </a-form-item>
          <div v-if="0">
            <a-checkbox :checked="true" >自动登录</a-checkbox>
            <a style="float: right">忘记密码</a>
          </div>
          <a-form-item>
            <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
import {mapActions} from 'vuex'

export default {
  name: 'Login',
  components: {CommonLayout},
  data () {
    return {
      logging: false,
      error: '',
      form: this.$form.createForm(this)
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    ...mapActions('account', ['Login']),
    onSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true
          const name = this.form.getFieldValue('name')
          const password = this.form.getFieldValue('password')
          this.Login({name, password}).then(data=>{
            this.logging = false
            this.$router.push('/dashboard/workplace')
          }).catch(e=>{
            this.error = e.message
          })
        }
      })
    }
  },
  mounted(){
    
  }
}
</script>

<style lang="less" scoped>
  .common-layout{
    .main{
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      padding: 0 40px;
    }
    .top {
      text-align: center;
      .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .title {
          font-size: 33px;
          color: @title-color;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: @text-color-second;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login{
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button{
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: @text-color-second;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
</style>
