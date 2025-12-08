export default function SidebarItem({ icon, label, onClick }) {
  return (
    <div
      className="flex items-center space-x-2 px-2 cursor-pointer hover:bg-gray-100 rounded transition"
      onClick={onClick}
    >
      <span>{icon}</span>
      <span className="label hidden">{label}</span>
    </div>
  );
}
