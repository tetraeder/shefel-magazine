import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { getAppAuth } from '../../firebase';

const navItems = [
  { to: '/admin', label: 'דשבורד', end: true },
  { to: '/admin/posts', label: 'פוסטים', end: false },
  { to: '/admin/tags', label: 'תגיות', end: false },
  { to: '/admin/issues', label: 'גיליונות', end: false },
];

export function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut(getAppAuth());
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-shefel-gray flex">
      <aside className="w-56 bg-shefel-black text-shefel-white flex flex-col">
        <div className="p-4 border-b border-shefel-red">
          <h2 className="font-display font-black text-shefel-red text-xl">
            ניהול
          </h2>
          <p className="text-xs text-gray-400 mt-1">כדורגל שפל</p>
        </div>

        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block px-4 py-3 rounded font-body font-bold text-sm no-underline mb-1 transition-colors ${
                  isActive
                    ? 'bg-shefel-red text-shefel-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-shefel-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full text-sm text-gray-400 hover:text-shefel-white font-body transition-colors"
          >
            התנתק
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
