import { useEffect, useState, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Page from '@/pages/general/Page.jsx';
//import { useUserProfileStore } from '@/store/userProfileStore';
import '@/i18n';
import {fetchUserProfile} from '@/js/api-functions.js';
import LoginModal from "@/pages/general/auth/LoginModal";
import EventsListener from "@/pages/general/events/EventsListener";
import {useAuthStore} from '@/store/authStore';
import {useUserStore} from '@/store/userStore';
import { AppContext, useAppContextValue } from "@/store/context/AppContext";
//import api from '@/js/api';
import {authApi} from '@/js/api-auth';
import {cabinetProfileData} from '@/data/custom/cabinet/profile';

import {
  faGauge,
  faDiagramProject,
  faGear,
  faUser,
  faChartLine,
  faClipboardList,
  faListCheck,
  faProjectDiagram,
  faUsers,
  faCalendarDays,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const tasksData = {
    name : "task_list",

    header : {
        menu : {
            links : [
                      { to: '/tasks', icon: faListCheck, label: 'Задачи' },
                      { to: '/dependencies', icon: faProjectDiagram, label: 'Зависимости' },
                      { to: '/users', icon: faUsers, label: 'Пользователи' },
                      { to: '/calendar', icon: faCalendarDays, label: 'Календарь' },
                      { to: '/settings', icon: faGear, label: 'Настройки' },
                    ]
        },
        toolbar : {
            buttons : [
                          {
                              key:"add",
                              type:"simple",
                              icon: faPlus,
                              title:"modal.add.epic.title",
                              actions : {
                                  onClick : (ctx,sender) => function (){ alert(sender.key + " " + ctx.Filters.isShowFilters); }
                              }
                          }
                      ]
        }
    },
    filters :[
               {
                 key: 'status',
                 label: 'Статус',
                 type: 'select',
                 options: ['All', 'Todo', 'In Progress', 'Done', 'Blocked'],
               },
               {
                 key: 'assignee',
                 label: 'Исполнитель',
                 type: 'select',
                 options: ['All', 'Alice', 'Bob', 'Carol'],
               },
               {
                 key: 'priority',
                 label: 'Приоритет',
                 type: 'select',
                 options: ['All', 'Low', 'Medium', 'High'],
               },
               {
                 key: 'search',
                 label: 'Поиск',
                 type: 'input',
                 placeholder: 'Введите название задачи...',
               },
               {
                 key: 'showArchived',
                 label: 'Архивные',
                 type: 'input',
               },
             ],
    sidebarItems : [
      { key: "epics", label: "Эпики", icon: faClipboardList, link: "/tasks" },
      { key: "dependencies", label: "Зависимости задач", icon: faDiagramProject, link: "/dependencies" },
      { key: "analytics", label: "Analytics", icon: faChartLine, link: "/analytics" },
      { key: "profile", label: "Profile", icon: faUser, link: "/profile" },
        { key: "settings", label: "Settings", icon: faGear, link: "/settings" },
      /*{ key: 'home', icon: '🏠', label: 'Home', onClick: () => console.log('Home clicked') },
      { key: 'calendar', icon: '📅', label: 'Calendar', onClick: () => console.log('Calendar clicked') },
      { key: 'settings', icon: '⚙️', label: 'Settings', onClick: () => console.log('Settings clicked') },*/
    ],
    content:{
        type : "task_list"
    }
};

const dependenciesData = {
    name : "dependencies",

    header : {
            menu : {
                links : [
                          { to: '/tasks', icon: faListCheck, label: 'Задачи' },
                          { to: '/dependencies', icon: faProjectDiagram, label: 'Зависимости' },
                          { to: '/users', icon: faUsers, label: 'Пользователи' },
                          { to: '/calendar', icon: faCalendarDays, label: 'Календарь' },
                          { to: '/settings', icon: faGear, label: 'Настройки' },
                        ]
            },
            toolbar : {
                buttons : [
                              {
                                  key:"add",
                                  type:"simple",
                                  icon: faPlus,
                                  title:"modal.add.epic.title",
                                  actions : {
                                      onClick : (ctx,sender) => () => ctx.Modal.open({
                                                                                    title: sender.key,
                                                                                    content: (
                                                                                      <div>
                                                                                        <p>Это модальное окно создано динамически 🎉</p>
                                                                                      </div>
                                                                                    )
                                                                                  })
                                  },
                                  grants:["admin","user"]
                              }
                          ]
            }
        },
    filters :[
               {
                 key: 'status',
                 label: 'Статус',
                 type: 'select',
                 options: ['All', 'Todo', 'In Progress', 'Done', 'Blocked'],
               },
               {
                 key: 'assignee',
                 label: 'Исполнитель',
                 type: 'select',
                 options: ['All', 'Alice', 'Bob', 'Carol'],
               },
               {
                 key: 'showArchived',
                 label: 'Архивные',
                 type: 'input',
               },
             ],
    sidebarItems : [
        { key: "epics", label: "Эпики", icon: faClipboardList, link: "/tasks" },
        { key: "dependencies", label: "Зависимости задач", icon: faDiagramProject, link: "/dependencies" },
    ],
    content:{
        type : "dependencies"
    }
};

const usersData = {
    name : "user_list",

    header : {
        menu : {
            links : [
                      { to: '/tasks', icon: faListCheck, label: 'Задачи' },
                      { to: '/dependencies', icon: faProjectDiagram, label: 'Зависимости' },
                      { to: '/users', icon: faUsers, label: 'Пользователи' },
                      { to: '/calendar', icon: faCalendarDays, label: 'Календарь' },
                      { to: '/settings', icon: faGear, label: 'Настройки' },
                    ]
        },
        toolbar : {
            buttons : [
                          {
                              key:"add",
                              type:"simple",
                              icon: faPlus,
                              title:"modal.add.epic.title",
                              actions : {
                                  onClick : (ctx,sender) => function (){ alert(sender.key + " " + ctx.Filters.isShowFilters); }
                              }
                          }
                      ]
        }
    },
    filters :[
               {
                 key: 'status',
                 label: 'Статус',
                 type: 'select',
                 options: ['All', 'Todo', 'In Progress', 'Done', 'Blocked'],
               },
               {
                 key: 'assignee',
                 label: 'Исполнитель',
                 type: 'select',
                 options: ['All', 'Alice', 'Bob', 'Carol'],
               },
               {
                 key: 'priority',
                 label: 'Приоритет',
                 type: 'select',
                 options: ['All', 'Low', 'Medium', 'High'],
               },
               {
                 key: 'search',
                 label: 'Поиск',
                 type: 'input',
                 placeholder: 'Введите название задачи...',
               },
               {
                 key: 'showArchived',
                 label: 'Архивные',
                 type: 'checkbox',
               },
             ],
    sidebarItems : [
      { key: "users", label: "Пользователи", icon: faClipboardList, link: "/users" },
      { key: "teams", label: "Команды", icon: faDiagramProject, link: "/teams" },
    ],
    content:{
        type : "user_list"
    }
};

export default function App() {
  const ctxValue = useAppContextValue();

  return (
    <AppContext.Provider value={ctxValue}>
      <AppRoutes />
      <LoginModal />
      <EventsListener />
    </AppContext.Provider>
  );
}

// Вынесем логику маршрутов в отдельный компонент
function AppRoutes() {
  const { main } = useContext(AppContext);

  const {auth,user,list} = main;

  console.log(list);

  const me = auth((state) => state.me);
  const currentUser = user((state) => state.user);

  useEffect(() => {
    me();
  }, [me]);

  return (
    <Routes>
      {currentUser ? (
        <>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="/tasks" element={<Page data={tasksData} />} />
          <Route path="/dependencies" element={<Page data={dependenciesData} />} />
          <Route path="/users" element={<Page data={usersData} />} />
          <Route path="/cabinet/profile" element={<Page data={cabinetProfileData} />}/>
        </>
      ) : (
        <Route path="*" element={<div>Требуется авторизация</div>} />
      )}
    </Routes>
  );
}


/*export default function App() {
  const ctxValue = useAppContextValue();

  const {me} = useAuthStore();
  const { user, setUser } = useUserStore();

  useEffect(() => {
    me();
  }, [me]);

  return (
    <AppContext.Provider value={ctxValue}>
      <Routes>
        {user ? (
          <>
            <Route path="/" element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<Page data={tasksData} />} />
            <Route path="/dependencies" element={<Page data={dependenciesData} />} />
            <Route path="/users" element={<Page data={usersData} />} />
            <Route path="/cabinet/profile" element={<Page data={cabinetProfileData} />}/>
          </>
        ) : (
          <Route path="*" element={<div>Требуется авторизация</div>} />
        )}
      </Routes>

      <LoginModal />
    </AppContext.Provider>
  );
}*/