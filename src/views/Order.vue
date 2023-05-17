<template>
  <div class="common-layout">
    <el-container>
      <Sidebar />
      <el-container class="content is-vertical">
        <Header />
        <el-main class="main" justify="center"> order </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "../components/Sidebar.vue";
import Header from "../components/Header.vue";
import { onMounted, ref, reactive } from "vue";
</script>

<style lang="scss" scoped>
.common-layout {
  width: 100%;
}
.content {
  width: calc(100% - 250px);

  .main {
    background-color: #e8e5e5;
    padding: 0;
    display: flex;
    width: 100%;
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
