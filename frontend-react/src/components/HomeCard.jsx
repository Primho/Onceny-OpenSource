import { useState } from "react";
import { getSpaces } from "../api"

function HomeCard() {
    const [numSpaces, setNumSpaces] = useState(0);
    getSpaces().then(dtaSpaces => setNumSpaces(dtaSpaces.length))


    return (
        <article className="home-card">
            {numSpaces}
        </article>
    )
}

export default HomeCard;