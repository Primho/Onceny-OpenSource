import HomeCard from "../components/HomeCard";

function HomePage() {
    const name = 'Kevin';
    return (
        <div className="main-home--content">
            <header>
                <h2>Good morning {name}!!</h2>
                <span>Let's make today count</span>
            </header>
            <section className="home-grid">
                <HomeCard />
            </section>
        </div>
    )
}

export default HomePage;