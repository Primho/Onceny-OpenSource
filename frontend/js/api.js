const getCards = async () => {
    const response = await fetch('http://127.0.0.1:5000/api/cards');
    const data = await response.json()
    return data;
};

const createCard = async (cardData) => {
    const response = await fetch('http://127.0.0.1:5000/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData)
    });

    return await response.json();
};

const updateCard = async (cardDataId, cardDataTitle) => {
    const response = await fetch(`http://127.0.0.1:5000/api/cards/${cardDataId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: cardDataTitle })
    });
    return await response.json();
}

const deleteCard = async (cardDataId) => {
    const response = await fetch(`http://127.0.0.1:5000/api/cards/${cardDataId}`, { method: 'DELETE' });
    return await response.json();
};

export {getCards, createCard, updateCard, deleteCard};