import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getCurrentUser } from '../api';

function AppLayout() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((response) => setUser(response.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <main className="workspace">Loading...</main>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div id='main-app'>
        <Sidebar user={user} />
        <main className="workspace">
            <Outlet />
        </main>
      </div>
    </>
  )
}

export default AppLayout;