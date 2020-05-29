<template>
    <div>
        <div class="btn">
            <el-button @click="activeAdd" class="topBtn" type="primary">添加</el-button>
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
                <template slot-scope="scope">{{ scope.row.id}}</template>
            </el-table-column>

            <el-table-column
                    label="内容"
                    width="120">
                <template slot-scope="scope">
                    {{ scope.row.content}}
                </template>
            </el-table-column>
            <el-table-column
                    label="时间"
                    width="300">
                <template slot-scope="scope">
                    {{ scope.row.time|changeTime()}}
                </template>
            </el-table-column>

            <el-table-column
                    label="操作"
                    width="200">
                <template slot-scope="scope">
                    <el-button type=""
                               @click="activeUpdate(scope.row.id,scope.row.time,scope.row.content)">编辑
                    </el-button>
                    <el-button type="danger" @click="remove(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>

        </el-table>

        <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="cancel">
            <el-form :model="record">
                <el-form-item label="内容">
                    <el-input v-model="record.content" type="textarea" autosize
                    ></el-input>
                </el-form-item>
                <el-form-item label="时间">
                    <div class="block">
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

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button v-show="!addBtn" type="primary" @click="updateRecord()">确定</el-button>
                <el-button v-show="addBtn" type="primary" @click="addRecord()">确定</el-button>
            </div>

        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "timeline",
        data() {
            return {
                tableData: [],
                multipleSelection: [],
                dialogFormVisible: false,
                addBtn: false,
                record: {
                    id: '',
                    content: '',
                    time: ''
                },
                title: '修改',
                value3: '',
                placeholder: '',
                content: ''
            }
        },
        methods: {
            remove(val) {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delRecord(val)
                }).catch(() => {

                });
            },
            delRecord(val) {
                let that = this
                this.$ajax.get(this.requestURL + '/timeline/delTimeline?id=' + val)
                    .then(res => {
                        if (res.data.code === 0) {
                            that.open(res.data.msg, 'success')
                            that.getTimelineList()
                        } else {
                            console.log(res)
                        }
                    }).catch(res => {
                    console.log(res)
                })
            },
            createTime() {
                let date = new Date();
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
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute+':'+second;
            },
            activeAdd() {
                this.dialogFormVisible = true
                this.addBtn = true
                this.title = '添加'
                this.placeholder = '请选择时间'
            },
            addRecord() {
                if (this.record.content.trim().length==0) {
                    this.open("请输入内容", 'warning')
                    return;
                }

                let time=this.placeholder
                if (this.value3) {
                    time=this.value3
                }
                let that = this;
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/timeline/addTimeline',
                    params: {
                        content: that.record.content,
                        time: time
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        that.open(res.data.msg, 'success')
                        that.dialogFormVisible = false
                        that.getTimelineList()
                        that.record.content=''
                        that.record.time=''
                        that.record.id=''
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    console.log(res)
                });

            },
            cancel() {
                this.dialogFormVisible = false
                this.record.content=''
                this.addBtn = false
                this.value3 = ''
            },
            open(msg, type) {
                this.$message({
                    message: msg,
                    type: type,
                    duration: 2000
                });
            },
            activeUpdate(id, time, content) {
                this.dialogFormVisible = true
                this.addBtn = false
                this.record.id = id
                this.record.content = content
                this.content = content
                this.placeholder = this.changeTime(time)
                this.title = '修改'
            },
            updateRecord() {
                let content=this.record.content.trim()
                if (content.length == 0||content==undefined||content=='') {
                    this.open("请输入内容", 'warning')
                    return;
                }
                let that = this;
                let time = this.placeholder
                if (this.value3) {
                    if (this.placeholder === this.value3 && this.record.content.trim() === this.content.trim()) {
                        this.dialogFormVisible = false
                        return;
                    }
                    time = this.value3
                } else {
                    if (this.content === this.record.content.trim()) {
                        this.dialogFormVisible = false
                        return;
                    }
                }
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/timeline/updateTimeline',
                    params: {
                        id: that.record.id,
                        content: that.record.content,
                        time: time
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        that.open(res.data.msg, 'success')
                        that.dialogFormVisible = false
                        that.getTimelineList()
                        that.record.content=''
                        that.record.id=''
                        that.record.time=''
                    } else {
                        that.open(res.data.msg, 'error')
                        console.log(res.data)
                    }
                }).catch(res => {
                    console.log(res)
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getTimelineList() {
                let that = this
                this.$ajax.get(this.requestURL + '/timeline/getTimelineList')
                    .then(res => {
                        if (res.data.code === 0) {
                            that.tableData = res.data.data
                        } else {
                            console.log(res)
                        }
                    }).catch(res => {
                    console.log(res)
                })
            },
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
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute+':'+second;
            }

        },
        mounted() {
            this.getTimelineList()
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
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute
            }
        }
    }
</script>

<style scoped>

</style>