import { Link } from "react-router-dom";

function LandingIntroPage() {
    return (
        <>
            <header className="main-layout__header">
                <h1 className='main-layout__brand'>
                    <Link to='/'>Onceny</Link>
                </h1>
                <div>
                    <Link to="/login" className="btn-login">
                        Login
                    </Link>
                    <Link to="/signup" className="btn-signup">
                        Sign Up
                    </Link>
                </div>
            </header>
            <main className="main-layout__main">
                <h2>Welcome to Onceny!</h2>
                <video className="landing-page__video" src="../public/assets/videos/onceny-trailer-untitled.mp4" controls autoPlay loop muted />
            </main>
        </>
    )
}

export default LandingIntroPage;