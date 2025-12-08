import api from "@/js/api";

const urls ={
    login : "/auth/login",
    me : "/auth/me"
};

export const authApi = {
  login: async ({ username, password, rememberme }) => {
    const res = await api.post(
      urls.login,
      { username, password, rememberme }, // JSON тело
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;//accessDataToUserConverter(res.data);
  },
  isLoginUrl : (url) => url.endsWith(urls.login),

  me: async () => {
    const res = await api.get(urls.me);
    return res.data;//accessDataToUserConverter(res.data);
  },
  isMeUrl : (url) => url.endsWith(urls.me),
};
