import NavLink from './NavLink';

export default function NavLinks({ links = [] }) {
  return (
    <ul className="flex space-x-4">
      {links.map((item) => (
        <NavLink key={item.key} title={item.title} href={item.link} />
      ))}
    </ul>
  );
}
