import { getSpaces } from "../api"

function HomeCard() {
    let numSpaces = 0;
    getSpaces().then(space => { numSpaces += 1 } )
    console.log(numSpaces);
    return (
        <article className="home-card">
            This is a card
        </article>
    )
}

export default HomeCard;