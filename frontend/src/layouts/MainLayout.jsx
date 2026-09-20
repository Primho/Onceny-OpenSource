import { Outlet } from 'react-router-dom';

function MainLayout() {
    return (
        <div id="main" className='main-layout'>
            <Outlet />
        </div>
    )
}

export default MainLayout;