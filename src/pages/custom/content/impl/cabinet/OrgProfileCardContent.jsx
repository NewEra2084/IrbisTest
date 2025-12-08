import PhotoMaker from '@/components/camera/PhotoMaker';
import EditableText from '@/components/ui/controls/EditableText';

export default function OrgProfileCardContent({imageLink, onSaveImage, onRemoveImage }) {
  return (
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0">
      {/* Фото */}
      <div className="flex justify-center md:justify-start">
        <PhotoMaker imageLink={imageLink} onSave={onSaveImage} onRemove={onRemoveImage} />
      </div>

      {/* Информация */}
      <div className="flex-1 pt-6">
        <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            Профиль компании
        </h2>
      </div>
    </div>
  );
}
