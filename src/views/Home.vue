<template>
  <div class="common-layout">
    <el-container>
      <Sidebar />
      <el-container class="content is-vertical">
        <Header />
        <el-main class="main" justify="center">
          <h1 class="homeTitle">歡迎進入FOM CSM</h1>
          <el-row style="width: 100%; height: 250px">
            <el-col :span="12" style="padding-top: 50px">
              <el-row justify="center">
                <el-col :span="8" class="center">
                  <el-card class="card-box">
                    <el-statistic title="會員總人數" :value="10000" />
                  </el-card>
                </el-col>
                <el-col :span="8" class="center">
                  <el-card class="card-box">
                    <el-statistic title="每日訂單統計" :value="386" />
                  </el-card>
                </el-col>
                <el-col :span="8" class="center">
                  <el-card class="card-box">
                    <el-statistic title="今日收入" :value="18520" prefix="$" />
                  </el-card>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <h1 class="homeTitle2">最新公告内容</h1>
              <div class="homeList">
                <el-table :data="tableData" border class="wikiTable">
                  <el-table-column
                    align="center"
                    prop="date"
                    label="日期"
                    width="150px"
                  />
                  <el-table-column align="center" prop="content" label="內容" />
                </el-table>
              </div>
            </el-col>
          </el-row>
          <el-dialog v-model="dialogTableVisible" title="最新公告内容">
            <el-table :data="dialogData" border class="wikiTable">
              <el-table-column
                align="center"
                prop="date"
                label="日期"
                width="150px"
              />
              <el-table-column align="center" prop="content" label="內容" />
            </el-table>
          </el-dialog>
          <!-- 測試用 -->
          <!-- <el-table :data="testData" border>
            <el-table-column align="center" prop="test.a" label="a" />
            <el-table-column align="center" prop="test.b" label="b" />
          </el-table> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "../components/Sidebar.vue";
import Header from "../components/Header.vue";
import { onMounted, ref, reactive } from "vue";
import moment from "moment-timezone";
// import axios from "../utils/http";

const dialogTableVisible = ref(true);
const tableData: any = reactive([]);
const dialogData: any = reactive([]);

//设定弹窗公告时间约定时间
const curTime = new Date().getTime();
const startDate = curTime - 30 * 3600 * 24 * 1000;
const lastTime = moment.tz(startDate, "Asia/Taipei").format("yyyy-MM-DD");
const time1 = Date.parse(lastTime);
// const testData: any= reactive([]);

//设定一进入页面直接render公告内容
// onMounted(async () => {
//   try {
//     await axios.get("/api/announcement").then((res) => {
//       res.data.forEach((item) => {
//         tableData.push(item);
//       });
//       for (let i = 0; i < res.data.length; i++) {
//         const item = res.data[i];
//         const date = item.date;
//         const resDate = Date.parse(date);
//         // console.log(typeof resDate);
//         // console.log(time1);
//         // console.log(resDate);
//         if (resDate > time1) {
//           dialogData.push(item);
//           // console.log(true);
//         }
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
</script>

<style lang="scss" scoped>
.content {
  width: calc(100% - 250px);

  .main {
    background-color: #e8e5e5;
    padding: 0;
    display: flex;
    // justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .homeList {
    margin: 0 auto;
    background-color: #fff;
    width: 80%;
    border-radius: 20px;
  }

  .homeTitle {
    font-size: 30px;
    padding: 20px;
  }

  .homeTitle2 {
    padding: 10px;
    text-align: center;
  }

  .card-box {
    width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
