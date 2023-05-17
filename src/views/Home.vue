<template>
  <div class="common-layout">
    <el-container>
      <Sidebar />
      <el-container class="content is-vertical">
        <Header />
        <el-main class="main" justify="center">
          <el-scrollbar>
            <h1 class="homeTitle">歡迎進入FOM CSM</h1>
            <h2>現在時間: {{ timeNow }}</h2>
            <el-row style="width: 100%; height: 220px">
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
                      <el-statistic
                        title="今日收入"
                        :value="18520"
                        prefix="$"
                      />
                    </el-card>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="12">
                <h1 class="homeTitle2">最新公告内容</h1>
                <div class="homeList">
                  <el-table :data="announcementData" border>
                    <el-table-column
                      align="center"
                      prop="date"
                      label="日期"
                      width="150px"
                    />
                    <el-table-column
                      align="center"
                      prop="content"
                      label="內容"
                    />
                  </el-table>
                </div>
              </el-col>
            </el-row>
            <el-row
              style="width: 100%; flex-direction: column"
              justify="center"
            >
              <h1 style="text-align: center">每日營收統計</h1>
              <div id="charts"></div>
            </el-row>
            <el-row
              style="
                width: 100%;
                height: 250px;
                padding: 0 30px;
                margin: 20px 0;
              "
            >
              <h1>最新訂單</h1>
              <el-table :data="orderData" border>
                <el-table-column
                  align="center"
                  prop="orderNumber"
                  label="訂單編號"
                  width="150px"
                />
                <el-table-column
                  align="center"
                  prop="orderContent"
                  label="訂單內容"
                />
                <el-table-column
                  align="center"
                  prop="purchaser"
                  label="訂購人"
                />
                <el-table-column
                  align="center"
                  prop="status"
                  label="訂單狀態"
                />
              </el-table>
            </el-row>
            <el-dialog v-model="dialogTableVisible" title="最新公告内容">
              <el-table :data="announcementData" border>
                <el-table-column
                  align="center"
                  prop="date"
                  label="日期"
                  width="150px"
                />
                <el-table-column align="center" prop="content" label="內容" />
              </el-table>
            </el-dialog>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "../components/Sidebar.vue";
import Header from "../components/Header.vue";
import { onMounted, ref, reactive } from "vue";
// import axios from "../utils/http";
import { useNow, useDateFormat } from "@vueuse/core";

import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

const dialogTableVisible = ref(true);
const chartContainer = ref(null);
const timeNow = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");

//table內容
const announcementData: any = reactive([
  {
    date: "2023-05-17",
    content: "This is a test",
  },
]);
const orderData: any = reactive([
  {
    orderNumber: "FOM20230517",
    orderContent: "apple,banana",
    purchaser: "Mike",
    status: "準備中",
  },
]);

//charts內容
onMounted(() => {
  var chartDom = document.getElementById("charts");
  var myChart = echarts.init(chartDom);
  var option;

  option = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      name: "金額",
      type: "value",
      axisLabel: {
        formatter: (value) => "$" + value, // 在数值前加上 "$" 符号
      },
    },
    series: [
      {
        data: [18520, 13899, 8224, 9218, 7135, 12147, 22260],
        type: "line",
        label: {
          show: true, // 显示标签
          position: "top", // 标签位置（可根据需要调整）
          formatter: "${c}", // 显示数值
        },
      },
    ],
    backgroundColor: "#fff",
  };

  option && myChart.setOption(option);
});
</script>

<style lang="scss" scoped>
#charts {
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: center;
  // margin: 0 auto;
}
.common-layout {
  width: 100%;
}
.content {
  height: 100vh;

  .main {
    height: 100%;
    width: calc(100% - 250px);
    background-color: #e8e5e5;
    padding: 0;
    display: flex;
    width: 100%;
    justify-content: center;
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

  h1,
  h2 {
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

html.dark {
  .main {
    background-color: #555;
    color: #fff;
  }
}
</style>
