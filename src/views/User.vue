<template>
    <div>
        <div class="btn">
            <el-button @click="toggleSelectionAll" v-show="!select" class="topBtn">是否全选</el-button>
            <el-button @click="toggleSelection()" type="primary" v-show="select" class="topBtn">取消选择</el-button>
            <el-button @click="remove(1,'删除')" v-show="!select">删除</el-button>
            <el-button @click="remove(1,'删除')" type="danger" v-show="select">删除</el-button>
            <el-button @click="remove(2,'封号')" v-show="!select">封号</el-button>
            <el-button @click="remove(2,'封号')" type="danger" v-show="select">封号</el-button>
            <el-button type="primary" @click="activeAdd">添加</el-button>
            <el-input placeholder="关键字" v-model="keyword" @keyup.enter.native="searchByKeyword"
                      style="width: 200px;margin-left: 20px;"></el-input>
            <el-button @click="searchByKeyword">搜索</el-button>
        </div>

        <div>
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    @selection-change="handleSelectionChange">

                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>

                <el-table-column
                        label="ID"
                        show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.userId}}</template>
                </el-table-column>

                <el-table-column
                        label="头像"
                        width="120">
                    <template slot-scope="scope">
                        <img :src="scope.row.userIcon" alt="" style="width: 50px;height: 50px;border-radius: 50%">
                    </template>
                </el-table-column>

                <el-table-column
                        label="姓名"
                        width="120">
                    <template slot-scope="scope">{{ scope.row.userName }}</template>
                </el-table-column>

                <el-table-column
                        label="手机号"
                        width="120">
                    <template slot-scope="scope">
                        {{scope.row.phoneNumber}}
                    </template>
                </el-table-column>

                <el-table-column
                        label="密码"
                        width="120">
                    <template slot-scope="scope">
                        {{scope.row.userPass}}
                    </template>
                </el-table-column>


                <el-table-column
                        label="封号"
                        width="120">
                    <template slot-scope="scope">
                        {{scope.row.isForbid}}
                    </template>
                </el-table-column>

                <el-table-column
                        label="注册时间"
                        width="200">
                    <template slot-scope="scope">{{ scope.row.registerTime |changeTime()}}</template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        width="300">
                    <template slot-scope="scope">
                        <el-button
                                @click="activeUpdate(scope.row.userIcon,scope.row.userName,scope.row.userPass,scope.row.userId)">
                            编辑
                        </el-button>
                        <el-button type="danger" v-show="scope.row.isForbid==0"
                                   @click="remove2(2,scope.row.userId,'封号')">封号
                        </el-button>
                        <el-button type="primary" v-show="scope.row.isForbid==1"
                                   @click="remove2(2,scope.row.userId,'解封')">解封
                        </el-button>
                        <el-button type="danger"  v-show="scope.row.isDel==0"
                        @click="remove2(1,scope.row.userId,'删除')">删除</el-button>
                        <el-button type="primary"  v-show="scope.row.isDel==1"
                                   @click="remove2(1,scope.row.userId,'恢复删除')">恢复</el-button>
                    </template>
                </el-table-column>


            </el-table>

        </div>
        <div class="block" style="height: 9.375rem;">
            <span class="demonstration"></span>
            <el-pagination
                    background
                    @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currPage"
                    :page-sizes="[5,10, 15, 20, 25]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="allData.length">
            </el-pagination>
        </div>
        <el-dialog title="修改" :visible.sync="dialogFormVisible" @close="cancel">
            <el-form :model="form">
                <el-form-item label="头像" :label-width="formLabelWidth">
                    <div class="icon">
                        <el-upload
                                class="avatar-uploader"
                                :action="this.action"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img :src="imgURL" class="avatar" style="border-radius: 50%;width: 50px;height: 50px;">
                        </el-upload>
                        <el-input class="input" v-model="imgURL"></el-input>
                    </div>

                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="form.userName" autocomplete="off" autofocus
                              @keyup.enter.native="updateUser(form.userId)"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="form.userPass" autocomplete="off"
                              @keyup.enter.native="updateUser(form.userId)"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="updateUser(form.userId)" v-show="!addBtn">确 定</el-button>
                <el-button type="primary" @click="addUser()" v-show="addBtn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {SUCCESS_CODE} from "../assets/contant";

    export default {
        name: "user",
        data() {
            return {
                addBtn: true,
                action: this.requestURL + '/image/userImage',
                keyword: '',
                imageUrl: '',
                imgURL: '',
                form: {
                    userId: '',
                    userName: '',
                    userIcon: '',
                    userPass: ''
                },
                form2: {
                    userName: '',
                    userIcon: '',
                    userPass: ''
                },
                dialogFormVisible: false,
                ids: [],
                tableData: [],
                allData: [],
                multipleSelection: [],
                currPage: 1,
                pageSize: 5,
                select: false,
                formLabelWidth: '120px'
            }
        },
        methods: {
            activeAdd() {
                this.dialogFormVisible = true
                this.addBtn = true
                this.imgURL = ''
                this.form.userName = ''
                this.form.userPass = ''
            },
            addUser() {
                if (this.form.userName.trim().length == 0 || this.imgURL.trim().length == 0
                    || this.form.userPass.trim().length == 0) {
                    this.open("图片地址、用户名和用户密码不能为空", 'warning')
                    return;
                }
                let that = this;
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/userManager/addUser',
                    params: {
                        pass: that.form.userPass,
                        userIcon: that.imgURL,
                        userName: that.form.userName
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.getUserList()
                        this.dialogFormVisible = false;
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            cancel() {
                this.imgURL = ''
                this.imageUrl = ''
                this.dialogFormVisible = false
            },
            searchByKeyword() {
                let that = this
                this.$ajax.get(this.requestURL + '/userManager/getUsersByKeyword?keyword=' + this.keyword)
                    .then(res => {
                        if (res.data.code ===SUCCESS_CODE) {
                            that.allData = res.data.data
                            that.pageUtil()
                        } else {
                            that.open(res.data.msg, 'error')
                        }
                    }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = res
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
            open(msg, type) {
                this.$message({
                    message: msg,
                    type: type,
                    duration: 2000
                });
            },
            activeUpdate(userIcon, userName, userPass, id) {
                this.imgURL = userIcon
                this.form.userId = id
                this.form.userName = userName
                this.form.userPass = userPass
                this.form2.userName = userName
                this.form2.userPass = userPass
                this.form2.userIcon = userIcon
                this.dialogFormVisible = true
                this.addBtn = false
            },
            updateUser(val) {
                if (this.form.userName.trim().length == 0 || this.imgURL.trim().length == 0
                    || this.form.userPass.trim().length == 0) {
                    this.open("图片地址、用户名和用户密码不能为空", 'warning')
                    return;
                }
                if (this.form.userPass.trim() === this.form2.userPass.trim()
                    && this.form.userName.trim() === this.form2.userName.trim()
                    && this.imgURL.trim() === this.form2.userIcon.trim()) {
                    this.dialogFormVisible = false
                    return;
                }
                let that = this;
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/userManager/updateUser',
                    params: {
                        userId: val,
                        pass: that.form.userPass,
                        userIcon: that.imgURL,
                        userName: that.form.userName
                    },
                    header: {
                        'content-type': 'application/json'
                    }

                }).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.getUserList()
                        this.dialogFormVisible = false;
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            forbid(id) {
                let that = this
                this.$ajax.get(this.requestURL + '/userManager/forbid?id=' + id).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.getUserList()
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })

            },

            forbidUser() {
                const len = this.multipleSelection.length
                if (len < 1) {
                    this.open("请先选择", 'error')
                    return;
                }
                for (let i = 0; i < len; i++) {
                    this.ids.push(this.multipleSelection[i].userId)
                }
                let that = this
                this.$ajax.get(this.requestURL + '/userManager/forbidUser?ids=' + this.ids).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.getUserList()
                        that.ids.length=0
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            pageUtil() {
                let totalPage = 0;//总页数
                //总共分几页
                if (this.allData.length / this.pageSize > parseInt(this.allData.length / this.pageSize)) {
                    totalPage = parseInt(this.allData.length / this.pageSize) + 1;
                } else {
                    totalPage = parseInt(this.allData.length / this.pageSize);
                }
                let startRow = (this.currPage - 1) * this.pageSize;//开始显示的行  31
                let endRow = this.currPage * this.pageSize;//结束显示的行   40
                endRow = (endRow > this.allData.length) ? this.allData.length : endRow;    //40
                this.tableData = this.allData.slice(startRow, endRow)

            },
            handleSizeChange(val) {
                this.pageSize = val
                this.pageUtil()
            },
            handleCurrentChange(val) {
                this.currPage = val
                this.pageUtil()
            },
            toggleSelectionAll() {
                this.$refs.multipleTable.toggleAllSelection()
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            remove(val,msg) {
                this.$confirm('确定'+msg+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    switch (val) {
                        case val = 1:
                            this.delUserList();
                            break;
                        case val = 2:
                            this.forbidUser()
                    }
                }).catch(() => {

                });
            },
            delUser(id) {
                let that = this
                this.$ajax.get(this.requestURL + '/userManager/delUser?userId=' + id).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.getUserList()
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            remove2(val,id,msg) {
                this.$confirm('确定'+msg+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    switch (val) {
                        case val = 1:
                            this.delUser(id);
                            break;
                        case val = 2:
                            this.forbid(id)
                    }
                }).catch(() => {

                });
            },
            delUserList() {
                const len = this.multipleSelection.length
                if (len < 1) {
                    this.open("请先选择", 'warning')
                    return;
                }
                for (let i = 0; i < len; i++) {
                    this.ids.push(this.multipleSelection[i].userId);
                }
                let that = this
                this.$ajax.get(this.requestURL + '/userManager/delUserArray?ids=' + this.ids).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.getUserList()
                        that.ids.length=0
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            getUserList() {
                let that = this
                this.$ajax.get(this.requestURL + '/userManager/getAllUsers').then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.allData = res.data.data
                        that.pageUtil()
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            }
        },
        mounted() {
            this.getUserList()
        },
        filters: {
            changeTime(value) {
                var date = new Date(value);
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                var minute = date.getMinutes();
                var second = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
            }
        },
        watch: {
            multipleSelection: {
                handler(newValue, oldValue) {
                    if (newValue.length > 0) {
                        this.select = true
                    } else {
                        this.select = false
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .icon {
        display: flex;
        margin-bottom: -20px;
    }

    .avatar-uploader {
        margin-right: 30px;
    }

    .input {
    }
</style>