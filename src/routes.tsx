import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './components/RootLayout';
import { SubscribersPage } from './pages/SubscribersPage';
import { AllSubscribersPage } from './pages/AllSubscribersPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PrivateRoute } from './components/PrivateRoute';
import { PublicRoute } from './components/PublicRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <RootLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/subscribers" replace />,
      },
      {
        path: '/subscribers',
        element: <SubscribersPage />,
      },
      {
        path: '/all-subscribers',
        element: <AllSubscribersPage />,
      },
    ],
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
]); 