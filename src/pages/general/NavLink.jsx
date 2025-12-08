export default function NavLink({ title, href }) {
  return (
    <li>
          <a
            href={href}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {title}
          </a>
        </li>
  );
}
