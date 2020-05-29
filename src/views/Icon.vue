<template>
    <div>
        <div class="btn">
            <el-button type="primary" @click="activeAdd" class="topBtn">添加</el-button>
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
                <template slot-scope="scope">{{ scope.row.iId}}</template>
            </el-table-column>

            <el-table-column
                    label="图片"
                    width="120">
                <template slot-scope="scope">
                    <el-image
                            style="width: 50px; height: 50px;border-radius: 50%"
                            :src="scope.row.iUrl"
                            :preview-src-list="srcList">
                    </el-image>

                </template>
            </el-table-column>

            <el-table-column
                    label="操作"
                    width="200">
                <template slot-scope="scope" >
                    <el-button  @click="activeUpdate(scope.row.iId,scope.row.iUrl)">编辑
                    </el-button>
                    <el-button type="danger" @click="remove(scope.row.iId)">删除
                    </el-button>
                </template>
            </el-table-column>


        </el-table>

        <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="cancel">
            <el-form :model="icon">
                <el-form-item label="头像">
                    <el-upload
                            class="avatar-uploader"
                            :action="this.action"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="iconURL" :src="iconURL" class="avatar"
                             style="width: 70%;max-width: 500px;">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="iconURL"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button v-show="!addBtn" type="primary" @click="updateDefaultIcon()">确定</el-button>
                <el-button v-show="addBtn" type="primary" @click="addDefaultIcon()">确定</el-button>
            </div>

        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Carousel",
        data() {
            return {
                action: this.requestURL+'/image/carouselIconImage',
                title: '修改',
                tableData: [],
                multipleSelection: [],
                srcList: [],
                dialogFormVisible: false,
                addBtn: false,
                imgUrl: '',
                iconURL: '',
                icon: {
                    id: '',
                    url: ''
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
                    this.delDefaultIcon(val)
                }).catch(() => {

                });
            },
            delDefaultIcon(val) {
                let that = this
                this.$ajax.get(this.requestURL + '/carousel/delDefaultIcon?id=' + val)
                    .then(res => {
                        if (res.data.code === 0) {
                            that.open(res.data.msg, 'success')
                            that.getDefaultIcon()
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
                this.icon.url=''
                this.icon.id=''
                this.title='添加'
            },
            addDefaultIcon() {
                if (this.iconURL == '') {
                    this.dialogFormVisible = false
                    return;
                }
                let that = this
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/carousel/addDefaultIcon',
                    params: {
                        icon: that.iconURL
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        that.open(res.data.msg, 'success')
                        that.dialogFormVisible = false
                        that.getDefaultIcon()
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
                this.icon.id=''
                this.icon.url=''
                this.iconURL=''
            },
            open(msg, type) {
                this.$message({
                    message: msg,
                    type: type,
                    duration: 2000
                });
            },
            activeUpdate(id, url) {
                this.dialogFormVisible = true
                this.addBtn = false
                this.icon.url = url
                this.icon.id = id
                this.iconURL=url
            },
            updateDefaultIcon() {
                let that = this
                if (this.iconURL.trim().length==0) {
                    this.open("图片地址不能为空",'warning')
                    return;
                }
                if (this.iconURL.trim() === this.icon.url.trim()) {
                    this.dialogFormVisible=false
                    return;
                }
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/carousel/updateDefaultIcon',
                    params: {
                        id: that.icon.id,
                        icon: that.iconURL
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        that.open(res.data.msg, 'success')
                        that.dialogFormVisible = false
                        that.getDefaultIcon()
                        that.imgUrl = ''
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    console.log(res)
                });
            },
            handleAvatarSuccess(res, file) {
                this.iconURL=res
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
            getDefaultIcon() {
                let that = this
                this.$ajax.get(this.requestURL + '/web/getDefaultIcon')
                    .then(res => {
                        if (res.data.code === 0) {
                            that.tableData = res.data.data
                            let len = res.data.data.length
                            for (let i = 0; i < len; i++) {
                                that.srcList.push(res.data.data[i].iUrl)
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
            this.getDefaultIcon()
        }
    }
</script>

<style scoped>

</style>