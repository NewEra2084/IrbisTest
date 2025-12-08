import mockApi from "@/js/api-mock";

export default function usersBuildApiFunction() {
  return {
    async list(params = {}) {
          console.log("list:"+JSON.stringify(params));

          const tmpArr = [
                                                          {
                                                            id: 'user-1',
                                                            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
                                                            username: 'alice123',
                                                            fullName: 'Alice Johnson',
                                                            skills: ['frontend', 'design'],
                                                            status: 'Active',
                                                            role: 'Admin',
                                                          },
                                                          {
                                                            id: 'user-2',
                                                            avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
                                                            username: 'bob_dev',
                                                            fullName: 'Bob Smith',
                                                            skills: ['backend', 'devops'],
                                                            status: 'Offline',
                                                            role: 'Developer',
                                                          },
                                                          {
                                                            id: 'user-3',
                                                            avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
                                                            username: 'carol42',
                                                            fullName: 'Carol White',
                                                            skills: ['frontend', 'backend'],
                                                            status: 'Busy',
                                                            role: 'QA',
                                                          },
                                   ];
          const arr = [];
          for (let i=0; i<20; i++){
            arr[i] = {...tmpArr[i%3], id:'user-'+i};
          }

          const data = {count:arr.length, items:arr};
          return await mockApi(data);
    },

    // кастомный метод для users
    activateUser: async (id, api) => {
      // api.updateItem придёт из объединения с baseBuildFunction
      return api.updateItem(id, { active: true });
    },
  };
}