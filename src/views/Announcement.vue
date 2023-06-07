<template>
  <div class="common-layout">
    <el-container>
      <Sidebar />
      <el-container class="content is-vertical">
        <Header />
        <el-main class="main">
          <div class="tableContain">
            <div>
              <el-form :inline="true">
                <el-form-item class="inpNum">
                  <el-date-picker
                    v-model="announcementDate"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="開始時間"
                    end-placeholder="結束時間"
                  />
                </el-form-item>

                <el-form-item class="search">
                  <el-button type="primary" @click="sort">查詢</el-button>
                </el-form-item>

                <el-form-item>
                  <el-button type="success" @click="addDialogVisible = true"
                    >新增公告</el-button
                  >
                </el-form-item>
                <el-form-item>
                  <div title="刷新" class="pub-refresh" @click="refreshPage">
                    <el-icon><Refresh /></el-icon>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <el-table
              :data="announcementData"
              style="width: 100%"
              order
              height="74.4vh"
              :row-style="{ height: '68px' }"
            >
              <el-table-column
                align="center"
                prop="date"
                label="公告日期"
                width="200"
              />
              <el-table-column align="center" prop="content" label="公告內容" />
              <el-table-column
                width="120"
                align="center"
                prop="publisher"
                label="公告人"
              />
              <el-table-column
                label="編輯"
                align="center"
                width="200px"
                prop="edit"
                fixed="right"
              >
                <template #default="scope">
                  <el-button
                    size="small"
                    type="primary"
                    @click="editAnnouncementConfirm(scope.row)"
                    >編輯</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="delAnnouncementConfirm(scope.row)"
                    >刪除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 分頁設定 -->
            <el-row>
              <el-col :span="24">
                <div class="pageination">
                  <el-pagination
                    class="msg-pagination-container"
                    v-model:current-page="page_index"
                    v-model:page-size="page_size"
                    :page-sizes="page_sizes"
                    :layout="layout"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                  />
                </div>
              </el-col>
            </el-row>
          </div>
          <el-dialog v-model="addDialogVisible" title="新增公告" width="30%">
            <el-form
              ref="ruleFromRef"
              :model="announcementForm"
              :label-position="position"
              :rules="rules"
            >
              <el-form-item label="公告內容:" prop="content">
                <el-input
                  type="textarea"
                  rows="15"
                  v-model="announcementForm.content"
                />
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button
                  @click="
                    addDialogVisible = false;
                    resetInputForm(ruleFromRef);
                  "
                  >取消</el-button
                >
                <el-button type="primary" @click="addAnnouncement(ruleFromRef)">
                  確認
                </el-button>
              </span>
            </template>
          </el-dialog>
          <el-dialog v-model="editDialogVisible" title="修改公告" width="30%">
            <el-form
              ref="ruleFromRef"
              :model="editIn"
              :label-position="position"
              :rules="rules"
            >
              <el-form-item label="公告內容:" prop="content">
                <el-input type="textarea" rows="15" v-model="editIn.content" />
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button
                  @click="
                    editDialogVisible = false;
                    resetInputForm(ruleFromRef);
                  "
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  @click="editAnnouncement(ruleFromRef)"
                >
                  確認
                </el-button>
              </span>
            </template>
          </el-dialog>
          <el-dialog
            ref="dialog"
            v-model="delDialogVisible"
            title="注意刪除後不可回復"
            width="30%"
            align-center
          >
            <span>請再次確認是否要刪除</span>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="delDialogVisible = false">取消</el-button>
                <el-button
                  type="primary"
                  @click="
                    delAnnouncement(deleteIn);
                    delDialogVisible = false;
                  "
                >
                  刪除
                </el-button>
              </span>
            </template>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Sidebar from "../components/Sidebar.vue";
import Header from "../components/Header.vue";
import axios from "../config/axiosConfig.js";
import { ref, reactive, onMounted } from "vue";
import { useDateFormat } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { Refresh } from "@element-plus/icons-vue";
const position = ref("top");
const announcementData = ref([]);
const announcementDate = ref("");
const addDialogVisible = ref(false);
const editDialogVisible = ref(false);
const delDialogVisible = ref(false);
const deleteIn = ref({});
const editIn = ref({});
const announcementForm = reactive({
  content: "",
});

//分頁配置設定
const total = ref(0); //總共有幾條
const page_index = ref(1); //現在在哪裡一頁
const page_size = ref(10); //一頁有多少條
const page_sizes = [10, 20, 50, 100]; //每頁有幾條
const layout = "total, sizes, prev, pager, next, jumper"; //下一頁布局
const pageable = reactive({
  page: page_index.value - 1,
  size: page_size.value,
  sort: "announcementid,desc",
});

//分頁方法處理
const handleSizeChange = (size) => {
  pageable.size = size;
  fetchAnnouncement();
};
const handleCurrentChange = (page) => {
  pageable.page = page - 1;
  fetchAnnouncement();
};

//表單驗證
const ruleFromRef = ref(null);
const rules = reactive({
  content: [
    {
      required: true,
      message: "請輸入公告內容",
      trigger: "blur",
    },
  ],
});
const resetInputForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

//獲取公告資料
const fetchAnnouncement = async () => {
  console.log(pageable);
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_GET_ANNOUNCEMENT_API}?page=${
        page_index.value - 1
      }&size=${page_size.value}&sort=date,desc`,
      pageable
    );
    console.log(data);
    announcementData.value = data.content;
    announcementData.value.map((item) => {
      item.date = useDateFormat(item.date, "YYYY-MM-DD HH:mm:ss");
    });
    total.value = data.totalElements;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  fetchAnnouncement();
});

//新增公告
const addAnnouncement = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      try {
        console.log(announcementForm);
        const { data } = await axios.post(
          import.meta.env.VITE_ADD_ANNOUNCEMENT_API,
          announcementForm
        );

        resetForm();
        fetchAnnouncement();
        fetchAnnouncementCount();
        addDialogVisible.value = false;
        ElMessage({
          type: "success",
          message: "新增成功",
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("error submit!", fields);
      ElMessage.error("請輸入正確資料");
    }
  });
};

//修改公告
const editAnnouncement = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      try {
        const { data } = await axios.put(
          import.meta.env.VITE_EDIT_ANNOUNCEMENT_API,
          editIn.value
        );
        console.log(data);
        resetForm();
        resetData();
        editDialogVisible.value = false;
        ElMessage({
          type: "success",
          message: "修改成功",
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("error submit!", fields);
      ElMessage.error("請輸入正確資料");
    }
  });
};

//刪除公告
const delAnnouncement = async (deleteIn) => {
  console.log(deleteIn);
  try {
    const { data } = await axios.delete(
      `${import.meta.env.VITE_DELETE_ANNOUNCEMENT_API}${
        deleteIn.announcementid
      }`
    );
    console.log(data);
    fetchAnnouncement();
    ElMessage({
      type: "success",
      message: "刪除成功",
    });
  } catch (error) {
    console.log(error);
  }
};

//確認是否刪除公告
const delAnnouncementConfirm = (row) => {
  console.log(row);
  delDialogVisible.value = true;
  deleteIn.value = row;
  console.log(deleteIn.value);
};

//確認是否修改公告
const editAnnouncementConfirm = (row) => {
  console.log(row);
  editDialogVisible.value = true;
  editIn.value = row;
  console.log(editIn.value);
};

//重置Form
const resetForm = () => {
  announcementForm.content = "";
};

//重新整理table
const refreshPage = () => {
  fetchAnnouncement();
};
</script>

<style lang="scss" scoped>
.pub-refresh {
  width: 30px;
  height: 30px;
  position: fixed;
  text-align: center;
  z-index: 2;
  right: 20px;
  cursor: pointer;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  opacity: 0.6;
}
.content {
  width: calc(100vw - 250px);
  .main {
    background-color: #e8e5e5;
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 90vh;
  }
  // 表格樣式
  .tableContain {
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
  }
  //上排row样式
  .btn-left {
    float: right;
  }
  .inpNum {
    float: left;
  }
  .timeSort {
    float: left;
    margin-left: 15px;
  }
  .tySort {
    float: left;
    margin-left: 15px;
    .tySelect {
      width: 150px;
    }
  }
  .status {
    float: left;
    margin-left: 15px;
    .statusSelect {
      width: 150px;
    }
  }
  .search {
    float: left;
    margin-left: 15px;
  }
  .download {
    float: left;
    margin-left: 15px;
  }
  //分页样式
  .pageination {
    float: right;
    margin-top: 20px;
  }
}
</style>
