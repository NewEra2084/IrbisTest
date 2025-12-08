import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUserStore } from '@/store/userStore';

const UserProfileLink = () => {
  //const { user, avatarLink } = useAuthStore();
  const { user, avatarLink } = useUserStore();

  // Выбираем актуальную картинку: если есть avatarKey, используем серверную ссылку, иначе локальный avatar
  const avatarSrc = user.avatarKey ? avatarLink() : user.avatar;

  return (
    <NavLink
      to="/cabinet/profile"
      className={({ isActive }) =>
        `flex items-center space-x-2 px-2 py-1 border rounded-md shadow-sm transition-colors duration-200 ${
          isActive
            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-gray-700'
            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`
      }
    >
      <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={user.fullName || 'Пользователь'}
            className="h-8 w-8 object-cover rounded-full"
          />
        ) : (
          <div className="text-gray-400 text-[7px] text-center">Нет фото</div>
        )}
      </div>
      <div className="text-left text-sm hidden sm:block">
        <div className="font-semibold text-gray-800 dark:text-white">
          {user.fullName || user.username}
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-xs">
          {user.role}
        </div>
      </div>
    </NavLink>
  );
};

export default UserProfileLink;
