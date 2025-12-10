import api from "@/js/api";
import mockApi from "@/js/api-mock";

export const cabinetApi = {
   buildAvatarUrl : (key) => '/api/attachments/'+key+'/get',//'/attachments/'+key+'/get',
   uploadAvatar: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
            const res = await api.post("/me/avatar/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
      } catch (err) {
        console.error("Ошибка при загрузке аватара:", err);
        throw err;
      }
  },
  deleteAvatar : async () => {
    try {
                const res = await api.post("/me/avatar/remove", {}, {
                    headers: { "Content-Type": "application/json" }
                });
                return true;
          } catch (err) {
            console.error("Ошибка при удалении аватара:", err);
            throw err;
          }
  },
  setFullName : async (name) => {
        try {
            const res = await api.post("/me/set-full-name", {"name":name}, {
                headers: { "Content-Type": "application/json" }
            });
            return true;
        } catch (err) {
            console.error("Ошибка при сохранении имени:", err);
            throw err;
        }
  },
  getOrgTypes : async (lang) => {
        return await mockApi([
            {key:1,value:"ИТ компания "+lang},
            {key:2,value:"Другая компания "+lang},
        ]);
  },
  getOrgRoles : async (lang) => {
        return await mockApi([
            {key:1,value:"Пользователь "+lang},
            {key:2,value:"Другая роль "+lang},
        ]);
  }
};
