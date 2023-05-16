<template>
  <el-header class="head">
    <el-icon>
      <User />
    </el-icon>
    <span class="user_name">Hello {{ userName }}</span>
    <el-dropdown trigger="click" @command="handleDropdown">
      <el-icon><ArrowDownBold /></el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="info">身份內容</el-dropdown-item>
          <el-dropdown-item command="logout">登出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-header>
</template>
<script setup lang="ts">
import { User } from "@element-plus/icons-vue";
import { ArrowDownBold } from "@element-plus/icons-vue";
// import { useAuthStore } from "../store";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

// const users = useAuthStore();
// const { user } = storeToRefs(users);
// const store = useAuthStore();
// const router = useRouter();
// const userName = user.value.name;
const userName = "test";

//下拉選單
const handleDropdown = (item: String) => {
  switch (item) {
    case "info":
      showUserInfo();
      break;
    case "logout":
      logout();
      break;
  }
};
//導向個人頁面
const showUserInfo = () => {};
//登出按鈕
const logout = () => {
  localStorage.removeItem("loginToken");
  // store.setAuth(false);
  // store.setUser(null);
  // router.push("/login");
};
</script>
<style lang="scss">
.head {
  background-color: #fff;
  height: 50px;
  display: flex;
  justify-content: end;
  align-items: center;
  border-bottom: #333 solid 1px;

  .user_name {
    margin-left: 5px;
    margin-right: 10px;
  }
}
</style>
