<template>
    <div>
        <el-table
                ref="multipleTable"
                tooltip-effect="dark"
                :data="tableData"
                style="width: 100%"
                @selection-change="handleSelectionChange">

            <el-table-column
                    label="top背景图1"
                    width="120">
                <template slot-scope="scope">
                    <div  @click="activeUpdate(scope.row.bgImg,'bg_img')">
                        <img :src="info.bgImg" alt="" class="img">
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="top背景图2"
                    width="120">
                <template slot-scope="scope">
                    <div  @click="activeUpdate(scope.row.bgImg2,'bg_img2')">
                        <img :src="info.bgImg2" alt="" class="img">
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="背景图1"
                    width="120">
                <template slot-scope="scope">
                    <div  @click="activeUpdate(scope.row.img,'img')">
                        <img :src="info.img" alt="" class="img">
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                    label="背景图2"
                    width="120">
                <template slot-scope="scope">
                    <div  @click="activeUpdate(scope.row.nightImg,'night_img')">
                        <img :src="info.nightImg" alt="" class="img">
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                    label="左上角logo1"
                    width="120">
                <template slot-scope="scope">
                    <div @click="activeUpdate(scope.row.logo,'logo')">
                        <img :src="info.logo" alt="" class="img" >
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                    label="左上角logo2"
                    width="120">
                <template slot-scope="scope">
                    <div @click="activeUpdate(scope.row.logo2,'logo2')">
                        <img :src="info.logo2" alt="" class="img" >
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="支付宝打赏二维码"
                    width="150">
                <template slot-scope="scope">
                    <div @click="activeUpdate(scope.row.payZfb,'pay_zfb')">
                        <img :src="info.payZfb" alt="" class="img" >
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="微信打赏二维码"
                    width="150">
                <template slot-scope="scope">
                    <div @click="activeUpdate(scope.row.payWechat,'pay_wechat')">
                        <img :src="info.payWechat" alt="" class="img">
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="公众号"
                    width="120">
                <template slot-scope="scope">
                    <div  @click="activeUpdate(scope.row.gzh,'gzh')">
                        <img :src="info.gzh" alt="" class="img">
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="侧方导航背景图1"
                    width="120">
                <template slot-scope="scope">
                    <div @click="activeUpdate(scope.row.wBar,'w_bar')">
                        <img :src="info.wBar" alt="" class="img">
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="侧方导航背景图2"
                    width="120">
                <template slot-scope="scope">
                    <div @click="activeUpdate(scope.row.wBar2,'w_bar2')">
                        <img :src="info.wBar2" alt="" class="img">
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="备案号"
                    width="120">
                <template slot-scope="scope">
                    <div @click="activeUpdate(scope.row.icp,'icp')" class="img">
                        {{info.icp}}
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="修改" :visible.sync="dialogFormVisible" @close="cancel">
            <el-form :model="info">
                <el-form-item label="" :label-width="formLabelWidth">
                    <el-upload
                            class="avatar-uploader"
                            :action="this.action"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imgURL" :src="imgURL" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-input v-model="imgURL"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="updateWeb(imgURL)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Web",
        data() {
            return {
                action: this.requestURL + '/image/webInfoImage',
                web: {
                    id: '',
                    bgImg: '',
                    bgImg2: '',
                    img: '',
                    nightImg: '',
                    logo: '',
                    logo2: '',
                    payZfb: '',
                    payWechat: '',
                    gzh: '',
                    wBar: '',
                    wBar2: '',
                    icp: ''
                },
                dialogFormVisible: false,
                multipleSelection: [],
                info: {},
                tableData: [{id: 1, name: 'wen'}],
                srcList: [],
                formLabelWidth: '120px',
                imageUrl: '',
                imgURL: '',
                column: ''
            }
        },
        methods: {
            activeUpdate(url, column) {
                this.dialogFormVisible = true
                this.imgURL = url
                this.imageUrl=url
                this.column = column
            },
            cancel() {
                this.dialogFormVisible = false
                this.imgURL=''
            },
            open(msg, type) {
                this.$message({
                    message: msg,
                    type: type,
                    duration: 2000
                });
            },
            updateWeb(val) {
                if (val.trim().length===0) {
                    this.open("图片地址不能为空", 'warning')
                    return;
                }
                if (this.imgURL.trim() === this.imageUrl.trim()) {
                    this.dialogFormVisible=false
                    return;
                }
                let that = this;
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/web/updateWeb',
                    params: {
                        url: that.imgURL,
                        column: that.column
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        that.open(res.data.msg, 'success')
                        that.getWebInfo()
                        that.dialogFormVisible = false
                        that.imgURL=''
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    console.log(res)
                });
            },

            handleAvatarSuccess(res, file) {
                this.imgURL = res
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';

                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getWebInfo() {
                let that = this
                this.$ajax.get(this.requestURL + '/web/getWebInfo')
                    .then(res => {
                        if (res.data.code === 0) {
                            that.info = res.data.data
                            that.tableData[0] = res.data.data
                            that.srcList.push(that.info.bgImg)
                            that.srcList.push(that.info.bgImg2)
                            that.srcList.push(that.info.logo)
                            that.srcList.push(that.info.logo2)
                            that.srcList.push(that.info.payZfb)
                            that.srcList.push(that.info.payWeChat)
                            that.srcList.push(that.info.wBar)
                            that.srcList.push(that.info.wBar2)
                            that.srcList.push(that.info.gzh)
                        } else {
                            console.log(res)
                        }
                    }).catch(res => {
                    console.log(res)
                })
            }
        },
        mounted() {
            this.getWebInfo()
        }
    }
</script>

<style scoped>
    .img {
        width: 100px;
        height: 100px;
    }
    .img:hover{
        cursor: pointer;
    }
    .avatar-uploader .avatar{
        width: 70%;
        max-width: 800px;
        max-height: 500px;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
</style>