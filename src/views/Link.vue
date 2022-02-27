<template>
    <div>
        <div class="btn">
            <el-button @click="activeAdd" type="primary" class="topBtn">添加</el-button>
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
                <template slot-scope="scope">{{ scope.row.lId}}</template>
            </el-table-column>

            <el-table-column
                    label="名称"
                    width="120">
                <template slot-scope="scope">
                    {{ scope.row.lName}}
                </template>
            </el-table-column>
            <el-table-column
                    label="跳转链接"
                    width="300">
                <template slot-scope="scope">
                    {{ scope.row.lUrl}}
                </template>
            </el-table-column>

            <el-table-column
                    label="操作"
                    width="200">
                <template slot-scope="scope">
                    <el-button type="" @click="activeUpdate(scope.row.lId,scope.row.lUrl,scope.row.lName)">编辑
                    </el-button>
                    <el-button type="danger" @click="remove(scope.row.lId)">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>

        <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="cancel">
            <el-form :model="link">
                <el-form-item label="名字">
                    <el-input v-model="link.name"></el-input>
                </el-form-item>
                <el-form-item label="链接">
                    <el-input v-model="link.url"></el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button v-show="!addBtn" type="primary" @click="updateLink()">确定</el-button>
                <el-button v-show="addBtn" type="primary" @click="addLink()">确定</el-button>
            </div>

        </el-dialog>

    </div>
</template>

<script>
import {SUCCESS_CODE} from "../assets/contant";

    export default {
        name: "Carousel",
        data() {
            return {
                tableData: [],
                multipleSelection: [],
                dialogFormVisible: false,
                addBtn: false,
                link: {
                    id: '',
                    url: '',
                    name: ''
                },
                title: '修改',
                url: '',
                name: ''
            }
        },
        methods: {
            changeTime() {
                let date = new Date();
                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            },
            remove(val) {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  this.delLink(val)
                }).catch(() => {

                });
            },
            delLink(val) {
                let that = this
                this.$ajax.get(this.requestURL + '/link/delLink?id=' + val)
                    .then(res => {
                        if (res.data.code ===SUCCESS_CODE) {
                            that.open(res.data.msg, 'success')
                            that.getAllLink()
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
                this.title = '添加'
                this.value3 = this.changeTime()
            },
            addLink() {
                if (this.link.name.trim().length==0) {
                    this.open('名称不能为空', 'warning')
                    return;
                }
                let that = this
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/link/addLink',
                    params: {
                        url: this.link.url,
                        name: this.link.name
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.dialogFormVisible = false
                        that.getAllLink()
                        that.link.url=''
                        that.link.name=''
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    console.log(res)
                });

            },
            cancel() {
                this.dialogFormVisible = false
                this.link.name=''
                this.link.url=''
                this.addBtn = false
            },
            open(msg, type) {
                this.$message({
                    message: msg,
                    type: type,
                    duration: 2000
                });
            },
            activeUpdate(id, url, name) {
                this.dialogFormVisible = true
                this.addBtn = false
                this.link.url = url
                this.url = url
                this.name = name
                this.link.id = id
                this.link.name = name
            },
            updateLink() {
                if (this.link.name.trim().length == 0) {
                    this.open("名称不能为空",'warning')
                    return;
                }
                if (this.link.name.trim() === this.name.trim()&&this.link.url.trim()===this.url.trim()) {
                    this.dialogFormVisible=false
                    return;
                }
                let that = this;
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/link/updateLink',
                    params: {
                        id: this.link.id,
                        url: this.link.url,
                        name: this.link.name
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.dialogFormVisible = false
                        that.getAllLink()
                        that.link.url=''
                        that.link.name=''
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    console.log(res)
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getAllLink() {
                let that = this
                this.$ajax.get(this.requestURL + '/link/getAllLink')
                    .then(res => {
                        if (res.data.code ===SUCCESS_CODE) {
                            that.tableData = res.data.data
                        } else {
                            console.log(res)
                        }
                    }).catch(res => {
                    console.log(res)
                })
            }

        },
        mounted() {
            this.getAllLink()
        }
    }
</script>

<style scoped>

</style>