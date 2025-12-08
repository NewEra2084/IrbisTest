import PhotoMaker from '@/components/camera/PhotoMaker';
import EditableText from '@/components/ui/controls/EditableText';

export default function UserProfileCardContent({ user, saveFullName, imageLink, onSaveImage, onRemoveImage }) {
  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0">
      {/* Фото */}
      <div className="flex justify-center md:justify-start">
        <PhotoMaker imageLink={imageLink} onSave={onSaveImage} onRemove={onRemoveImage} />
      </div>

      {/* Информация */}
      <div className="flex-1 pt-6">
        <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            <EditableText value={user.fullName} onSave={saveFullName}/>
        </h2>
        <p className="text-gray-600 dark:text-gray-300">{user.username}</p>

        <div className="mt-2 text-base space-y-1">
          <div className="flex">
            <span className="w-20 text-gray-500 dark:text-gray-400">Skills:</span>
            <span className="text-gray-700 dark:text-gray-200">
              {user.skills ? user.skills.join(", ") : "Не заданы"}
            </span>
          </div>
          <div className="flex">
            <span className="w-20 text-gray-500 dark:text-gray-400">Role:</span>
            <span className="text-gray-700 dark:text-gray-200">{user.role}</span>
          </div>
        </div>

        <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          {user.status}
        </span>
      </div>
    </div>
  );
}
