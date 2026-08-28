import { useState } from "react";
import { getSpaces } from "../api"

function HomeCard() {
    const [numSpaces, setNumSpaces] = useState(0);
    getSpaces().then(dtaSpaces => setNumSpaces(dtaSpaces.length))

    return (
        <>
            <article className="home-card">
                <h2>Total Spaces: </h2>{numSpaces}
            </article>

            <section className="home-card">
                <div>
                    <h3>Recent Spaces</h3>
                    <div>
                        <span>Search</span>
                    </div>
                </div>
                <div>
                    <article>
                        <div>
                            <span>Tag</span>
                            <span>Icon</span>
                        </div>
                        <div>
                            <p>title space</p>
                            <span>content space</span>
                        </div>
                    </article>
                    <article>
                        <div>
                            <span>Tag</span>
                            <span>Icon</span>
                        </div>
                        <div>
                            <p>title space</p>
                            <span>content space</span>
                        </div>
                    </article>
                    <article>
                        <div>
                            <span>Tag</span>
                            <span>Icon</span>
                        </div>
                        <div>
                            <p>title space</p>
                            <span>content space</span>
                        </div>
                    </article>
                    <article>
                        <div>
                            <span>Tag</span>
                            <span>Icon</span>
                        </div>
                        <div>
                            <p>title space</p>
                            <span>content space</span>
                        </div>
                    </article>
                </div>
            </section>
        </>
    )
}

export default HomeCard;