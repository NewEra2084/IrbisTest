import api from "@/js/api";

export async function waitChangeEvents(uuid) {
  try {
        const res = await api.get(`/events/list?lastKey=${uuid}`);
        if (res.data && res.data.length>0){
            return {
                changes:res.data,
                lastChangeId:res.data[res.data.length-1].eventKey
            };
        }
        return {
            changes:[]
        };
  } catch (err) {
        console.error("Ошибка при загрузке изменений:", err);
        throw err;
  }
}