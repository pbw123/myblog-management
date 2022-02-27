<template>
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
                    label="ID"
                    width="100"
                    show-overflow-tooltip>
                <template slot-scope="scope">{{ scope.row.id}}</template>
            </el-table-column>

            <el-table-column
                    label="名字"
                    width="120">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column
                    label="图标"
                    width="120">
                <template slot-scope="scope">
                    <img :src="scope.row.icon" alt="" style="width: 50px;height: 50px;border-radius: 50%">
                </template>
            </el-table-column>

            <el-table-column
                    label="跳转链接"
                    width="400">
                <template slot-scope="scope">
                    {{scope.row.link}}
                </template>
            </el-table-column>

            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button type="" @click="activeUpdate(scope.row.id,scope.row.name,scope.row.link,scope.row.icon)">编辑
                    </el-button>
                    <el-button type="danger" @click="remove(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="cancel">
            <el-form :model="contact">
                <el-form-item label="名字">
                    <el-input label="" v-model="contact.name"></el-input>
                </el-form-item>
                <el-form-item label="图标" :label-width="formLabelWidth">
                    <el-upload
                            class="avatar-uploader"
                            :action="this.action"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imgUrl" :src="imgUrl" class="avatar"
                             style="width: 100px;height: 100px;border-radius: 50%">

                    </el-upload>
                    <el-input v-model="imgUrl"></el-input>
                </el-form-item>

                <el-form-item label="跳转链接">
                    <el-input label="" v-model="contact.link"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button v-show="!addBtn" type="primary" @click="updateAtten()">确定</el-button>
                <el-button v-show="addBtn" type="primary" @click="addAtten()">确定</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import {SUCCESS_CODE} from "../assets/contant";

    export default {
        name: "Attention",
        data() {
            return {
                title: '修改',
                action: this.requestURL+'/image/carouselIconImage',
                dialogFormVisible: false,
                addBtn: false,
                tableData: [],
                multipleSelection: [],
                formLabelWidth: '120px',
                contact: {
                    id: '',
                    name: '',
                    link: '',
                    icon: ''
                },
                name: '',
                linkURL: '',
                imgUrl: ''
            }
        },
        methods: {
            remove(val) {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delAtten(val)
                }).catch(() => {

                });
            },
            delAtten(val) {
                let that = this
                this.$ajax.get(this.requestURL + '/attentionManager/delAtten?id='+val)
                    .then(res => {
                        if (res.data.code === SUCCESS_CODE) {
                            that.open(res.data.msg,'success')
                            that.getMyContact()
                        } else {
                            console.log(res)
                        }
                    }).catch(res => {
                    console.log(res)
                })
            },
            activeAdd() {
                this.dialogFormVisible=true
                this.addBtn=true
                this.title='添加'
            },
            addAtten() {
                if (this.imgUrl.trim().length==0||this.contact.name.trim()==0) {
                    this.open("名称和图片地址不能为空",'warning')
                    return;
                }

                let that = this
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/attentionManager/insertAtten',
                    params: {
                        icon: that.imgUrl,
                        link: that.contact.link,
                        name: that.contact.name
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.dialogFormVisible = false
                        that.getMyContact()
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
                this.contact.id=''
                this.contact.name=''
                this.contact.link=''
                this.contact.icon=''
            },
            open(msg, type) {
                this.$message({
                    message: msg,
                    type: type,
                    duration: 2000
                });
            },
            activeUpdate(id, name, link, icon) {
                this.dialogFormVisible = true
                this.contact.name = name
                this.name=name
                this.contact.link = link
                this.linkURL=link
                this.contact.icon = icon
                this.imgUrl=icon
                this.contact.id = id
                this.addBtn=false
            },
            updateAtten() {
                if (this.imgUrl.trim().length==0 ||this.contact.name.trim()==0) {
                    this.open("图片地址和名称不能为空")
                    return;
                }
                if (this.imgUrl.trim() === this.contact.icon && this.contact.name === this.name
                &&this.contact.link===this.linkURL) {
                    this.dialogFormVisible=false
                    return;
                }
                let that = this;
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/attentionManager/updateAtten',
                    params: {
                        icon: that.imgUrl,
                        id: that.contact.id,
                        link: that.contact.link,
                        name: that.contact.name
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.dialogFormVisible = false
                        that.getMyContact()
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
            beforeAvatarUpload(file) {
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getMyContact() {
                let that = this
                this.$ajax.get(this.requestURL + '/attention/getMyContact')
                    .then(res => {
                        if (res.data.code ===SUCCESS_CODE) {
                            that.tableData = res.data.data
                            that.contace = res.data.data[0]
                        } else {
                            console.log(res)
                        }
                    }).catch(res => {
                    console.log(res)
                })
            }

        },
        mounted() {
            this.getMyContact()
        }
    }
</script>

<style scoped>

</style>