<template>
    <div>
        <div class="btn">
            <el-button @click="toggleSelectionAll" v-show="!select" class="topBtn">是否全选</el-button>
            <el-button @click="toggleSelection()" class="topBtn" type="primary" v-show="select">取消选择</el-button>
            <el-button @click="remove" v-show="!select">删除</el-button>
            <el-button @click="remove" v-show="select" type="danger">删除</el-button>
            <el-button type="primary" @click="activeAdd">添加</el-button>

            <el-input placeholder="关键字" v-model="keyword" @keyup.enter.native="searchByKeyword"
                      style="width: 200px;margin-left: 20px;"></el-input>
            <el-button @click="searchByKeyword">搜索</el-button>
            <el-select v-model="value" clearable placeholder="请选择文章" @change="getArticleComs">
                <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.aTitle"
                        :value="item.aId">
                </el-option>
            </el-select>
        </div>
        <el-dialog :visible.sync="addDialog" title="添加" @close="cancel">
            <el-form :model="comment">
                <el-form-item label="文章" :label-width="formLabelWidth">
                    <el-select v-model="articleId" clearable placeholder="请选择文章" @change="getArticleComs">
                        <el-option
                                v-for="item in options"
                                :key="item.id"
                                :label="item.aTitle"
                                :value="item.aId">
                        </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="内容" :label-width="formLabelWidth">
                    <el-input type="textarea" placeholder="请输入评论内容"
                              autosize v-model="comment.content"></el-input>
                </el-form-item>

                <el-form-item label="用户" :label-width="formLabelWidth">
                    <el-select v-model="userId" clearable placeholder="请选择用户">
                        <el-option
                                v-for="item in userList"
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
                <template slot-scope="scope">{{ scope.row.cId}}</template>
            </el-table-column>

            <el-table-column
                    label="评论者"
                    width="200">
                <template slot-scope="scope">
                    <img :src="scope.row.userIcon" alt="" style="width: 50px;height: 50px;border-radius: 50%">
                    {{scope.row.userName}}
                </template>
            </el-table-column>

            <el-table-column
                    label="内容"
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
                    label="评论时间"
                    width="200">
                <template slot-scope="scope">{{ scope.row.cTime|changeTime}}</template>
            </el-table-column>

            <el-table-column
                    label="评论回复数量"
                    width="120">
                <template slot-scope="scope">
                    <el-button :disabled="scope.row.num==0?true:false"
                               @click="activeReplys(scope.row.cId)">{{ scope.row.num}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                    label="评论的文章"
                    width="120">
                <template slot-scope="scope">
                    {{scope.row.title}}
                </template>
            </el-table-column>

            <el-table-column
                    label="操作"
                    width="120">
                <template slot-scope="scope">
                    <el-button @click="activeUpdate(scope.row.cId,scope.row.content)">编辑</el-button>
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
        <el-dialog title="修改" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="内容" :label-width="formLabelWidth">
                    <el-input v-model="form.content" autocomplete="off" autofocus
                              @keyup.enter.native="updateComment(form.id,form.content)"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateComment(form.id,form.content)">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="评论回复" :visible.sync="formVisible">
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
                select: false,
                select2: false,
                options: [],
                value: '',
                articleId: '',
                formReplys: [],
                keyword: '',
                imageUrl: '',
                form: {
                    id: '',
                    content: ''
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
                addDialog: false,
                comment:{
                    content: ''
                },
                userList: [],
                userId: '',
                value1: '',
                formLabelWidth: '120px'
            }
        },
        methods: {
            cancel() {
                this.comment.content=''
                this.value1=''
                this.userId=''
                this.articleId=''
            },
            add() {
                if (this.articleId.length == 0) {
                    this.open("请选择文章",'warning')
                    return;
                }
                if (this.comment.content.trim().length == 0) {
                    this.open("请输入评论内容",'warning')
                    return;
                }
                if (this.userId.length==0) {
                    this.open("请选择评论用户",'warning')
                    return;
                }
                let that = this;
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/comment/addCom',
                    params: {
                        aId: that.articleId,
                        uId:that.userId,
                        time: that.value1,
                        content: that.comment.content
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.addDialog = false
                        that.open(res.data.msg, 'success')
                        that.getAllComments()
                    } else {
                        that.open(res.data.msg, 'warning')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            activeAdd() {
                this.addDialog=true
                let that=this
                this.$ajax.get(this.requestURL + '/userManager/getCreateUsers')
                    .then(res => {
                        if (res.data.code ===SUCCESS_CODE) {
                            that.userList=res.data.data
                        }
                    }).catch(res => {
                    console.log(res)
                })
            },
            getArticleComs() {
                if (this.value === '') {
                    this.getAllComments()
                    return;
                }
                let that = this;
                this.$ajax.get(this.requestURL + '/commentManager/getArticleComs?id=' + this.value)
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
            open(msg, type) {
                this.$message({
                    message: msg,
                    type: type,
                    duration: 2000
                });
            },
            remove2() {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delComReply()
                }).catch(() => {

                });
            },
            delComReply() {
                const len = this.multipleSelection2.length
                if (len < 1) {
                    this.open("请先选择", 'error')
                    return;
                }
                for (let i = 0; i < len; i++) {
                    this.ids.push(this.multipleSelection2[i].id);
                }
                let that = this
                this.$ajax.get(this.requestURL + '/commentManager/delComReplyList?ids=' + this.ids).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.activeReplys(res.data.data)
                        that.multipleSelection.length = 0
                        that.ids.length = 0
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            activeReplys(val) {
                let that = this
                this.$ajax.get(this.requestURL + '/commentManager/getComReplyById?id=' + val).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.formVisible = true
                        that.formReplys = res.data.data
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },

            activeUpdate(id, content) {
                this.form.id = id,
                    this.form.content = content,
                    this.content = content
                this.dialogFormVisible = true
            },
            updateComment(id, content) {
                if (content.trim().length === 0) {
                    this.open("内容不能为空",'warning')
                    return;
                }
                if (content.trim() === this.content.trim()) {
                    this.dialogFormVisible=false;
                    return;
                }

                let that = this;
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/commentManager/updateComment',
                    params: {
                        id: id,
                        content: content
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.dialogFormVisible = false
                        that.open(res.data.msg, 'success')
                        that.getAllComments()
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            searchByKeyword() {
                let that = this
                this.$ajax.get(this.requestURL + '/commentManager/searchComs?keyword=' + this.keyword)
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
            getAllArticle() {
                let that = this
                this.$ajax.get(this.requestURL + '/commentManager/getAllArticle').then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.options = res.data.data
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
            getAllComments() {
                let that = this
                this.$ajax.get(this.requestURL + '/commentManager/getAllComment').then(res => {
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
            handleSelectionChange2(val) {
                this.multipleSelection2 = val;
            },
            remove() {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delCom()
                }).catch(() => {

                });
            },
            delCom() {
                const len = this.multipleSelection.length
                if (len < 1) {
                    this.open("请先选择", 'error')
                    return;
                }
                for (let i = 0; i < len; i++) {
                    this.ids.push(this.multipleSelection[i].cId);
                }
                let that = this
                this.$ajax.get(this.requestURL + '/commentManager/delComment?ids=' + this.ids).then(res => {
                    if (res.data.code ===SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.getAllComments()
                        that.multipleSelection.length = 0
                        that.ids.length = 0
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
        },
        mounted() {
            this.getAllComments()
            this.getAllArticle()
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