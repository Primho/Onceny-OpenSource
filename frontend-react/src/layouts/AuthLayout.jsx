import { Outlet } from 'react-router-dom';
import Login from "../pages/AuthForm";

function AuthLayout() {
    return (
        <>
            <Outlet />
        </>
    )
}

export default AuthLayout;