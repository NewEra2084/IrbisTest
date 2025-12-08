import {
  faListCheck,
  faProjectDiagram,
  faUsers,
  faCalendarDays,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

export const menuLinksData = [
    { to: '/tasks', icon: faListCheck, label: 'Задачи' },
    { to: '/dependencies', icon: faProjectDiagram, label: 'Зависимости' },
    { to: '/users', icon: faUsers, label: 'Пользователи' },
    { to: '/calendar', icon: faCalendarDays, label: 'Календарь' },
    { to: '/settings', icon: faGear, label: 'Настройки' },
];