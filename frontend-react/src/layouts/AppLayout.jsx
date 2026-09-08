import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function AppLayout() {
  return (
    <>
      <div id='main-app'>
        <Sidebar />
        <main className="workspace">
            <Outlet />
        </main>
      </div>
    </>
  )
}

export default AppLayout;