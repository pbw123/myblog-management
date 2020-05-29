<template>
    <section class="main" :style="{backgroundImage: 'url(' + (!night ? bg : bg2) + ')'}">
        <div style="position: absolute;top: 0;right: 0;width: 200px;height: 200px;"  @click="night=!night"></div>
        <div class="layer">

            <div class="content-w3ls">

                <div class="content-bottom">
                    <div class="form">
                        <div class="field-group">
                            <span class="fa fa-user" aria-hidden="true"></span>
                            <div class="wthree-field">
                            <input v-model="username" name=""
                                   type="text" value="" placeholder="Username" required @keyup.enter="login"
                                   autofocus="autofocus">
                            </div>
                        </div>
                        <div class="field-group">
                            <span class="fa fa-lock" aria-hidden="true"></span>
                            <div class="wthree-field">
                                <input v-model="password" name=""  type="Password" placeholder="Password" @keyup.enter="login">
                            </div>
                        </div>
                        <div class="wthree-field">
                            <button  class="btn" @click="login" >Get Started</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import bg from '../../public/images/bg.jpg'
    import bg2 from '../../public/images/bg2.jpg'

    export default {
        name: "Login",
        data() {
            return{
                username:'',
                password: '',
                night:false,
                bg:bg,
                bg2: bg2
            }
        },
        methods:{
            open(msg, type) {
                this.$message({
                    message: msg,
                    type: type,
                    duration: 1500
                });
            },
            login() {
                if (this.username.trim().length == 0) {
                    this.open("请输入账号",'warning')
                    return;
                }
                if (this.password.trim().length == 0) {
                    this.open("请输入密码",'warning')
                    return;
                }
                let that = this;
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/admin/login',
                    // url:'https://116.62.108.120:8888/admin/login',
                    params: {
                        name:that.username,
                        pass:that.password
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        that.open(res.data.msg, 'success')
                        sessionStorage.setItem('token',JSON.stringify(res.data.data))
                        if (that.$route.query.redirect) {
                            that.$router.push({
                                path:that.$route.query.redirect
                            });
                        }else {
                            that.$router.push({
                                path:'/'
                            });
                        }

                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    console.log(res)
                });
            }
        }
    }

</script>

<style scoped>
@import "../../public/css/style.css";
@import "../../public/css/font-awesome.min.css";

</style>