import { defineStore } from "pinia";

type Role = "PATIENT" | "SECRETARY" | "ADMIN";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("sc_token") || "",
    user: (localStorage.getItem("sc_user")
      ? JSON.parse(localStorage.getItem("sc_user")!)
      : null) as User | null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.token,
    role: (s) => s.user?.role,
    isAdminish: (s) => s.user?.role === "SECRETARY" || s.user?.role === "ADMIN",
  },
  actions: {
    setSession(token: string, user: User) {
      this.token = token;
      this.user = user;
      localStorage.setItem("sc_token", token);
      localStorage.setItem("sc_user", JSON.stringify(user));
    },
    clearSession() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("sc_token");
      localStorage.removeItem("sc_user");
    },
  },
});