import api from '@/js/api.js';

export async function fetchUserProfile() {
    const res = await api.get("/auth/me");

    return null;
    /*try {
        const res = await api.get("/auth/me"); // GET /api/users
        const data = res.data;
        return data;
    } catch (err) {
        console.error("Ошибка загрузки пользователей:", err);
        return null;
    }*/


  /*const resp = await api.get("/auth/me")
  if (resp.ok) {
    const data = await resp.json();
    return data;
  } else if (resp.status === 401 || resp.status === 403) {
    alert(resp.status);
    return null; // Нет авторизации
  } else {
    return {
               avatar: '',
               fullName: 'Тарас Иванов',
               username: 'ivanov',
               skills: ['backend', 'devops'],
               role: 'Developer',
               status: 'active',
    };
    //throw new Error(`Ошибка запроса профиля: ${resp.status}`);
  }*/
}