<template>
    <div class="about">
        <textarea v-model="title" placeholder="标题"></textarea>
        <mavon-editor v-model="context" :toolbars="toolbars" :fontSize="fontSize" @keydown=""/>
        <div class="info">
            <div class="imgs">
                <div class="avatar-uploader">
                    <el-upload
                            class="uploader"
                            :action="this.action"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-input v-model="imageUrl"></el-input>
                    <div class="name">白天1</div>
                </div>

                <div class="avatar-uploader">
                    <el-upload
                            class="uploader"
                            :action="this.action"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccessTwo"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-input v-model="imageUrl2"></el-input>
                    <div class="name">白天2</div>

                </div>

                <div class="avatar-uploader">
                    <el-upload
                            class="uploader"
                            :action="this.action"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccessThree"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl3" :src="imageUrl3" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-input v-model="imageUrl3"></el-input>

                    <div class="name">夜晚1</div>
                </div>

                <div class="avatar-uploader">
                    <el-upload
                            class="uploader"
                            :action="this.action"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccessFour"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl4" :src="imageUrl4" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>

                    </el-upload>
                    <el-input v-model="imageUrl4"></el-input>
                    <div class="name">夜晚2</div>
                </div>
            </div>
            <div class="other">

                <el-form :inline="true">
                    <el-form-item label="浏览" :label-width="formLabelWidth">
                        <el-input  v-model.number="scan" autocomplete="off" autofocus
                                  @keyup.enter.native="updateArt()"></el-input>
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth">
                        <div class="block">时间
                            <el-date-picker
                                    v-model="value3"
                                    type="datetime"
                                    :placeholder="placeholder"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                        </div>

                    </el-form-item>

                </el-form>

            </div>
        </div>
        <div class="btn">
            <el-button @click="cancel('确定放弃添加文章？')" v-show="addBtn">取消</el-button>
            <el-button @click="cancel('确定放弃编辑？')" v-show="!addBtn">取消</el-button>

            <el-button @click="addArt" v-show="addBtn" type="primary">提交</el-button>
            <el-button @click="updateArt" v-show="!addBtn" type="primary">提交</el-button>

        </div>

    </div>
</template>
<script>
    import qs from 'qs';

    export default {
        data() {
            return {
                action: this.requestURL + '/image/articleHeaderImage',
                scan: '99',
                id: '',
                formLabelWidth: '120px',
                placeholder: '',
                value3: '',
                addBtn: true,
                context: '',//输入的数据
                title: '',
                imageUrl: '',
                imageUrl2: '',
                imageUrl3: '',
                imageUrl4: '',
                userId: '',
                toolbars: {
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    mark: true, // 标记
                    superscript: true, // 上角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    help: true, // 帮助
                    code: true, // code
                    subfield: true, // 是否需要分栏
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    /* 1.3.5 */
                    undo: true, // 上一步
                    trash: true, // 清空
                    save: true, // 保存（触发events中的save事件）
                    /* 1.4.2 */
                    navigation: true,// 导航目录

                },
                fontSize: '20px',
                article: {
                    title: '',
                    imgURL: '',
                    imgURL2: '',
                    imgURL3: '',
                    imgURL4: '',
                    love: '',
                    time: '',
                    content: ''
                }
            }
        },
        methods: {
            changeTime(value) {
                let date = new Date(value);
                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let minute = date.getMinutes();
                let second = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
            },

            updateArt() {

                let time = this.placeholder
                if (this.value3) {
                    if (this.title.trim() === this.article.title.trim()
                        && this.context.trim() === this.article.content.trim()
                        && this.imageUrl.trim() === this.article.imgURL.trim()
                        && this.imageUrl2.trim() === this.article.imgURL2.trim()
                        && this.imageUrl3.trim() === this.article.imgURL3.trim()
                        && this.scan === this.article.love
                        && this.imageUrl4.trim() === this.article.imgURL4.trim()
                        && this.value3.trim() === this.placeholder
                    ) {
                        this.$router.back(-1)
                        return;
                    }
                    time = this.value3

                } else {
                    if (this.title.trim() === this.article.title.trim()
                        && this.context.trim() === this.article.content.trim()
                        && this.imageUrl.trim() === this.article.imgURL.trim()
                        && this.imageUrl2.trim() === this.article.imgURL2.trim()
                        && this.imageUrl3.trim() === this.article.imgURL3.trim()
                        && this.scan === this.article.love
                        && this.imageUrl4.trim() === this.article.imgURL4.trim()
                    ) {
                        this.$router.back(-1)
                        return;
                    }
                }
                let that = this
                if (this.title.trim().length === 0) {
                    this.open('请输入标题', 'warning')
                    return;
                }
                if (this.context.trim().length === 0) {
                    this.open('请输入内容', 'warning')
                    return;
                }
                if (!this.imageUrl || !this.imageUrl2 || !this.imageUrl3 || !this.imageUrl4) {
                    this.open('封面图片不能为空', 'warning')
                    return;
                }
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/articleManager/updateArticle',
                    params: {
                        id: that.id,
                        content: that.context,
                        scan: that.scan,
                        img: that.imageUrl,
                        hoverImg: that.imageUrl2,
                        img2: that.imageUrl3,
                        hoverImg2: that.imageUrl4,
                        time: time,
                        title: that.title
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        that.open(res.data.msg, 'success')
                        that.$router.back(-1)
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    console.log(res)
                });
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = res
            },
            handleAvatarSuccessTwo(res, file) {
                this.imageUrl2 = res
            },
            handleAvatarSuccessThree(res, file) {
                this.imageUrl3 = res
            },
            handleAvatarSuccessFour(res, file) {
                this.imageUrl4 = res
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';

                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            cancel(msg) {
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.back(-1)
                }).catch(() => {

                });
            },
            addArt() {
                if (this.title.trim().length === 0) {
                    this.open('请输入标题', 'warning')
                    return;
                }
                if (this.context.trim().length === 0) {
                    this.open('请输入内容', 'warning')
                    return;
                }
                if (!this.imageUrl || !this.imageUrl2 || !this.imageUrl3 || !this.imageUrl4) {
                    this.open('封面图片不能为空', 'warning')
                    return;
                }
                let time
                if (this.value3) {
                    time=this.value3
                }
                let token = JSON.parse(sessionStorage.getItem('token'));
                const data = {
                    'userId': token.id,
                    'content': this.context,
                    'title': this.title,
                    'img': this.imageUrl,
                    'hoverImg': this.imageUrl2,
                    'img2': this.imageUrl3,
                    'hoverImg2': this.imageUrl4,
                    time: time,
                    scan: this.scan
                }
                let that = this
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/articleManager/addArticle',
                    data: qs.stringify(data),

                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        that.open(res.data.msg, 'success')
                        that.$router.back(-1)
                    } else {
                        console.log(res.data.msg)
                    }
                }).catch(res => {
                    console.log(res)
                });
            },
            open(msg, type) {
                this.$message({
                    message: msg,
                    type: type,
                    duration: 2000
                });
            },
            createTime() {
                let date = new Date();
                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let minute = date.getMinutes();
                let second = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
            }
        },
        mounted() {
            if (this.$route.params.data) {
                let data = this.$route.params.data
                this.context = data.aContent
                this.title = data.aTitle
                this.imageUrl = data.aImg
                this.imageUrl2 = data.hoverImg
                this.imageUrl3 = data.aImg2
                this.imageUrl4 = data.hoverImg2

                this.addBtn = false
                let t = this.changeTime(data.aTime)
                this.placeholder = t
                this.scan = data.aScan
                this.id = data.aId

                this.article.title = data.aTitle
                this.article.content = data.aContent
                this.article.imgURL = data.aImg
                this.article.imgURL2 = data.hoverImg
                this.article.imgURL3 = data.aImg2
                this.article.imgURL4 = data.hoverImg2
                this.article.love = data.aScan
            } else {
                this.placeholder ='请选择时间'
            }
        }
    };
</script>
<style scoped lang="scss">
    @import "../assets/scss/articleMarkdown";
</style>
