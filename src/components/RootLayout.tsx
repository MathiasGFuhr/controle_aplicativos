import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RootLayout() {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
      <header className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-indigo-900">
              Sistema de Gerenciamento de Assinaturas
            </h1>
            
            <div className="flex items-center gap-6">
              <nav className="flex gap-4">
                <NavLink
                  to="/subscribers"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/all-subscribers"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'
                    }`
                  }
                >
                  Todos os Assinantes
                </NavLink>
              </nav>

              <div className="flex items-center gap-4">
                <span className="text-sm text-indigo-600">
                  {user?.email}
                </span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:bg-indigo-50 rounded-md transition-colors"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-6">
        <Outlet />
      </main>
    </div>
  );
} 