import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function AppLayout() {
  return (
    <>
        <Sidebar />
        <main id="main" className="workspace">
            <Outlet />
        </main>
    </>
  )
}

export default AppLayout;