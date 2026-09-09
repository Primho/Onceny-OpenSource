import { Link } from "react-router-dom";

function LandingIntroPage() {
    return (
        <div className="landing-page">
            <header className="landing-page__header">
                <h1>Onceny</h1>
                <div>
                    <Link to="/login" className="btn-login">
                        Login
                    </Link>
                    <Link to="/signup" className="btn-signup">
                        Sign Up
                    </Link>
                </div>
            </header>
            <main className="landing-page__main">
                <h2>Welcome to Onceny!</h2>
                <video className="landing-page__video" src="../public/assets/videos/onceny-trailer-untitled.mp4" controls autoPlay loop muted />
                
            </main>
        </div>
    )
}

export default LandingIntroPage;