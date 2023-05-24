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
                  <el-input
                    v-model="membershipID"
                    placeholder="請輸入要查詢的會員ID"
                    style="width: 180px"
                    clearable
                  />
                </el-form-item>

                <el-form-item class="status">
                  <el-select
                    clearable
                    placeholder="輸入查詢狀態"
                    v-model="statusValue"
                    class="statusSelect"
                  >
                    <el-option label="準備中" value="準備中" />
                    <el-option label="確認中" value="確認中" />
                    <el-option label="未付款" value="未付款" />
                    <el-option label="已付款" value="已付款" />
                    <el-option label="已出貨" value="已出貨" />
                  </el-select>
                </el-form-item>
                <el-form-item class="search">
                  <el-button type="primary" @click="sort">查詢</el-button>
                </el-form-item>

                <el-form-item>
                  <el-button type="success" @click="addDialogVisible = true"
                    >新增會員</el-button
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
              :data="tableData"
              style="width: 100%"
              order
              height="74.4vh"
              :row-style="{ height: '68px' }"
            >
              <el-table-column
                align="center"
                prop="id"
                label="會員ID"
                width="200"
              />
              <el-table-column
                align="center"
                prop="name"
                label="會員名稱"
                width="200"
              />
              <el-table-column align="center" prop="phone" label="電話" />
              <el-table-column align="center" prop="address" label="地址" />
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
                    @click="editMemberConfirm(scope.row)"
                    >編輯</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="delMemberConfirm(scope.row)"
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
                    v-if="total > 0"
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
          <el-dialog v-model="addDialogVisible" title="新增會員" width="30%">
            <el-form
              ref="ruleFromRef"
              :model="memberForm"
              :label-position="position"
              :rules="rules"
            >
              <el-form-item label="會員姓名:" prop="name">
                <el-input v-model="memberForm.name" />
              </el-form-item>
              <el-form-item label="電話:" prop="phone">
                <el-input v-model="memberForm.phone" maxlength="10" />
              </el-form-item>
              <el-form-item label="地址:" prop="address">
                <el-input v-model="memberForm.address" />
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
                <el-button type="primary" @click="addMember(ruleFromRef)">
                  確認
                </el-button>
              </span>
            </template>
          </el-dialog>
          <el-dialog v-model="editDialogVisible" title="修改會員" width="30%">
            <el-form
              ref="ruleFromRef"
              :model="editIn"
              :label-position="position"
              :rules="rules"
            >
              <el-form-item label="會員姓名:" prop="name">
                <el-input v-model="editIn.name" />
              </el-form-item>
              <el-form-item label="電話:" prop="phone">
                <el-input v-model="editIn.phone" maxlength="10" />
              </el-form-item>
              <el-form-item label="地址:" prop="address">
                <el-input v-model="editIn.address" />
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
                <el-button type="primary" @click="editMember(ruleFromRef)">
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
                    delMember(deleteIn);
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
import { ElMessage } from "element-plus";
import { Refresh } from "@element-plus/icons-vue";
const position = ref("top");
const tableData = ref([]);
const addDialogVisible = ref(false);
const editDialogVisible = ref(false);
const delDialogVisible = ref(false);
const deleteIn = ref({});
const editIn = ref({});
const memberForm = reactive({
  name: "",
  phone: "",
  address: "",
});

//表單驗證
const ruleFromRef = ref(null);
const rules = reactive({
  name: [
    {
      required: true,
      message: "請輸入會員姓名",
      trigger: "blur",
    },
  ],
  phone: [
    {
      required: true,
      message: "請輸入電話",
      trigger: "blur",
    },
    {
      pattern: /^[0][9][0-9]{8}$/,
      trigger: ["blur", "change"],
      message: "請輸入09開頭的正確電話號碼",
    },
  ],
  address: [
    {
      required: true,
      message: "請輸入地址",
      trigger: "blur",
    },
  ],
});
const resetInputForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

//獲取會員資料
const fetchMember = async () => {
  try {
    const { data } = await axios.get(import.meta.env.VITE_GET_MEMBERSHIP_API);
    console.log(data);
    tableData.value = data;
    console.log(tableData.value);
    // setPageinations();
  } catch (error) {
    console.log(error);
  }
};
onMounted(fetchMember);

//新增會員
const addMember = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      try {
        console.log(memberForm);
        const { data } = await axios.post(
          import.meta.env.VITE_ADD_MEMBERSHIP_API,
          memberForm
        );

        resetForm();
        resetData();
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

//修改會員
const editMember = (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log("submit!");
      try {
        const { data } = await axios.put(
          import.meta.env.VITE_EDIT_MEMBERSHIP_API,
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

//刪除會員
const delMember = async (deleteIn) => {
  console.log(deleteIn);
  try {
    const { data } = await axios.delete(
      `${import.meta.env.VITE_DELETE_MEMBERSHIP_API}${deleteIn.id}`
    );
    console.log(data);
    resetData();
    ElMessage({
      type: "success",
      message: "刪除成功",
    });
  } catch (error) {
    console.log(error);
  }
};

//確認是否刪除會員
const delMemberConfirm = (row) => {
  console.log(row);
  delDialogVisible.value = true;
  deleteIn.value = row;
  console.log(deleteIn.value);
};

const editMemberConfirm = (row) => {
  console.log(row);
  editDialogVisible.value = true;
  editIn.value = row;
  console.log(editIn.value);
};

//重置Form
const resetForm = () => {
  memberForm.name = "";
  memberForm.phone = "";
  memberForm.address = "";
};

//重置資料
const resetData = async () => {
  try {
    const { data } = await axios.get(import.meta.env.VITE_GET_MEMBERSHIP_API);
    console.log(data);
    tableData.value = data;
    console.log(tableData.value);
    setPageinations();
  } catch (error) {
    console.log(error);
  }
};

//重新整理table
const refreshPage = () => {
  resetData();
  console.log("done");
};
//分頁配置設定
const page_index = ref(1), //現在在哪裡一頁
  page_size = ref(5), //一頁有多少條
  total = ref(0), //有幾條
  page_sizes = [10, 20, 50, 100], //每頁有幾條
  layout = "total, sizes, prev, pager, next, jumper", //下一頁布局
  isBackground = true;

//查詢功能設定
const startTime = ref();
const endTime = ref();
const productTypeValue = ref();
const statusValue = ref();
const membershipID = ref();

//表格資訊
// const getProfiles = async () => {
//   const { data } = await axios.get(import.meta.env.VITE_GET_WORKLOG_API!);
//   console.log(data);
//   tableData.value = data.reverse();
//   allTableData.value = data;
//   filterTableData.value = data;
//   setPageinations();
// };
//一進來就render表格
// watchEffect(() => getProfiles());
// const handleContent = (row) => {
//   showr.value = true;
//   console.log(row);
//   contentData.value = row;
// };
// const handleDetailContent = (row, column) => {
//   showd.value = true;
//   console.log(row);
//   console.log(column);
//   rowData.value = row;
//   columnData.value = column;
// };
//編輯按鈕
const handleEdit = (row) => {
  show.value = true;
  console.log(row);
  editData.value = row;
};
//刪除按鈕
// const handleDelete = async (row) => {
//   centerDialogVisible.value = true;
//   deleteIn = row;
//   getProfiles();
//   return deleteIn;
// };
//刪除按鈕內部
// const handleDeleteIn = (deleteIn) => {
//   axios.delete(`/api/worklog/deleteworklog/${deleteIn._id}`);
//   ElMessage.success("刪除成功");
//   getProfiles();
// };
//新增按鈕
const orderAdd = () => {
  show.value = true;
  editData.value = "";
};
//重新render表格
// const handleUpdateProfiles = () => {
//   getProfiles();
// };
//下載圖片
const download = (file) => {
  let a = document.createElement("a");
  a.download = file.column.label;
  a.href = file.row.base;
  a.click();
};

//分頁方法處理
const handleSizeChange = (pages) => {
  // console.log(pages);
  page_index.value = 1;
  page_size.value = pages;
  tableData.value = allTableData.value.filter((item, index) => {
    return index < page_size.value;
  });
};
const handleCurrentChange = (page) => {
  let currentPage = page_size.value * (page - 1);
  let pageData = allTableData.value.filter((item, index) => {
    return index >= currentPage;
  });
  tableData.value = pageData.filter((item, index) => {
    return index < page_size.value;
  });
};
const setPageinations = () => {
  total.value = allTableData.value.length;
  page_index.value = 1;
  page_size.value = 10;
  tableData.value = allTableData.value.filter((item, index) => {
    return index < page_size.value;
  });
};

//查詢按鈕
const sort = () => {
  if (
    !startTime.value &&
    !endTime.value &&
    !productTypeValue.value &&
    !statusValue.value &&
    !membershipID.value
  ) {
    ElMessage({
      type: "warning",
      message: "請選擇要查詢條件",
    });
    // getProfiles();
    return;
  } else if (
    (!startTime.value && endTime.value) ||
    (startTime.value && !endTime.value)
  ) {
    ElMessage({
      type: "error",
      message: "選擇開始查詢時間就要選擇結束時間",
    });
    // getProfiles();
    return;
  }
  //多條件選擇
  const ptvalue = productTypeValue.value ? productTypeValue.value : null;
  const caseStatus = statusValue.value ? statusValue.value : null;
  const serialNum = membershipID.value ? membershipID.value : null;
  const stime = startTime.value ? startTime.value.getTime() : null;
  const etime = endTime.value ? endTime.value.getTime() : null;
  allTableData.value = filterTableData.value.filter((item) => {
    let date = new Date(item.date);
    let time = date.getTime();
    return (
      (stime ? time >= stime : true) &&
      (etime ? time <= etime : true) &&
      (ptvalue ? item.productType === ptvalue : true) &&
      (caseStatus ? item.caseStatus === caseStatus : true) &&
      (serialNum ? item.caseNumber === serialNum : true)
    );
  }); //
  //選擇後數據重新分頁
  setPageinations();
};
//下載選擇內容EXCEL
// const downloadDetail = () => {
//   const workbook = new Workbook();
//   const worksheet = workbook.addWorksheet("交接列表");
//   worksheet.columns = [
//     { header: "建單時間", key: "createDate", width: 20 },
//     { header: "單號", key: "caseNumber", width: 20 },
//     { header: "提交人", key: "receiver", width: 20 },
//     { header: "產品別", key: "productType", width: 20 },
//     { header: "商戶名稱", key: "merchant", width: 20 },
//     { header: "案件分類第一層", key: "caseTypeFirst", width: 20 },
//     { header: "案件分類第二層", key: "caseTypeSecond", width: 20 },
//     { header: "案件分類第三層", key: "caseTypeThird", width: 20 },
//     { header: "案件描述", key: "describe", width: 20 },
//     { header: "案件回復", key: "caseRes", width: 20 },
//     { header: "處理單位", key: "workUnit", width: 20 },
//     { header: "案件狀況", key: "caseStatus", width: 20 },
//     { header: "結案時間", key: "caseOverTime", width: 20 },
//   ];
//   const ptvalue = productTypeValue.value ? productTypeValue.value : null;
//   const caseStatus = statusValue.value ? statusValue.value : null;
//   const serialNum = membershipID.value ? membershipID.value : null;
//   const stime = startTime.value ? startTime.value.getTime() : null;
//   const etime = endTime.value ? endTime.value.getTime() : null;
//   allTableData.value = filterTableData.value.filter((item) => {
//     let date = new Date(item.date);
//     let time = date.getTime();
//     return (
//       (stime ? time >= stime : true) &&
//       (etime ? time <= etime : true) &&
//       (ptvalue ? item.productType === ptvalue : true) &&
//       (caseStatus ? item.caseStatus === caseStatus : true) &&
//       (serialNum ? item.caseNumber === serialNum : true)
//     );
//   }); //
//   // console.log(allTableData.value);
//   allTableData.value.forEach((item{
//     worksheet.addRow({
//       createDate: item.creatDate,
//       caseNumber: item.caseNumber,
//       receiver: item.receiver,
//       productType: item.productType,
//       merchant: item.merchant,
//       caseTypeFirst: item.caseTypeFirst,
//       caseTypeSecond: item.caseTypeSecond,
//       caseTypeThird: item.caseTypeThird,
//       describe: item.describe,
//       caseRes: item.caseRes,
//       workUnit: item.workUnit,
//       caseStatus: item.caseStatus,
//       caseOverTime: item.caseOverTime,
//     });
//   });
//   workbook.xlsx.writeBuffer().then((buffer) => {
//     const link = document.createElement("a");
//     const blobData = new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     link.download = "交接試算表.xlsx";
//     link.href = window.URL.createObjectURL(blobData);
//     link.click();
//   });
// };
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
