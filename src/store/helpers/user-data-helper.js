import { useUserStore } from "@/store/userStore";
import { useCompanyStore } from "@/store/companyStore";
import { useEventsStore } from "@/store/eventsStore";

/**
 * Преобразует объект доступа в структуру пользователя.
 * Берёт основные поля + объединяет с `data.user`.
 */
function accessDataToUserConverter(accessData) {
  if (!accessData) return null;

  const {
    data,
    permissions, // можно сохранить отдельно, если нужно
    ...rest
  } = accessData;

  // пользователь внутри data.user
  const innerUser = data?.user || {};

  // объединяем верхний уровень и вложенные данные
  const user = {
    ...rest,
    ...innerUser,
    permissions: permissions || [],
  };
  return user;
}

/**
 * Синхронизирует user + company между zustand сторами
 * для структуры вида:
 * {
 *   id, username, orgKey, role, ...,
 *   data: { user: {...}, company: {...} }
 * }
 */
export const syncUserData = (payload) => {
  if (!payload) return;

  const userStore = useUserStore.getState();
  const companyStore = useCompanyStore.getState();
  const eventsStore = useEventsStore.getState();

  const user = accessDataToUserConverter(payload);
  const company = payload?.data?.company || null;

  userStore.setUser(user);
  companyStore.setCompany(company);
  eventsStore.resumePolling('019a5d3b-cfbe-7d26-8c7c-fefb47545384');
};

export function clearUserData() {
  const userStore = useUserStore.getState();
  const companyStore = useCompanyStore.getState();
  const eventsStore = useEventsStore.getState();

  userStore.clearUser();
  companyStore.clearCompany();
  eventsStore.pausePolling();
}
