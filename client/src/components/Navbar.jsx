import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const role = localStorage.getItem('role');
  const location = useLocation();

  if (location.pathname === "/") return null;

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/resource-management', label: 'Resources', icon: '📦', roles: ['Admin'] },
    { to: '/purchases', label: 'Purchases', icon: '🛒', roles: ['Admin', 'Logistics'] },
    { to: '/transfers', label: 'Transfers', icon: '🔄', roles: ['Admin', 'Logistics'] },
    { to: '/assignments', label: 'Assignments', icon: '📋', roles: ['Admin', 'Commander'] },
    { to: '/auditlog', label: 'Audit Log', icon: '📝', roles: ['Admin'] }
  ];

  function logout() {
    localStorage.clear();
    window.location.href = '/';
  }

  return (
    <nav className="bg-gradient-to-r from-emerald-700 to-emerald-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🛡️</div>
            <span className="text-white font-bold text-xl">Military Asset System</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {links
              .filter(link => !link.roles || link.roles.includes(role))
              .map(link => (
                <Link
                  to={link.to}
                  key={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    location.pathname === link.to
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-emerald-100 hover:bg-emerald-600 hover:text-white'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-emerald-600 px-3 py-1 rounded-lg">
              <span className="text-lg">👤</span>
              <span className="text-emerald-100 text-sm font-medium">{role}</span>
            </div>
            
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            {links
              .filter(link => !link.roles || link.roles.includes(role))
              .map(link => (
                <Link
                  to={link.to}
                  key={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    location.pathname === link.to
                      ? 'bg-emerald-600 text-white'
                      : 'text-emerald-100 hover:bg-emerald-600 hover:text-white'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
