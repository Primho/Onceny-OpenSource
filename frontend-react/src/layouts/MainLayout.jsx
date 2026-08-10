import { Outlet } from 'react-router-dom';

function MainLayout() {
    return (
        <main id="main">
            <Outlet />
        </main>
    )
}

export default MainLayout;