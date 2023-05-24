import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const userName = ref("");
  function setUserName(name) {
    userName.value = name;
  }

  return { userName, setUserName };
});
