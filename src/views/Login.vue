<template>
  <div class="main">
    <div class="container b-container" id="b-container">
      <form class="form" id="b-form">
        <h2 class="form_title title">Welcome to FOM</h2>
        <input
          class="form__input"
          v-model="user.username"
          type="text"
          placeholder="ID"
        />
        <input
          class="form__input"
          v-model="user.password"
          type="password"
          placeholder="Password"
        />
        <el-row style="margin-top: 30px">
          <button class="form__button button" @click="login">LOGIN</button>
          <button class="form__button button" @click="signUp">SIGN UP</button>
        </el-row>
      </form>
    </div>
    <div class="switch" id="switch-cnt">
      <div class="switch__circle"></div>
      <div class="switch__circle switch__circle--t"></div>
      <div class="switch__container" id="switch-c1">
        <h2 class="switch__title title">FOM CMS</h2>
        <p class="switch__description description">
          Please login with your personal info
        </p>
        {{ user.username }}
        {{ user.password }}
      </div>
    </div>
    <el-dialog v-model="signUpDialogVisible" title="註冊會員" width="30%">
      <el-form
        ref="ruleFromRef"
        :model="signUpForm"
        :label-position="position"
        :rules="rules"
      >
        <el-form-item label="使用者帳號:" prop="username">
          <el-input v-model="signUpForm.username" />
        </el-form-item>
        <el-form-item label="使用者密碼:" prop="password">
          <el-input type="password" v-model="signUpForm.password" />
        </el-form-item>
        <el-form-item label="使用者信箱:" prop="email">
          <el-input v-model="signUpForm.email">
            <template #append>
              <el-button @click="getVerifyCode()" :disabled="isButtonDisabled">
                {{ verifyButton }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="verifyCodeSended"
          label="請輸入6位數驗證碼:"
          prop="verifyCode"
        >
          <el-input v-model="signUpForm.verifyCode"> </el-input>
        </el-form-item>
        <el-form-item label="權限:" prop="identity">
          <el-select
            v-model="signUpForm.identity"
            class="m-2"
            placeholder="請選擇權限"
            size="large"
            multiple
            style="width: 300px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="
              signUpDialogVisible = false;
              resetForm();
            "
            >取消</el-button
          >
          <el-button type="primary" @click="signUpConfirm(ruleFromRef)">
            確認
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import axios from "axios";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const store = useAuthStore();
const verifyButton = ref("獲取驗證碼");
const isButtonDisabled = ref(false);
const signUpDialogVisible = ref(false);
const verifyCodeSended = ref(false);
const position = ref("top");

const user = reactive({
  username: "",
  password: "",
});

const signUpForm = reactive({
  username: "",
  password: "",
  email: "",
  identity: [],
  verifyCode: "",
});

const options = [
  {
    value: "ADMIN",
    label: "管理員",
  },
  {
    value: "NORMAL",
    label: "一般使用者",
  },
  {
    value: "TS",
    label: "技術人員",
  },
];

//登入
const login = async (e) => {
  try {
    e.preventDefault();
    const { data } = await axios.post(import.meta.env.VITE_GET_TOKEN_API, user);
    localStorage.setItem("token", data.token);
    console.log(data.token);
    await axios.post(import.meta.env.VITE_LOGIN_API, user).then((res) => {
      console.log(res.data);
      if (res.data.status === 200) {
        ElMessage({
          message: "登錄成功.",
          type: "success",
        });
        router.push("/home");
      }
    });
  } catch (error) {
    console.log(error);
    ElMessage({
      message: "請檢查帳號及密碼是否正確.",
      type: "error",
    });
  }
  console.log(localStorage.getItem("token"));
  const { data: tokenData } = await axios.post(
    import.meta.env.VITE_PARSE_TOKEN_API,
    {
      token: localStorage.getItem("token"),
    }
  );
  store.setUserName(tokenData.username);
  console.log(tokenData);
};

const signUp = (e) => {
  e.preventDefault();
  signUpDialogVisible.value = true;
};

//獲取驗證碼
const getVerifyCode = async () => {
  try {
    await axios
      .post(import.meta.env.VITE_GET_VERIFYCODE_API, {
        name: signUpForm.username,
        subject: "註冊驗證碼",
        receivers: [signUpForm.email],
      })
      .then((res) => {
        console.log(res);
        if (res.status === 204) {
          verifyCodeSended.value = true;
          isButtonDisabled.value = true;
          let time = 60;
          let clock = setInterval(() => {
            verifyButton.value = `${time}秒後重新獲取`;
            time--;
            if (time < 0) {
              clearInterval(clock);
              verifyButton.value = "重新獲取驗證碼";
              isButtonDisabled.value = false;
              time = 60;
            }
          }, 1000);
          ElMessage({
            message: "驗證碼發送成功",
            type: "success",
          });
        } else {
          ElMessage({
            message: "驗證碼發送失敗",
            type: "error",
          });
        }
      });
  } catch (error) {
    console.log(error);
  }
};

//註冊
const signUpConfirm = async () => {
  try {
    console.log(signUpForm);
    await axios
      .post(import.meta.env.VITE_SIGNUP_API, signUpForm)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          ElMessage({
            message: "註冊成功.",
            type: "success",
          });
        }
        signUpDialogVisible.value = false;
      })
      .catch((err) => {
        console.log(err);
        ElMessage({
          message: "註冊失敗.",
          type: "error",
        });
      });
    await axios
      .post(import.meta.env.VITE_SENDMAIL_API, {
        name: signUpForm.username,
        subject: "註冊成功通知",
        receivers: [signUpForm.email],
      })
      .then((res) => {
        console.log(res);
        if (res.status === 204) {
          ElMessage({
            message: "寄送成功.",
            type: "success",
          });
        }
      });
  } catch (error) {
    console.log(error);
    ElMessage({
      message: "寄送失敗.",
      type: "error",
    });
  }
  resetForm();
};

const resetForm = () => {
  signUpForm.username = "";
  signUpForm.password = "";
  signUpForm.identity = [];
  signUpForm.email = "";
  signUpForm.verifyCode = "";
};
</script>

<style lang="scss" scoped>
$bg: #edf2f0;

$neu-1: #ecf0f3;
$neu-2: #d1d9e6;

$white: #f9f9f9;
$gray: #a0a5a8;
$black: #181818;

$purple: #4b70e2;

$transition: 1.25s;

*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}
/* Generic */
body {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  background-color: $neu-1;
  color: $gray;
}
/**/
.main {
  margin: 0 auto;
  position: relative;
  width: 1000px;
  min-width: 1000px;
  min-height: 600px;
  height: 600px;
  padding: 25px;
  background-color: $neu-1;
  box-shadow: 10px 10px 10px $neu-2, -10px -10px 10px $white;
  border-radius: 12px;
  overflow: hidden;
  @media (max-width: 1200px) {
    transform: scale(0.7);
  }
  @media (max-width: 1000px) {
    transform: scale(0.6);
  }
  @media (max-width: 800px) {
    transform: scale(0.5);
  }
  @media (max-width: 600px) {
    transform: scale(0.4);
  }
}
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;

  top: 0;
  width: 600px;
  height: 100%;
  padding: 25px;

  background-color: $neu-1;
  transition: $transition;
}
.form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &__icon {
    object-fit: contain;
    width: 30px;
    margin: 0 5px;
    opacity: 0.5;
    transition: 0.15s;

    &:hover {
      opacity: 1;
      transition: 0.15s;
      cursor: pointer;
    }
  }
  &__input {
    width: 350px;
    height: 40px;
    margin: 4px 0;

    padding-left: 25px;
    font-size: 13px;
    letter-spacing: 0.15px;
    border: none;
    outline: none;

    font-family: "Montserrat", sans-serif;
    background-color: $neu-1;
    transition: 0.25s ease;
    border-radius: 8px;

    box-shadow: inset 2px 2px 4px $neu-2, inset -2px -2px 4px $white;

    &:focus {
      box-shadow: inset 4px 4px 4px $neu-2, inset -4px -4px 4px $white;
    }
  }
  &__span {
    margin-top: 30px;
    margin-bottom: 12px;
  }
  &__link {
    color: $black;
    font-size: 15px;
    margin-top: 25px;
    border-bottom: 1px solid $gray;
    line-height: 2;
  }
}
.title {
  font-size: 34px;
  font-weight: 700;
  line-height: 3;
  color: $black;
}
.description {
  font-size: 14px;
  letter-spacing: 0.25px;
  text-align: center;
  line-height: 1.6;
}
.button {
  width: 180px;
  height: 50px;
  border-radius: 25px;
  margin-top: 50px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1.15px;

  margin: 0 10px;

  background-color: $purple;
  color: $white;
  box-shadow: 8px 8px 16px $neu-2, -8px -8px 16px $white;

  border: none;
  outline: none;

  cursor: pointer;
}
/**/

.b-container {
  left: calc(100% - 600px);
  z-index: 0;
}

.switch {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 400px;

  padding: 50px;
  z-index: 200;
  transition: $transition;

  background-color: $neu-1;
  overflow: hidden;

  box-shadow: 4px 4px 10px $neu-2, -4px -4px 10px $white;

  &__circle {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background-color: $neu-1;
    box-shadow: inset 8px 8px 12px $neu-2, inset -8px -8px 12px $white;

    bottom: -60%;
    left: -60%;
    transition: $transition;

    &--t {
      top: -30%;
      left: 60%;
      width: 300px;
      height: 300px;
    }
  }

  &__container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: absolute;
    width: 400px;
    padding: 50px 55px;

    transition: $transition;
  }

  &__button {
    cursor: pointer;
    &:hover {
      box-shadow: 6px 6px 10px $neu-2, -6px -6px 10px $white;
      transform: scale(0.985);
      transition: 0.25s;
    }
    &:active,
    &:focus {
      box-shadow: 2px 2px 6px $neu-2, -2px -2px 6px $white;
      transform: scale(0.97);
      transition: 0.25s;
    }
  }
}
/**/
.is-txr {
  left: calc(100% - 400px);
  transition: $transition;
  transform-origin: left;
}
.is-txl {
  left: 0;
  transition: $transition;
  transform-origin: right;
}
.is-z200 {
  z-index: 200;
  transition: $transition;
}
.is-hidden {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  transition: $transition;
}
.is-gx {
  animation: is-gx $transition;
}
@keyframes is-gx {
  0%,
  10%,
  100% {
    width: 400px;
  }
  30%,
  50% {
    width: 500px;
  }
}
//identity select dropdown style
.el-select-dropdown__item {
  padding: 0 20px;
}
.el-button {
  padding: 8px 15px;
}
</style>
