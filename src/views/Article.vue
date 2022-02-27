<template>
    <div>
        <div class="btn">
            <el-button @click="toggleSelectionAll" v-show="!select" class="topBtn">是否全选</el-button>
            <el-button @click="toggleSelection()" class="topBtn" type="primary" v-show="select">取消选择</el-button>
            <el-button @click="remove" v-show="!select">删除</el-button>
            <el-button @click="remove" type="danger" v-show="select">删除</el-button>
            <el-button @click="toAddArt" type="primary">添加</el-button>
        </div>
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
                    width="100"
                    show-overflow-tooltip>
                <template slot-scope="scope">{{ scope.row.aId}}</template>
            </el-table-column>

            <el-table-column
                label="作者"
                width="120">
            <template slot-scope="scope">
                <img :src="scope.row.userIcon" alt="" style="width: 50px;height: 50px;border-radius: 50%">
                {{scope.row.userName}}
            </template>
        </el-table-column>

            <el-table-column
                    label="标题"
                    width="120">
                <template slot-scope="scope">
                    <div style="overflow: hidden">
                        {{scope.row.aTitle}}
                    </div>
                </template>
            </el-table-column>


            <el-table-column
                    label="内容"
                    width="200">
                <template slot-scope="scope">
                    <div slot="reference" style="overflow: hidden;height: 20px;cursor: pointer"
                    @click="contentDialog(scope.row.aTitle,scope.row.aContent)">
                        {{scope.row.aContent}}
                    </div>
                </template>
            </el-table-column>


            <el-table-column
                    label="发布时间"
                    width="200">
                <template slot-scope="scope">{{ scope.row.aTime|changeTime}}</template>
            </el-table-column>

            <el-table-column
                    label="评论"
                    width="50">
                <template slot-scope="scope">
                    {{ scope.row.comments.length}}
                </template>
            </el-table-column>
            <el-table-column
                    label="点赞"
                    width="50">
                <template slot-scope="scope">
                    {{scope.row.love}}
                </template>
            </el-table-column>
            <el-table-column
                    label="浏览"
                    width="50">
                <template slot-scope="scope">
                    {{scope.row.aScan}}
                </template>
            </el-table-column>
            <el-table-column
                    label="封面"
                    width="120">
                <template slot-scope="scope">
                    <img :src="scope.row.aImg" alt="" style="width: 50px;">
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="120">
                <template slot-scope="scope">
                    <el-button @click="activeUpdate(scope.row.aId)">编辑</el-button>
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
        <el-dialog :title="title" :visible.sync="showContent">
                {{content}}
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showContent = false">关 闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改文章" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="标题" :label-width="formLabelWidth">
                    <el-input v-model="form.aTitle" autocomplete="off" autofocus
                              @keyup.enter.native="updateArt(form.aId)"></el-input>
                </el-form-item>
                <el-form-item label="内容" :label-width="formLabelWidth">
                    <el-input type="textarea"
                              autosize
                              v-model="form.aContent" autocomplete="off" autofocus
                              @keyup.enter.native="updateArt(form.aId)"></el-input>
                </el-form-item>
                <el-form-item label="时间" :label-width="formLabelWidth">
                    <div class="block">
                        <el-date-picker
                                v-model="value3"
                                type="date"
                                :placeholder="placeholder"
                                format="yyyy 年 MM 月 dd 日 HH 时 mm 分"
                                value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </div>

                </el-form-item>
                <el-form-item label="点赞" :label-width="formLabelWidth">
                    <el-input v-model="form.love" autocomplete="off" autofocus
                              @keyup.enter.native="updateArt(form.aId)"></el-input>
                </el-form-item>
                <el-form-item label="浏览" :label-width="formLabelWidth">
                    <el-input v-model="form.aScan" autocomplete="off" autofocus
                              @keyup.enter.native="updateArt(form.aId)"></el-input>
                </el-form-item>

                <el-form-item label="封面" :label-width="formLabelWidth">
                    <el-upload
                            class="avatar-uploader"
                            :action="this.requestURL+'/user/img/addImg'"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 50px;height: 50px;">
                        <img v-else="form.userIcon" :src="form.aImg" class="avatar"
                             style="border-radius: 50%;width: 50px;height: 50px;">
                    </el-upload>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateArt(form.aId)">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="添加文章" :visible.sync="addArtFormVisible">
            <el-form :model="article">
                <el-form-item label="用户ID"
                              :label-width="formLabelWidth">
                    <el-input v-model="article.userId" autocomplete="off" autofocus
                              placeholder="请输入用户ID"
                              @keyup.enter.native="addArt()"></el-input>
                </el-form-item>
                <el-form-item label="标题"
                              :label-width="formLabelWidth">
                    <el-input v-model="article.title" autocomplete="off" autofocus
                              placeholder="请输入标题"
                              @keyup.enter.native="addArt()"></el-input>
                </el-form-item>
                <el-form-item label="内容" :label-width="formLabelWidth">
                    <el-input type="textarea"
                              rows="4"
                              placeholder="请输入内容"
                              v-model="article.content" autocomplete="off" autofocus
                              @keyup.enter.native="addArt()"></el-input>
                </el-form-item>

                <el-form-item label="封面" :label-width="formLabelWidth">
                    <el-upload
                            class="avatar-uploader"
                            :action="this.requestURL+'/user/img/addImg'"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 50px;height: 50px;">
                        <img v-else src="" class="avatar"
                             style="border-radius: 50%;width: 50px;height: 50px;">
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addArtFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addArt()">确 定</el-button>
            </div>
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
                addArtFormVisible: false,
                article: {
                    title: '',
                    content: '',
                    img:'',
                    userId:''
                },
                title: '',
                content: '',
                showContent: false,
                placeholder: '',
                value3: '',
                formReplys: [],
                keyword: '',
                imageUrl: '',
                form: {},
                dialogFormVisible: false,
                formVisible: false,
                ids: [],
                tableData: [],
                allData: [],
                multipleSelection: [],
                currPage: 1,
                pageSize: 10,
                formLabelWidth: '120px'
            }
        },
        methods: {
            toAddArt() {
                this.$router.push('/articleMarkdown')
            },
            addArt() {
                let that=this
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/articleManager/addArticle',
                    params: {
                        userId: that.article.userId,
                        content: that.article.content,
                        img: that.imageUrl,
                        title: that.article.title
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code === SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.getAllArticle()
                        that.imageUrl = ''
                        that.addArtFormVisible=false
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    console.log(res)
                });
            },
            contentDialog(title,content) {
                this.showContent=true
                this.content=content
                this.title=title
            },
            open(msg, type) {
                this.$message({
                    message: msg,
                    type: type,
                    duration: 2000
                });
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = res
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';

                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            activeUpdate(val) {
                let that = this
                this.$ajax.get(this.requestURL + '/articleManager/getArticleById?id=' + val)
                    .then(res => {
                        if (res.data.code === SUCCESS_CODE) {
                            // that.dialogFormVisible = true
                            // that.form = res.data.data
                            // let t = this.changeTime(res.data.data.aTime)
                            // that.placeholder = t
                            that.$router.push({
                                name:'articleMarkdown',
                                params:{
                                  data:res.data.data
                                }
                            })
                        } else {
                            that.open(res.data.msg, 'error')
                        }
                    }).catch(res => {
                    console.log(res)
                })
            },
            updateArt(val) {
                this.dialogFormVisible = false
                let that = this;
                let time = this.placeholder
                if (this.value3 !== '') {
                    time = this.value3
                }
                let img = this.form.aImg
                if (this.imageUrl) {
                    img = this.imageUrl
                }
                this.$ajax({
                    method: 'POST',
                    url: this.requestURL + '/articleManager/updateArticle',
                    params: {
                        id: val,
                        content: that.form.aContent,
                        scan: that.form.aScan,
                        img: img,
                        love: that.form.love,
                        time: time,
                        title: that.form.aTitle
                    },
                    header: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data.code === SUCCESS_CODE) {
                        that.open(res.data.msg, 'success')
                        that.getAllArticle()
                        that.imageUrl = ''
                    } else {
                        that.open(res.data.msg, 'error')
                    }
                }).catch(res => {
                    console.log(res)
                });
            },

            getAllArticle() {
                let that = this
                this.$ajax.get(this.requestURL + '/article/articleList').then(res => {
                    if (res.data.code === SUCCESS_CODE) {
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
            remove() {
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delArt()
                }).catch(() => {

                });
            },
            delArt() {
                const len = this.multipleSelection.length
                if (len < 1) {
                    this.open("请先选择", 'error')
                    return;
                }
                for (let i = 0; i < len; i++) {
                    this.ids.push(this.multipleSelection[i].aId);
                }
                let that = this
                this.$ajax.get(this.requestURL + '/articleManager/delArticle?ids=' + this.ids)
                    .then(res => {
                        if (res.data.code === SUCCESS_CODE) {
                            that.open(res.data.msg, 'success')
                            that.getAllArticle()
                            that.multipleSelection.length = 0
                            that.ids.length = 0
                        } else {
                            that.open(res.data.msg, 'error')
                        }
                    }).catch(res => {
                    that.open(res.data.msg, 'error')
                })
            },
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
            }
        },
        mounted() {
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
                return y + '-' + m + '-' + d + ' ' + h + ':' + minute
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
            }
        }
    }
</script>

<style scoped>

</style>