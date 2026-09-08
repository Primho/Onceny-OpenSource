import { Outlet } from 'react-router-dom';

function MainLayout() {
    return (
        <main id="main" className='main-app'>
            <Outlet />
        </main>
    )
}

export default MainLayout;