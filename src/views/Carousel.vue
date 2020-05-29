2<template>
    <div>
        <div class="btn">
            <el-button type="primary" class="topBtn" @click="activeAdd">添加</el-button>
        </div>
        <el-table
                ref="multipleTable"
                tooltip-effect="dark"
                :data="tableData"
                style="width: 100%"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    label="ID"
                    width="100"
                    show-overflow-tooltip>
                <template slot-scope="scope">{{ scope.row.cId}}</template>
            </el-table-column>

            <el-table-column
                    label="PC端"
                    width="120">
                <template slot-scope="scope">
                    <el-image
                            style="width: 100px;"
                            :src="scope.row.cPc"
                            :preview-src-list="srcList">
                    </el-image>

                </template>
            </el-table-column>

            <el-table-column
                    label="PC端夜间"
                    width="120">
                <template slot-scope="scope">
                    <el-image
                            style="width: 100px;"
                            :src="scope.row.cNight"
                            :preview-src-list="srcList2">
                    </el-image>

                </template>
            </el-table-column>

            <el-table-column
                    label="手机端"
                    width="120">
                <template slot-scope="scope">
                    <el-image
                            style="width: 100px;"
                            :src="scope.row.cMobile"
                            :preview-src-list="srcListMobile">
                    </el-image>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="activeUpdate(scope.row.cPc,scope.row.cMobile,scope.row.cId,scope.row.cNight)"
                               type="" v-show="!addBtn">编辑
                    </el-button>
                    <el-button type="danger" @click="remove(scope.row.cId)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

        <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="cancel">
            <el-form :model="carousel">
                <el-form-item label="电脑端" :label-width="formWidth">
                    <div class="icon">
                        <el-upload
                                class="avatar-uploader"
                                :action="this.action"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="imgUrl" :src="imgUrl" class="avatar"
                                 style="width: 100px;">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>

                        </el-upload>
                        <el-input v-model="imgUrl"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="电脑端夜间" :label-width="formWidth">
                    <div class="icon">
                        <el-upload
                                class="avatar-uploader"
                                :action="this.action"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccessTwo"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="imgUrl2" :src="imgUrl2" class="avatar"
                                 style="width: 100px;">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>

                        </el-upload>
                        <el-input v-model="imgUrl2"></el-input>
                    </div>
                </el-form-item>

                <el-form-item label="手机端" :label-width="formWidth">
                    <div class="icon">
                        <el-upload
                                class="avatar-uploader"
                                :action="this.action"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccessMobile"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="imgUrlMobile" :src="imgUrlMobile" class="avatar"
                                 style="width: 100px;">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <el-input v-model="imgUrlMobile"></el-input>
                    </div>

                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button v-show="!addBtn" type="primary" @click="updateCarousel()">确定</el-button>
                <el-button v-show="addBtn" type="primary" @click="addAtten()">确定</el-button>
            </div>

        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Carousel",
        data() {
            return {
                formWidth: '120px',
                action: this.requestURL + '/image/carouselIconImage',
                title: '修改',
                dialogFormVisible: false,
                addBtn: false,
                imgUrl: '',
                imgUrl2: '',
                imgUrlMobile: '',
                formLabelWidth: '120px',
                tableData: [],
                multipleSelection: [],
                srcList: [],
                srcList2: [],
                srcListMobile: [],
                carousel: {
                    id: '',
                    pc: '',
                    pc2: '',
                    mobile: ''
                }
            }
        },
        methods: {
            remove(val) {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delCarousel(val)
                }).catch(() => {

                });
            },
            delCarousel(val) {
                let that = this
                this.$ajax.get(this.requestURL + '/carousel/delCarousel?id=' + val)
                    .then(res => {
                        if (res.data.code === 0) {
                            that.open(res.data.msg, 'success')
                            that.getAllCarousel()
                        } else {
                            console.log(res)
                        }
                    }).catch(res => {
                    console.log(res)
                })
            },
            activeAdd() {
                this.dialogFormVisible = true
                this.addBtn = true
                this.imgUrl = ''
                this.imgUrlMobile = ''
                this.title='添加'
                this.carousel.pc=''
                this.carousel.mobile=''
                this.carousel.pc2=''
                this.carousel.id=''
            },
            addAtten() {
                if (this.imgUrlMobile.trim().length==0&& this.imgUrl.trim().length==0&&this.imgUrl2.trim().length==0) {
                    this.dialogFormVisible = false
                    return;
                }
                let that = this;
                let icon;
                let iconMobile;
                if (this.imgUrl) {
                    icon = this.imgUrl
                }
                if (this.imgUrlMobile) {
                    iconMobile = this.imgUrlMobile
                }
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/carousel/addCarousel',
                    params: {
                        mobileImg: iconMobile,
                        pcImg: icon,
                        pcImg2: that.imgUrl2
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        that.open(res.data.msg, 'success')
                        that.dialogFormVisible = false
                        that.getAllCarousel()
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    console.log(res)
                });

            },
            cancel() {
                this.dialogFormVisible = false
                this.imgUrl = ''
                this.imgUrl2 = ''
                this.imgUrlMobile = ''
                this.carousel.id=''
                this.carousel.mobile=''
                this.carousel.pc=''
                this.carousel.pc2=''
            },
            open(msg, type) {
                this.$message({
                    message: msg,
                    type: type,
                    duration: 2000
                });
            },
            activeUpdate(pc, mobile, id, pc2) {
                this.dialogFormVisible = true
                this.addBtn = false
                this.carousel.pc = pc
                this.carousel.pc2 = pc2
                this.carousel.mobile = mobile
                this.carousel.id = id
                this.imgUrl = pc
                this.imgUrl2 = pc2
                this.imgUrlMobile = mobile
            },
            updateCarousel() {
                let that = this
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/carousel/updateCarousel',
                    params: {
                        id: that.carousel.id,
                        pcImg: that.imgUrl,
                        pcImg2: that.imgUrl2,
                        mobileImg: that.imgUrlMobile
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        that.open(res.data.msg, 'success')
                        that.dialogFormVisible = false
                        that.getAllCarousel()
                        that.imgUrl = ''
                        that.imgUrlMobile = ''
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    console.log(res)
                });
            },
            handleAvatarSuccess(res, file) {
                this.imgUrl = res
            },
            handleAvatarSuccessTwo(res, file) {
                this.imgUrl2 = res
            },
            handleAvatarSuccessMobile(res, file) {
                this.imgUrlMobile = res
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
            getAllCarousel() {
                let that = this
                this.$ajax.get(this.requestURL + '/carousel/getAllCarousel')
                    .then(res => {
                        if (res.data.code === 0) {
                            that.tableData = res.data.data
                            let len = res.data.data.length
                            for (let i = 0; i < len; i++) {
                                that.srcList.push(res.data.data[i].cPc)
                                that.srcList2.push(res.data.data[i].cNight)
                                that.srcListMobile.push(res.data.data[i].cMobile)
                            }
                        } else {
                            console.log(res)
                        }
                    }).catch(res => {
                    console.log(res)
                })
            }

        },
        mounted() {
            this.getAllCarousel()
        }
    }
</script>

<style scoped>
    .icon {
        display: flex;
    }
    .avatar-uploader{
        margin-right: 30px;
    }
</style>