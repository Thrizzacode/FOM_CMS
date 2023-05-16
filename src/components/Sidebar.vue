<template>
  <el-aside class="aside" width="250px">
    <el-col>
      <h5 class="side-title">FOM CSM</h5>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#f4e1fa"
        class="el-menu-vertical-demo"
        default-active="1"
        text-color="#333"
        popper-effect="light"
        router
      >
        <el-menu-item index="home">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <span>首頁</span>
        </el-menu-item>
        <el-menu-item index="merchant">
          <el-icon><icon-menu /></el-icon>
          <span>訂單管理</span>
        </el-menu-item>
        <el-menu-item index="access">
          <el-icon><UserFilled /></el-icon>
          <span>會員管理</span>
        </el-menu-item>
        <el-menu-item index="handover">
          <el-icon><TrendCharts /></el-icon>
          <span>財務分析</span>
        </el-menu-item>
        <el-menu-item index="announcement">
          <el-icon><Comment /></el-icon>
          <span>公告內容</span>
        </el-menu-item>
        <el-menu-item index="worklogs">
          <el-icon><Management /></el-icon>
          <span>首頁管理</span>
        </el-menu-item>
        <!-- <el-menu-item index="permissions" v-if="showIdentity">
          <el-icon>
            <Lock />
          </el-icon>
          <span>權限頁面</span>
        </el-menu-item>
        <el-menu-item index="user" v-if="showuUserIdentity">
          <el-icon>
            <User />
          </el-icon>
          <span>編輯使用者</span>
        </el-menu-item>
        <el-menu-item index="meeting" v-if="showuUserIdentity">
          <el-icon>
            <DataLine />
          </el-icon>
          <span>會議報告</span>
        </el-menu-item> -->
      </el-menu>
    </el-col>
  </el-aside>
</template>

<script setup lang="ts">
import {
  Menu as IconMenu,
  HomeFilled,
  UserFilled,
  Comment,
  TrendCharts,
  Management,
} from "@element-plus/icons-vue";
//import store identity
// import { storeToRefs } from "pinia";
// import { useAuthStore } from "../store";
// const users = useAuthStore();
// const { user } = storeToRefs(users);
// const identity = user.value.identity;

//權限頁面設置
// let showIdentity = false;
// if (identity === "admin" || identity === "DataAdmin") {
//   showIdentity = true;
// }
// let showuUserIdentity = false;
// if (identity === "admin") {
//   showuUserIdentity = true;
// }
</script>

<style lang="scss">
.aside {
  height: 100vh;
  background-color: #f4e1fa;
  box-shadow: 10px 0 5px#333;

  .side-title {
    color: #333;
    background-color: #eec8fc;
    font-size: 20px;
    letter-spacing: 2px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    vertical-align: middle;
    font-weight: bold;
    border-bottom: #333 solid 1px;
  }

  .el-menu-vertical-demo {
    border-right: none;
  }
}
</style>
