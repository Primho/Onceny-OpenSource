import { useState, useEffect, useRef } from "react";
import { getCards, createCard, getCard } from './api';
import Sidebar from "./components/Sidebar";
import Card from './components/Card';
import CardDialog from "./components/CardDialog";

function App() {

  // declarar el estado de las cards
  const [cards, setCards] = useState([]);
  const [activeCard, setActiveCard] = useState(null);

  // declaracion del useEffect
  useEffect(() => {
    // hacemos el fetch de cada card
    getCards()
    .then(cards => setCards(cards))
    .catch(err => console.error(err));
  }, [])

  // funcion para abrir la card
  const handleOpenCard = (card) => {
    getCard(card.id)
    .then(fullCard => setActiveCard(fullCard))
  }

  const handleSpaceChange = (updatedCard) => {
    setActiveCard(updatedCard);

    setCards(cards =>
        cards.map(card =>
            card.id === updatedCard.id
                ? {
                    ...card,
                    title: updatedCard.title,
                    color: updatedCard.color,
                    marker: updatedCard.marker,
                    tag: updatedCard.tag
                  }
                : card
        )
    );
  };


  return (
    <>
      {/* TODO: Sidebar */}
      <Sidebar/>
      {/* main page */}
      <main id="main" className="workspace">
        {/* TODO: Header */}
        {/* Cards */}
        <section className="workspace__section">
          <div id="workspace-grid" className="workspace__grid" role="list" aria-live="polite" aria-label="Spaces and Notes">
            {cards.map(card => <Card key={card.id} card={card} onOpen={handleOpenCard}/>)}
          </div>
        </section>
      </main>
      <CardDialog card={activeCard} onSpaceChange={handleSpaceChange} onClose={() => setActiveCard(null)}/>
    </>
  )
}

export default App;