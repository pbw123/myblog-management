<template>
    <div>
        <div class="btn">
            <el-button @click="toggleSelectionAll" v-show="!select" class="topBtn">是否全选</el-button>
            <el-button @click="toggleSelection()" class="topBtn" v-show="select" type="primary">取消选择</el-button>
            <el-button @click="remove" v-show="!select">删除</el-button>
            <el-button @click="remove" type="danger" v-show="select">删除</el-button>
            <el-button type="primary" @click="activeAdd">添加</el-button>

            <el-input placeholder="关键字" v-model="keyword" @keyup.enter.native="searchByKeyword"
                      style="width: 200px;margin-left: 20px;"></el-input>
            <el-button @click="searchByKeyword">搜索</el-button>
        </div>
        <el-dialog :visible.sync="addDialog" title="添加" @close="cancel">
            <el-form :model="message">
                <el-form-item label="内容" :label-width="formLabelWidth">
                    <el-input type="textarea" autosize v-model="message.content"></el-input>
                </el-form-item>

                <el-form-item label="用户" :label-width="formLabelWidth">
                    <el-select v-model="value" clearable placeholder="请选择用户">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.userName"
                                :value="item.userId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="时间" :label-width="formLabelWidth">
                     <div class="block">
                        <span class="demonstration"></span>
                        <el-date-picker
                                v-model="value1"
                                type="datetime"
                                placeholder="选择日期时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </div>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="add()">确 定</el-button>
            </div>

        </el-dialog>
        <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>

            <el-table-column
                    label="ID"
                    show-overflow-tooltip>
                <template slot-scope="scope">{{ scope.row.mId}}</template>
            </el-table-column>

            <el-table-column
                    label="留言者"
                    width="200">
                <template slot-scope="scope">
                    <img :src="scope.row.userIcon" alt="" style="width: 50px;height: 50px;border-radius: 50%">
                    {{ scope.row.userName }}
                </template>
            </el-table-column>

            <el-table-column
                    label="留言内容"
                    width="200">
                <template slot-scope="scope">
                    <el-popover
                            placement="bottom"
                            width="1000"
                            trigger="click"
                            :content="scope.row.content">
                        <div slot="reference" style="overflow: hidden;height: 20px;cursor: pointer">
                            {{scope.row.content}}
                        </div>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column
                    label="留言时间"
                    width="200">
                <template slot-scope="scope">{{ scope.row.mTime|changeTime}}</template>
            </el-table-column>

            <el-table-column
                    label="留言回复数量"
                    width="120">
                <template slot-scope="scope">
                    <el-button :disabled="scope.row.num==0?true:false"
                            @click="activeReplys(scope.row.mId)">{{ scope.row.num}}</el-button>
                </template>
            </el-table-column>

            <el-table-column
                    label="操作"
                    width="120">
                <template slot-scope="scope">
                    <el-button @click="activeUpdate(scope.row.content,scope.row.mId)">编辑</el-button>
                </template>
            </el-table-column>


        </el-table>
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
                <el-form-item label="内容" :label-width="formLabelWidth">
                    <el-input v-model="form.content" autocomplete="off" autofocus
                              @keyup.enter.native="updateMsg(form.id)"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateMsg(form.id)">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="留言回复" :visible.sync="formVisible">
            <div>
                <el-button @click="toggleSelectionAll" v-show="!select2">是否全选</el-button>
                <el-button @click="toggleSelection()" v-show="select2" type="primary">取消选择</el-button>
                <el-button @click="remove2" v-show="!select2">删除</el-button>
                <el-button @click="remove2" v-show="select2" type="danger">删除</el-button>

            </div>
            <el-table
                    ref="multipleTable"
                    :data="formReplys"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange2">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>

                <el-table-column
                        label="ID"
                        show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.id}}</template>
                </el-table-column>

                <el-table-column
                        label="谁回复"
                        width="200">
                    <template slot-scope="scope">
                        <img :src="scope.row.userIcon" alt="" style="width: 50px;height: 50px;border-radius: 50%">
                        {{ scope.row.userName }}
                    </template>
                </el-table-column>
                <el-table-column
                        label="回复谁"
                        width="200">
                    <template slot-scope="scope">
                        <img :src="scope.row.replyUserIcon" alt="" style="width: 50px;height: 50px;border-radius: 50%">
                        {{scope.row.replyUserName}}
                    </template>
                </el-table-column>

                <el-table-column
                        label="回复内容"
                        width="200">
                    <template slot-scope="scope">
                        <div style="overflow: hidden">
                            {{scope.row.content}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column
                        label="回复时间"
                        width="200">
                    <template slot-scope="scope">{{ scope.row.createTime|changeTime}}</template>
                </el-table-column>

            </el-table>

        </el-dialog>

    </div>
</template>

<script>
import {SUCCESS_CODE} from "../assets/contant";

    export default {
        name: "Message",
        data() {
            return {
                message:{
                    content: ''
                },
                options: [],
                value: '',
                value1: '',
                addDialog: false,
                formReplys: [],
                keyword: '',
                imageUrl: '',
                form: {
                    id: '',
                    content:''
                },
                content: '',
                dialogFormVisible: false,
                formVisible: false,
                ids: [],
                tableData: [],
                allData: [],
                multipleSelection: [],
                multipleSelection2: [],
                currPage: 1,
                pageSize: 5,
                select: false,
                select2: false,
                formLabelWidth: '120px'
            }
        },
        methods: {
            add() {
                if (this.message.content.trim().length == 0) {
                    this.open("请输入内容",'warning');
                    return;
                }
                if (this.value.length == 0) {
                    this.open("请选择用户",'warning')
                    return;
                }
                let that = this;
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/messageManager/addMessage',
                    params: {
                        userId:that.value,
                        time: that.value1,
                        content:that.message.content.trim()
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.getMessageList()
                        this.addDialog = false

                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            activeAdd() {
                this.addDialog=true
                let that = this;
                this.$ajax.get(this.requestURL + '/userManager/getCreateUsers')
                    .then(res => {
                        if (res.data.code ===SUCCESS_CODE) {
                            that.options=res.data.data
                        }
                    }).catch(res => {
                    console.log(res)
                    })
            },
            cancel() {
                this.message.content=''
                this.value1=''
                this.value=''
            },
            open(msg, type) {
                this.$message({
                    message: msg,
                    type: type,
                    duration:2000
                });
            },
            remove2() {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delMsgReply()
                }).catch(() => {

                });
            },
            delMsgReply() {
                const len = this.multipleSelection2.length
                if (len < 1) {
                    this.open("请先选择",'error')
                    return;
                }
                for (let i = 0; i < len; i++) {
                    this.ids.push(this.multipleSelection2[i].id);
                }
                let that = this
                this.$ajax.get(this.requestURL + '/messageManager/delMsgReplyList?ids=' + this.ids)
                    .then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg,'success')
                        that.activeReplys(res.data.data)
                        that.ids.length=0
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            activeReplys(val) {
                let that = this
                this.$ajax.get(this.requestURL + '/messageManager/getMsgReplyById?mId=' + val).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.formVisible=true
                        that.formReplys=res.data.data
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },

            activeUpdate(content,id) {
                this.form.content=content
                this.form.id=id
                this.dialogFormVisible=true
                this.content=content
            },
            updateMsg(id) {
                if (this.form.content.trim().length === 0) {
                    this.open("内容不能为空","warning")
                    return;
                }
                if (this.content.trim() === this.form.content.trim()) {
                    this.dialogFormVisible = false;
                    return;
                }
                let that = this;
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/messageManager/updateMsg',
                    params: {
                        id:id,
                        content:that.form.content.trim()
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.getMessageList()
                        this.dialogFormVisible = false
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            searchByKeyword() {
                let that = this
                this.$ajax.get(this.requestURL + '/messageManager/searchMsg?keyword=' + this.keyword)
                    .then(res => {
                        if (res.data.code ===SUCCESS_CODE) {
                            that.allData=res.data.data
                            that.pageUtil()
                        } else {
                            that.open(res.data.msg, 'error')
                        }
                    }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            getMessageList() {
                let that = this
                this.$ajax.get(this.requestURL + '/message/getAllMessage').then(res => {
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
            pageUtil() {
                let totalPage = 0;//总页数
                //总共分几页
                if(this.allData.length/this.pageSize > parseInt(this.allData.length/this.pageSize)){
                    totalPage=parseInt(this.allData.length/this.pageSize)+1;
                }else{
                    totalPage=parseInt(this.allData.length/this.pageSize);
                }
                let startRow = (this.currPage - 1) * this.pageSize;//开始显示的行  31
                let endRow = this.currPage * this.pageSize;//结束显示的行   40
                endRow = (endRow > this.allData.length)? this.allData.length : endRow;    //40
                this.tableData=this.allData.slice(startRow,endRow)

            },
            handleSizeChange(val) {
                this.pageSize=val
                this.pageUtil()
            },
            handleCurrentChange(val) {
                this.currPage=val
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
            handleSelectionChange2(val) {
                this.multipleSelection2 = val;
            },
            remove() {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delMsgList()
                }).catch(() => {

                });
            },
            delMsgList() {
                const len = this.multipleSelection.length
                if (len < 1) {
                    this.open("请先选择",'error')
                    return;
                }
                for (let i = 0; i < len; i++) {
                    this.ids.push(this.multipleSelection[i].mId);
                }
                let that = this
                this.$ajax.get(this.requestURL + '/messageManager/delMessageList?ids=' + this.ids).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.getMessageList()
                        that.ids.length=0
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
        },
        mounted() {
            this.getMessageList()
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
                        this.select=true
                    } else {
                        this.select=false
                    }
                }
            },

            multipleSelection2: {
                handler(newValue, oldValue) {
                    if (newValue.length > 0) {
                        this.select2=true
                    } else {
                        this.select2=false
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>