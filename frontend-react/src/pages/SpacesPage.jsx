import { useState, useEffect, useRef } from "react";
import { getCards, createCard, getCard, deleteCard } from '../api';
import Card from '../components/Card';
import CardDialog from "../components/CardDialog";
import Header from "../components/Header";

function SpacesPage() {
    // Estado de las cards
    const [cards, setCards] = useState([]);
    const [activeCard, setActiveCard] = useState(null);

    // Declaracion de los UseEffects
    useEffect(() => {
        // hacemos el fetch de cada card
        getCards()
        .then(cards => setCards(cards))
        .catch(err => console.error(err));
    }, []);

    // funcion para crear el space
    const handleCreateCard = (type) => {
        createCard({
            title: "",
            type,
            color: "#f1f1f1",
            marker: ""
        }).then((newCard) => {
            setCards(cards => [...cards, newCard]);
            setActiveCard(newCard);
        });
    };
    
    // funcion para abrir el space
    const handleOpenCard = (card) => {
        getCard(card.id)
        .then(fullCard => setActiveCard(fullCard))
    };
    
    // funcion para actualizar los spaces despues de editarlos
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

    // funcion para borrar el space y la card
    const handleDeleteSpace = (id) => {
        deleteCard(id)
        setCards(cards.filter(card => card.id !== id))
    }
    return (
        <>
            <Header onCreateSpace={handleCreateCard}/>
            <section className="workspace__section">
                <div id="workspace-grid" className="workspace__grid" role="list" aria-live="polite" aria-label="Spaces and Notes">
                    {cards.map(card => <Card key={card.id} card={card} onOpen={handleOpenCard} onDelete={handleDeleteSpace}/>)}
                </div>
            </section>
            <CardDialog card={activeCard} onSpaceChange={handleSpaceChange} onClose={() => setActiveCard(null)}/>
        </>
    )
}

export default SpacesPage;