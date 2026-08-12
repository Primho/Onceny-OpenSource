import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';

import LandingIntroPage from '../pages/LandingIntroPage';
import AboutPage from '../pages/AboutPage';
import HomePage from '../pages/HomePage';
import SpacesPage from '../pages/SpacesPage';
import FavoritesPage from '../pages/FavoritesPage';
import FoldersPage from '../pages/FoldersPage';
import SharedPage from '../pages/SharedPage';

import AuthForm from '../components/AuthForm';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingIntroPage />
      },
      {
        path: 'about',
        element: <AboutPage />
      }
    ]
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <AuthForm mode="login" />
      },
      {
        path: '/signup',
        element: <AuthForm mode="signup" />
      }
    ]
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        path: 'home',
        index: true,
        element: <HomePage />
      },
      {
        path: 'spaces',
        element: <SpacesPage />
      },
      {
        path: 'favorites',
        element: <FavoritesPage />
      },
      {
        path: 'folders',
        element: <FoldersPage />
      },
      {
        path: 'shared',
        element: <SharedPage />
      }
    ]
  }
]);

export default router;