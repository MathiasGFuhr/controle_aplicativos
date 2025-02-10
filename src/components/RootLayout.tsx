import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RootLayout() {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100">
      <header className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.svg" 
                alt="SubsManager Logo" 
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-indigo-900 text-center sm:text-left">
                  SubsManager
                </h1>
                <p className="text-xs text-indigo-600 hidden sm:block">
                  Sistema de Gerenciamento de Assinaturas
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <nav className="flex gap-4 w-full sm:w-auto justify-center">
                <NavLink
                  to="/subscribers"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                      isActive 
                        ? 'text-white bg-indigo-600' 
                        : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/all-subscribers"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                      isActive 
                        ? 'text-white bg-indigo-600' 
                        : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                    }`
                  }
                >
                  Todos os Assinantes
                </NavLink>
              </nav>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
                <span className="text-sm text-indigo-600 hidden sm:inline">
                  {user?.email}
                </span>
                <button
                  onClick={signOut}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-6 px-4">
        <Outlet />
      </main>
    </div>
  );
} 