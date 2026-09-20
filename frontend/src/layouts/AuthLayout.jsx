import { Outlet, Link } from 'react-router-dom';

function AuthLayout() {
    return (
        <div className='auth-layout'>
            <header className='auth-layout__header'>
                <h1 className='auth-layout__brand'>
                    <Link to='/'>Onceny</Link>
                </h1>
            </header>
            <main className='auth-layout__content'>
                <Outlet />
            </main>
        </div>
        
    )
}

export default AuthLayout;