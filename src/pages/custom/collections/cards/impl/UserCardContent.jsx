export default function UserCardContent({ ...user }) {
  return (
    <div className="flex items-start gap-4">
      {/* Контент справа */}
      <div className="flex flex-col">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          {user.fullName}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-xs">{user.username}</p>
      </div>
    </div>
  );
}