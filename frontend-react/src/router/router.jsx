import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import HomePage from '../pages/HomePage';
import SpacesPage from '../pages/SpacesPage';
import AuthForm from '../pages/AuthForm';

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
                element: <About />
            }
        ]
    },
    {
        path: '/',
        children: [
            {
                path: 'login',
                element: <AuthForm mode="login"/>
            },
            {
                path: 'signup',
                element: <AuthForm mode="signup"/>
            }
        ]
    },
    {
        path: '/app',
        element: <AppLayout />,
        children: [
            {
                index: true, 
                element: <HomePage /> 
            },
            {
                path: 'spaces',
                element: <SpacesPage />
            }
        ]
    }
]);

export default router;