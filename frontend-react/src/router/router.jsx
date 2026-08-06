import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import HomePage from '../pages/HomePage';
import SpacesPage from '../pages/SpacesPage';
import AuthForm from '../pages/AuthForm';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <AuthLayout/>,
        children: [
            {
                path: 'login',
                index: true,
                element: <AuthForm mode='login' />
            },
            {
                path: 'signup',
                element: <AuthForm mode='signup'/>
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
                element: <HomePage/>
            },
            {
                path: 'spaces',
                element: <SpacesPage/>
            }
        ]
    }
]);

export default router;